"use server";

import { revalidatePath } from "next/cache";
import { requireAdminHub } from "@/lib/admin/hub-auth";
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
