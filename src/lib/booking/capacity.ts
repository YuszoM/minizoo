import { BOOKING_TIME_SLOTS } from "@/lib/admin/hub-constants";
import { getBookingSettings } from "@/lib/booking/settings";
import { createServiceRoleClient } from "@/lib/supabase/clients";

export type SlotAvailability = {
  time: string;
  booked: number;
  max: number;
  remaining: number;
  full: boolean;
};

export async function getOccupancyForDate(dateIso: string): Promise<Record<string, number>> {
  const supabase = createServiceRoleClient();
  const occupancy: Record<string, number> = {};
  for (const time of BOOKING_TIME_SLOTS) {
    occupancy[time] = 0;
  }

  if (!supabase) return occupancy;

  const { data, error } = await supabase
    .from("bookings")
    .select("visit_time, guest_count")
    .eq("visit_date", dateIso)
    .eq("status", "confirmed");

  if (error || !data) return occupancy;

  for (const row of data) {
    if (row.visit_time in occupancy) {
      occupancy[row.visit_time]! += row.guest_count;
    }
  }

  return occupancy;
}

export async function getSlotAvailability(dateIso: string): Promise<SlotAvailability[]> {
  const { maxGuestsPerSlot } = await getBookingSettings();
  const occupancy = await getOccupancyForDate(dateIso);

  return BOOKING_TIME_SLOTS.map((time) => {
    const booked = occupancy[time] ?? 0;
    const remaining = Math.max(0, maxGuestsPerSlot - booked);
    return {
      time,
      booked,
      max: maxGuestsPerSlot,
      remaining,
      full: remaining === 0,
    };
  });
}

export async function checkSlotCapacity(
  dateIso: string,
  visitTime: string,
  guestCount: number,
): Promise<{ ok: true; remaining: number } | { ok: false; error: string }> {
  const slots = await getSlotAvailability(dateIso);
  const slot = slots.find((s) => s.time === visitTime);

  if (!slot) {
    return { ok: false, error: "Nieprawidłowa godzina wizyty." };
  }

  if (slot.full) {
    return { ok: false, error: "Ten termin jest już w pełni zarezerwowany." };
  }

  if (guestCount > slot.remaining) {
    return {
      ok: false,
      error: `W tym terminie zostało tylko ${slot.remaining} ${slot.remaining === 1 ? "miejsce" : slot.remaining < 5 ? "miejsca" : "miejsc"}.`,
    };
  }

  return { ok: true, remaining: slot.remaining };
}
