import { DEFAULT_BOOKING_TIME_SLOTS } from "@/lib/admin/hub-constants";
import { createServiceRoleClient } from "@/lib/supabase/clients";

export const DEFAULT_MAX_GUESTS_PER_SLOT = 24;
export const DEFAULT_MAX_DAYS_AHEAD = 14;

export type BookingMode = "horizon" | "manual";

export type BookingSettings = {
  maxGuestsPerSlot: number;
  bookingMode: BookingMode;
  maxDaysAhead: number;
  timeSlots: string[];
  updatedAt: string | null;
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function normalizeTimeSlots(raw: unknown): string[] {
  let list: string[] = [];
  if (Array.isArray(raw)) {
    list = raw.map(String);
  } else if (typeof raw === "string") {
    list = raw.split(/[\n,;]+/);
  }

  const cleaned = [
    ...new Set(
      list
        .map((t) => t.trim())
        .filter((t) => TIME_RE.test(t)),
    ),
  ].sort();

  return cleaned.length > 0 ? cleaned : [...DEFAULT_BOOKING_TIME_SLOTS];
}

function defaults(): BookingSettings {
  return {
    maxGuestsPerSlot: DEFAULT_MAX_GUESTS_PER_SLOT,
    bookingMode: "horizon",
    maxDaysAhead: DEFAULT_MAX_DAYS_AHEAD,
    timeSlots: [...DEFAULT_BOOKING_TIME_SLOTS],
    updatedAt: null,
  };
}

export async function getBookingSettings(): Promise<BookingSettings> {
  const supabase = createServiceRoleClient();
  if (!supabase) return defaults();

  const { data, error } = await supabase
    .from("booking_settings")
    .select("max_guests_per_slot, booking_mode, max_days_ahead, time_slots, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    // Kolumny mogą jeszcze nie istnieć — fallback
    if (error) console.error("[settings] fetch:", error.message);
    const fallback = await supabase
      .from("booking_settings")
      .select("max_guests_per_slot, updated_at")
      .eq("id", 1)
      .maybeSingle();
    if (fallback.data) {
      return {
        ...defaults(),
        maxGuestsPerSlot: fallback.data.max_guests_per_slot,
        updatedAt: fallback.data.updated_at,
      };
    }
    return defaults();
  }

  const mode = data.booking_mode === "manual" ? "manual" : "horizon";
  const maxDays =
    Number.isInteger(data.max_days_ahead) && data.max_days_ahead >= 1
      ? Math.min(365, data.max_days_ahead)
      : DEFAULT_MAX_DAYS_AHEAD;

  return {
    maxGuestsPerSlot: data.max_guests_per_slot ?? DEFAULT_MAX_GUESTS_PER_SLOT,
    bookingMode: mode,
    maxDaysAhead: maxDays,
    timeSlots: normalizeTimeSlots(data.time_slots),
    updatedAt: data.updated_at,
  };
}

export async function updateBookingSettings(input: {
  maxGuestsPerSlot?: number;
  bookingMode?: BookingMode;
  maxDaysAhead?: number;
  timeSlots?: string[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const current = await getBookingSettings();
  const maxGuestsPerSlot = input.maxGuestsPerSlot ?? current.maxGuestsPerSlot;
  const bookingMode = input.bookingMode ?? current.bookingMode;
  const maxDaysAhead = input.maxDaysAhead ?? current.maxDaysAhead;
  const timeSlots = input.timeSlots
    ? normalizeTimeSlots(input.timeSlots)
    : current.timeSlots;

  if (!Number.isInteger(maxGuestsPerSlot) || maxGuestsPerSlot < 1 || maxGuestsPerSlot > 200) {
    return { ok: false, error: "Limit miejsc: podaj liczbę od 1 do 200." };
  }
  if (!Number.isInteger(maxDaysAhead) || maxDaysAhead < 1 || maxDaysAhead > 365) {
    return { ok: false, error: "Horyzont: podaj liczbę dni od 1 do 365." };
  }
  if (timeSlots.length === 0) {
    return { ok: false, error: "Podaj przynajmniej jedną godzinę (np. 10:00)." };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Brak połączenia z bazą (Supabase)." };
  }

  const { error } = await supabase.from("booking_settings").upsert(
    {
      id: 1,
      max_guests_per_slot: maxGuestsPerSlot,
      booking_mode: bookingMode,
      max_days_ahead: maxDaysAhead,
      time_slots: timeSlots,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[settings] update error:", error);
    return {
      ok: false,
      error:
        "Nie udało się zapisać. Uruchom SQL z supabase/booking-access.sql w Supabase.",
    };
  }

  return { ok: true };
}

/** @deprecated użyj updateBookingSettings */
export async function updateMaxGuestsPerSlot(value: number) {
  return updateBookingSettings({ maxGuestsPerSlot: value });
}
