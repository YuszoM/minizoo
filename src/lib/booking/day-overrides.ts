import { BOOKING_TIME_SLOTS } from "@/lib/admin/hub-constants";
import { createServiceRoleClient } from "@/lib/supabase/clients";

export type DayOverride = {
  visitDate: string;
  blocked: boolean;
  note: string | null;
  /** Per-slot max; missing key = use global default */
  slotLimits: Partial<Record<(typeof BOOKING_TIME_SLOTS)[number], number>>;
};

function emptySlotLimits(): DayOverride["slotLimits"] {
  return {};
}

export async function getDayOverride(dateIso: string): Promise<DayOverride | null> {
  const supabase = createServiceRoleClient();
  if (!supabase) return null;

  const { data: day, error } = await supabase
    .from("booking_day_overrides")
    .select("visit_date, blocked, note")
    .eq("visit_date", dateIso)
    .maybeSingle();

  if (error) {
    console.error("[day-override] fetch:", error);
    return null;
  }
  if (!day) return null;

  const { data: slots } = await supabase
    .from("booking_slot_limits")
    .select("visit_time, max_guests")
    .eq("visit_date", dateIso);

  const slotLimits = emptySlotLimits();
  for (const row of slots ?? []) {
    if ((BOOKING_TIME_SLOTS as readonly string[]).includes(row.visit_time)) {
      slotLimits[row.visit_time as (typeof BOOKING_TIME_SLOTS)[number]] = row.max_guests;
    }
  }

  return {
    visitDate: day.visit_date,
    blocked: day.blocked,
    note: day.note,
    slotLimits,
  };
}

export async function isDayBlocked(dateIso: string): Promise<boolean> {
  const override = await getDayOverride(dateIso);
  return Boolean(override?.blocked);
}

/** Zwraca ISO dat zablokowanych w zakresie [fromIso, toIso] włącznie. */
export async function getBlockedDatesInRange(
  fromIso: string,
  toIso: string,
): Promise<string[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("booking_day_overrides")
    .select("visit_date")
    .eq("blocked", true)
    .gte("visit_date", fromIso)
    .lte("visit_date", toIso);

  if (error || !data) {
    if (error) console.error("[day-override] blocked range:", error);
    return [];
  }

  return data.map((r) => r.visit_date);
}

export type SaveDayOverrideInput = {
  visitDate: string;
  blocked: boolean;
  note?: string | null;
  /** null / undefined = usuń nadpisanie (wróć do globalnego) */
  slotLimits: Partial<Record<(typeof BOOKING_TIME_SLOTS)[number], number | null>>;
};

export async function saveDayOverride(
  input: SaveDayOverrideInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.visitDate)) {
    return { ok: false, error: "Nieprawidłowa data." };
  }

  for (const time of BOOKING_TIME_SLOTS) {
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

  const hasAnySlotLimit = BOOKING_TIME_SLOTS.some((t) => {
    const v = input.slotLimits[t];
    return v != null;
  });
  const keepRow = input.blocked || hasAnySlotLimit || Boolean(input.note?.trim());

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

  const { error: upsertError } = await supabase.from("booking_day_overrides").upsert(
    {
      visit_date: input.visitDate,
      blocked: input.blocked,
      note: input.note?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "visit_date" },
  );

  if (upsertError) {
    console.error("[day-override] upsert:", upsertError);
    return { ok: false, error: "Nie udało się zapisać ustawień dnia." };
  }

  // Zastąp limity slotów
  const { error: delSlotsError } = await supabase
    .from("booking_slot_limits")
    .delete()
    .eq("visit_date", input.visitDate);

  if (delSlotsError) {
    console.error("[day-override] clear slots:", delSlotsError);
    return { ok: false, error: "Nie udało się zaktualizować limitów slotów." };
  }

  const rows = BOOKING_TIME_SLOTS.filter((t) => input.slotLimits[t] != null).map((time) => ({
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
