"use server";

import { getClientIp } from "@/lib/rate-limit/client-ip";
import { rateLimitHit } from "@/lib/rate-limit/upstash";
import { createVoucher, type CreateVoucherInput, type CreateVoucherResult } from "@/lib/voucher/service";

export async function submitVoucherAction(
  input: CreateVoucherInput,
): Promise<CreateVoucherResult> {
  const ip = await getClientIp();
  const rl = await rateLimitHit({
    identifier: `voucher:${ip}`,
    max: 5,
    windowSeconds: 3600,
    failClosed: false,
  });
  if (!rl.ok) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj później." };
  }

  return createVoucher(input);
}
