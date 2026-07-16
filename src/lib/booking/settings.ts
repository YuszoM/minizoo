import { createServiceRoleClient } from "@/lib/supabase/clients";

export const DEFAULT_MAX_GUESTS_PER_SLOT = 24;

export type BookingSettings = {
  maxGuestsPerSlot: number;
  updatedAt: string | null;
};

export async function getBookingSettings(): Promise<BookingSettings> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { maxGuestsPerSlot: DEFAULT_MAX_GUESTS_PER_SLOT, updatedAt: null };
  }

  const { data, error } = await supabase
    .from("booking_settings")
    .select("max_guests_per_slot, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    return { maxGuestsPerSlot: DEFAULT_MAX_GUESTS_PER_SLOT, updatedAt: null };
  }

  return {
    maxGuestsPerSlot: data.max_guests_per_slot,
    updatedAt: data.updated_at,
  };
}

export async function updateMaxGuestsPerSlot(value: number): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!Number.isInteger(value) || value < 1 || value > 200) {
    return { ok: false, error: "Podaj liczbę od 1 do 200." };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Brak połączenia z bazą (Supabase)." };
  }

  const { error } = await supabase.from("booking_settings").upsert(
    {
      id: 1,
      max_guests_per_slot: value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[settings] update error:", error);
    return { ok: false, error: "Nie udało się zapisać ustawienia." };
  }

  return { ok: true };
}
