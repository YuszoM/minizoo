"use server";

import { revalidatePath } from "next/cache";
import { requireAdminHub } from "@/lib/admin/hub-auth";
import { BOOKING_TIME_SLOTS } from "@/lib/admin/hub-constants";
import { saveDayOverride } from "@/lib/booking/day-overrides";
import { updateMaxGuestsPerSlot } from "@/lib/booking/settings";

export async function updateMaxGuestsPerSlotAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdminHub();

  const raw = String(formData.get("max_guests_per_slot") ?? "").trim();
  const value = Number.parseInt(raw, 10);
  const result = await updateMaxGuestsPerSlot(value);

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/admin/rezerwacje");
  revalidatePath("/rezerwacja");
  return { success: true };
}

export async function saveDayOverrideAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdminHub();

  const visitDate = String(formData.get("visit_date") ?? "").trim();
  const blocked = formData.get("blocked") === "on" || formData.get("blocked") === "true";
  const note = String(formData.get("note") ?? "").trim() || null;

  const slotLimits: Partial<Record<(typeof BOOKING_TIME_SLOTS)[number], number | null>> = {};
  for (const time of BOOKING_TIME_SLOTS) {
    const key = `slot_${time.replace(":", "")}`;
    const raw = String(formData.get(key) ?? "").trim();
    if (raw === "") {
      slotLimits[time] = null;
      continue;
    }
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) {
      return { error: `Nieprawidłowy limit dla ${time}.` };
    }
    slotLimits[time] = n;
  }

  const result = await saveDayOverride({ visitDate, blocked, note, slotLimits });
  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/admin/rezerwacje");
  revalidatePath("/rezerwacja");
  return { success: true };
}
