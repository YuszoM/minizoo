import { offers } from "@/data/offers";
import { checkSlotCapacity } from "@/lib/booking/capacity";
import { generateNumericTicketCode, generateOrderNumber } from "@/lib/booking/ticket-code";
import type { CreateBookingInput, CreateBookingResult } from "@/lib/booking/types";
import { sendBookingEmails } from "@/lib/email/send-booking-emails";
import { createServiceRoleClient } from "@/lib/supabase/clients";

const TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00"] as const;

function isMonday(date: Date) {
  return date.getDay() === 1;
}

function isPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function parseVisitDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function validateGuestCount(offerId: string, guestCount: number): string | null {
  if (offerId === "rodzinna" && (guestCount < 2 || guestCount > 6)) {
    return "Spotkanie rodzinne: wybierz od 2 do 6 osób.";
  }
  if (offerId === "urodziny" && (guestCount < 1 || guestCount > 10)) {
    return "Urodziny: maksymalnie 10 dzieci w pakiecie.";
  }
  if (offerId === "szkola" && (guestCount < 15 || guestCount > 30)) {
    return "Lekcja szkolna: od 15 do 30 uczniów.";
  }
  return null;
}

function computeTotal(offerId: string, unitPrice: number, guestCount: number) {
  if (offerId === "szkola") return unitPrice * guestCount;
  return unitPrice;
}

async function insertUniqueTicketCodes(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  bookingId: string,
  count: number,
): Promise<string[] | null> {
  const codes: string[] = [];
  const maxAttempts = count * 8;

  for (let attempt = 0; attempt < maxAttempts && codes.length < count; attempt++) {
    const candidate = generateNumericTicketCode();
    if (codes.includes(candidate)) continue;

    const { error } = await supabase.from("tickets").insert({
      booking_id: bookingId,
      ticket_code: candidate,
    });

    if (!error) {
      codes.push(candidate);
    } else if (error.code !== "23505") {
      console.error("[booking] ticket insert error:", error);
      return null;
    }
  }

  if (codes.length !== count) return null;
  return codes;
}

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "System rezerwacji nie jest skonfigurowany (Supabase)." };
  }

  const offer = offers.find((o) => o.id === input.offerId);
  if (!offer) {
    return { ok: false, error: "Nieprawidłowy pakiet." };
  }

  const visitDate = parseVisitDate(input.visitDate);
  if (!visitDate) {
    return { ok: false, error: "Nieprawidłowa data wizyty." };
  }

  if (isPast(visitDate) || isMonday(visitDate)) {
    return { ok: false, error: "Wybrany termin jest niedostępny." };
  }

  if (!TIME_SLOTS.includes(input.visitTime as (typeof TIME_SLOTS)[number])) {
    return { ok: false, error: "Nieprawidłowa godzina wizyty." };
  }

  const guestError = validateGuestCount(input.offerId, input.guestCount);
  if (guestError) return { ok: false, error: guestError };

  const name = input.customerName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();

  if (name.length < 3) return { ok: false, error: "Podaj imię i nazwisko." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Podaj poprawny adres e-mail." };
  }
  if (phone.replace(/\D/g, "").length < 9) {
    return { ok: false, error: "Podaj poprawny numer telefonu." };
  }

  const visitDateIso = toIsoDate(visitDate);
  const capacityCheck = await checkSlotCapacity(visitDateIso, input.visitTime, input.guestCount);
  if (!capacityCheck.ok) {
    return { ok: false, error: capacityCheck.error };
  }

  const totalPrice = computeTotal(offer.id, offer.price, input.guestCount);
  const orderNumber = generateOrderNumber();

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      order_number: orderNumber,
      customer_name: name,
      email,
      phone,
      offer_id: offer.id,
      offer_title: offer.title,
      visit_date: visitDateIso,
      visit_time: input.visitTime,
      guest_count: input.guestCount,
      total_price: totalPrice,
      status: "confirmed",
    })
    .select("id")
    .single();

  if (bookingError || !booking) {
    console.error("[booking] insert error:", bookingError);
    return { ok: false, error: "Nie udało się zapisać rezerwacji. Spróbuj ponownie." };
  }

  const ticketCodes = await insertUniqueTicketCodes(supabase, booking.id, input.guestCount);
  if (!ticketCodes) {
    await supabase.from("bookings").delete().eq("id", booking.id);
    return { ok: false, error: "Nie udało się wygenerować biletów. Spróbuj ponownie." };
  }

  const emailResult = await sendBookingEmails({
    to: email,
    customerName: name,
    orderNumber,
    offerTitle: offer.title,
    visitDate,
    visitTime: input.visitTime,
    guestCount: input.guestCount,
    totalPrice,
    ticketCodes,
  });

  if (!emailResult.ok) {
    console.warn("[booking] emails failed but booking saved:", orderNumber, emailResult.error);
    // Rezerwacja zapisana — klientka widzi w panelu; maile można wysłać ręcznie
  }

  return { ok: true, orderNumber, ticketCodes };
}

export async function fetchBookingsForDate(dateIso: string) {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("visit_date", dateIso)
    .eq("status", "confirmed")
    .order("visit_time")
    .order("created_at");

  if (error || !bookings?.length) return [];

  const ids = bookings.map((b) => b.id);
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .in("booking_id", ids)
    .order("created_at");

  const byBooking = new Map<string, typeof tickets>();
  for (const t of tickets ?? []) {
    const list = byBooking.get(t.booking_id) ?? [];
    list.push(t);
    byBooking.set(t.booking_id, list);
  }

  return bookings.map((b) => ({
    ...b,
    tickets: byBooking.get(b.id) ?? [],
  }));
}

export { TIME_SLOTS, toIsoDate };
