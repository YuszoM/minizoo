import { getDayOverride } from "@/lib/booking/day-overrides";
import { getBookingSettings } from "@/lib/booking/settings";
import { createServiceRoleClient } from "@/lib/supabase/clients";

export type SlotAvailability = {
  time: string;
  booked: number;
  max: number;
  remaining: number;
  full: boolean;
};

export type DayAvailability = {
  date: string;
  blocked: boolean;
  unlocked: boolean;
  slots: SlotAvailability[];
};

export async function getOccupancyForDate(
  dateIso: string,
  timeSlots: string[],
): Promise<Record<string, number>> {
  const occupancy: Record<string, number> = {};
  for (const time of timeSlots) {
    occupancy[time] = 0;
  }

  const supabase = createServiceRoleClient();
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

export async function getDayAvailability(dateIso: string): Promise<DayAvailability> {
  const [settings, override] = await Promise.all([
    getBookingSettings(),
    getDayOverride(dateIso),
  ]);
  const occupancy = await getOccupancyForDate(dateIso, settings.timeSlots);

  const blocked = Boolean(override?.blocked);
  const unlocked = Boolean(override?.unlocked);

  const slots = settings.timeSlots.map((time) => {
    const booked = occupancy[time] ?? 0;
    const max =
      override?.slotLimits[time] != null
        ? override.slotLimits[time]!
        : settings.maxGuestsPerSlot;
    const remaining = blocked ? 0 : Math.max(0, max - booked);
    return {
      time,
      booked,
      max,
      remaining,
      full: blocked || remaining === 0 || max === 0,
    };
  });

  return { date: dateIso, blocked, unlocked, slots };
}

export async function getSlotAvailability(dateIso: string): Promise<SlotAvailability[]> {
  const day = await getDayAvailability(dateIso);
  return day.slots;
}

export async function checkSlotCapacity(
  dateIso: string,
  visitTime: string,
  guestCount: number,
): Promise<{ ok: true; remaining: number } | { ok: false; error: string }> {
  const day = await getDayAvailability(dateIso);

  if (day.blocked) {
    return { ok: false, error: "Ten dzień jest zamknięty dla rezerwacji." };
  }

  const slot = day.slots.find((s) => s.time === visitTime);

  if (!slot) {
    return { ok: false, error: "Nieprawidłowa godzina wizyty." };
  }

  if (slot.max === 0 || slot.full) {
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
