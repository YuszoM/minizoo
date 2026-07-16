"use server";

import { createBooking } from "@/lib/booking/service";
import type { CreateBookingInput, CreateBookingResult } from "@/lib/booking/types";
import { getClientIp } from "@/lib/rate-limit/client-ip";
import { rateLimitHit } from "@/lib/rate-limit/upstash";

export async function submitBookingAction(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const ip = await getClientIp();
  const emailKey = input.email.trim().toLowerCase().slice(0, 120);

  const ipRl = await rateLimitHit({
    identifier: `booking:ip:${ip}`,
    max: 8,
    windowSeconds: 3600,
    // failClosed dopiero po ustawieniu UPSTASH_* na Vercel
    failClosed: false,
  });
  if (!ipRl.ok) {
    return { ok: false, error: "Zbyt wiele rezerwacji z tego adresu. Spróbuj później." };
  }

  const emailRl = await rateLimitHit({
    identifier: `booking:email:${emailKey}`,
    max: 5,
    windowSeconds: 3600,
    failClosed: false,
  });
  if (!emailRl.ok) {
    return { ok: false, error: "Zbyt wiele rezerwacji na ten adres e-mail. Spróbuj później." };
  }

  return createBooking(input);
}
