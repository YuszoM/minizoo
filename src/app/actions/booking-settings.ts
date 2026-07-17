"use server";

import { revalidatePath } from "next/cache";
import { requireAdminHub } from "@/lib/admin/hub-auth";
import { saveDayOverride } from "@/lib/booking/day-overrides";
import {
  getBookingSettings,
  normalizeTimeSlots,
  updateBookingSettings,
  type BookingMode,
} from "@/lib/booking/settings";

export async function updateBookingSettingsAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdminHub();

  const maxRaw = String(formData.get("max_guests_per_slot") ?? "").trim();
  const maxGuestsPerSlot = Number.parseInt(maxRaw, 10);

  const modeRaw = String(formData.get("booking_mode") ?? "horizon").trim();
  const bookingMode: BookingMode = modeRaw === "manual" ? "manual" : "horizon";

  const aheadRaw = String(formData.get("max_days_ahead") ?? "14").trim();
  const maxDaysAhead = Number.parseInt(aheadRaw, 10);

  const slotsRaw = String(formData.get("time_slots") ?? "").trim();
  const timeSlots = normalizeTimeSlots(slotsRaw);

  const result = await updateBookingSettings({
    maxGuestsPerSlot,
    bookingMode,
    maxDaysAhead,
    timeSlots,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/admin/rezerwacje");
  revalidatePath("/rezerwacja");
  return { success: true };
}

/** @deprecated */
export async function updateMaxGuestsPerSlotAction(
  prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  return updateBookingSettingsAction(prev, formData);
}

export async function saveDayOverrideAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdminHub();

  const settings = await getBookingSettings();
  const visitDate = String(formData.get("visit_date") ?? "").trim();
  const blocked = formData.get("blocked") === "on" || formData.get("blocked") === "true";
  const unlocked = formData.get("unlocked") === "on" || formData.get("unlocked") === "true";
  const note = String(formData.get("note") ?? "").trim() || null;

  const slotLimits: Record<string, number | null> = {};
  for (const time of settings.timeSlots) {
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

  const result = await saveDayOverride({
    visitDate,
    blocked,
    unlocked,
    note,
    timeSlots: settings.timeSlots,
    slotLimits,
  });
  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/admin/rezerwacje");
  revalidatePath("/rezerwacja");
  return { success: true };
}
