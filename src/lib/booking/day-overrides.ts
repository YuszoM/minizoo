import { createServiceRoleClient } from "@/lib/supabase/clients";
import { getBookingSettings } from "@/lib/booking/settings";

export type DayOverride = {
  visitDate: string;
  blocked: boolean;
  unlocked: boolean;
  note: string | null;
  /** Per-slot max; missing key = use global default */
  slotLimits: Record<string, number>;
};

export async function getDayOverride(dateIso: string): Promise<DayOverride | null> {
  const supabase = createServiceRoleClient();
  if (!supabase) return null;

  const { data: day, error } = await supabase
    .from("booking_day_overrides")
    .select("visit_date, blocked, unlocked, note")
    .eq("visit_date", dateIso)
    .maybeSingle();

  if (error) {
    // unlocked może jeszcze nie istnieć
    const legacy = await supabase
      .from("booking_day_overrides")
      .select("visit_date, blocked, note")
      .eq("visit_date", dateIso)
      .maybeSingle();
    if (legacy.error || !legacy.data) {
      if (error) console.error("[day-override] fetch:", error);
      return null;
    }
    const { data: slots } = await supabase
      .from("booking_slot_limits")
      .select("visit_time, max_guests")
      .eq("visit_date", dateIso);
    const slotLimits: Record<string, number> = {};
    for (const row of slots ?? []) {
      slotLimits[row.visit_time] = row.max_guests;
    }
    return {
      visitDate: legacy.data.visit_date,
      blocked: legacy.data.blocked,
      unlocked: false,
      note: legacy.data.note,
      slotLimits,
    };
  }
  if (!day) return null;

  const { data: slots } = await supabase
    .from("booking_slot_limits")
    .select("visit_time, max_guests")
    .eq("visit_date", dateIso);

  const slotLimits: Record<string, number> = {};
  for (const row of slots ?? []) {
    slotLimits[row.visit_time] = row.max_guests;
  }

  return {
    visitDate: day.visit_date,
    blocked: day.blocked,
    unlocked: Boolean(day.unlocked),
    note: day.note,
    slotLimits,
  };
}

export async function getDayFlagsMap(
  fromIso: string,
  toIso: string,
): Promise<Map<string, { blocked: boolean; unlocked: boolean }>> {
  const map = new Map<string, { blocked: boolean; unlocked: boolean }>();
  const supabase = createServiceRoleClient();
  if (!supabase) return map;

  const { data, error } = await supabase
    .from("booking_day_overrides")
    .select("visit_date, blocked, unlocked")
    .gte("visit_date", fromIso)
    .lte("visit_date", toIso);

  if (error) {
    const legacy = await supabase
      .from("booking_day_overrides")
      .select("visit_date, blocked")
      .gte("visit_date", fromIso)
      .lte("visit_date", toIso);
    for (const row of legacy.data ?? []) {
      map.set(row.visit_date, { blocked: row.blocked, unlocked: false });
    }
    return map;
  }

  for (const row of data ?? []) {
    map.set(row.visit_date, {
      blocked: row.blocked,
      unlocked: Boolean(row.unlocked),
    });
  }
  return map;
}

export async function isDayBlocked(dateIso: string): Promise<boolean> {
  const override = await getDayOverride(dateIso);
  return Boolean(override?.blocked);
}

export type SaveDayOverrideInput = {
  visitDate: string;
  blocked: boolean;
  unlocked: boolean;
  note?: string | null;
  timeSlots: string[];
  /** null = usuń nadpisanie (wróć do globalnego) */
  slotLimits: Record<string, number | null>;
};

export async function saveDayOverride(
  input: SaveDayOverrideInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.visitDate)) {
    return { ok: false, error: "Nieprawidłowa data." };
  }

  for (const time of input.timeSlots) {
    const v = input.slotLimits[time];
    if (v == null) continue;
    if (!Number.isInteger(v) || v < 0 || v > 200) {
      return { ok: false, error: `Limit dla ${time}: podaj liczbę 0–200 (0 = slot zamknięty).` };
    }
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Brak połączenia z bazą (Supabase)." };
  }

  const hasAnySlotLimit = input.timeSlots.some((t) => input.slotLimits[t] != null);
  const keepRow =
    input.blocked ||
    input.unlocked ||
    hasAnySlotLimit ||
    Boolean(input.note?.trim());

  if (!keepRow) {
    const { error } = await supabase
      .from("booking_day_overrides")
      .delete()
      .eq("visit_date", input.visitDate);
    if (error) {
      console.error("[day-override] delete:", error);
      return { ok: false, error: "Nie udało się wyczyścić nadpisań dnia." };
    }
    return { ok: true };
  }

  const payload: Record<string, unknown> = {
    visit_date: input.visitDate,
    blocked: input.blocked,
    unlocked: input.unlocked,
    note: input.note?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from("booking_day_overrides")
    .upsert(payload, { onConflict: "visit_date" });

  if (upsertError) {
    console.error("[day-override] upsert:", upsertError);
    return {
      ok: false,
      error:
        "Nie udało się zapisać. Uruchom SQL z supabase/booking-access.sql w Supabase.",
    };
  }

  const { error: delSlotsError } = await supabase
    .from("booking_slot_limits")
    .delete()
    .eq("visit_date", input.visitDate);

  if (delSlotsError) {
    console.error("[day-override] clear slots:", delSlotsError);
    return { ok: false, error: "Nie udało się zaktualizować limitów slotów." };
  }

  const rows = input.timeSlots
    .filter((t) => input.slotLimits[t] != null)
    .map((time) => ({
      visit_date: input.visitDate,
      visit_time: time,
      max_guests: input.slotLimits[time] as number,
    }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("booking_slot_limits").insert(rows);
    if (insertError) {
      console.error("[day-override] insert slots:", insertError);
      return { ok: false, error: "Nie udało się zapisać limitów slotów." };
    }
  }

  return { ok: true };
}

export async function getAccessContext() {
  const settings = await getBookingSettings();
  return {
    bookingMode: settings.bookingMode,
    maxDaysAhead: settings.maxDaysAhead,
    timeSlots: settings.timeSlots,
    maxGuestsPerSlot: settings.maxGuestsPerSlot,
  };
}
