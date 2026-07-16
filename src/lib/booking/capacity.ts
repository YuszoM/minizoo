import { BOOKING_TIME_SLOTS } from "@/lib/admin/hub-constants";
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
  slots: SlotAvailability[];
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

export async function getDayAvailability(dateIso: string): Promise<DayAvailability> {
  const [{ maxGuestsPerSlot }, override, occupancy] = await Promise.all([
    getBookingSettings(),
    getDayOverride(dateIso),
    getOccupancyForDate(dateIso),
  ]);

  const blocked = Boolean(override?.blocked);

  const slots = BOOKING_TIME_SLOTS.map((time) => {
    const booked = occupancy[time] ?? 0;
    const max =
      override?.slotLimits[time] != null ? override.slotLimits[time]! : maxGuestsPerSlot;
    const remaining = blocked ? 0 : Math.max(0, max - booked);
    return {
      time,
      booked,
      max,
      remaining,
      full: blocked || remaining === 0 || max === 0,
    };
  });

  return { date: dateIso, blocked, slots };
}

/** @deprecated use getDayAvailability — retained for callers expecting only slots */
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
