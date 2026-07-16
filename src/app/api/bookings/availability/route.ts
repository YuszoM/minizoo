import { NextResponse } from "next/server";
import { getSlotAvailability } from "@/lib/booking/capacity";
import { getClientIpFromRequest } from "@/lib/rate-limit/client-ip";
import { rateLimitHit } from "@/lib/rate-limit/upstash";

export async function GET(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rl = await rateLimitHit({
    identifier: `availability:${ip}`,
    max: 60,
    windowSeconds: 60,
  });
  if (!rl.ok) {
    return NextResponse.json({ error: "Za dużo żądań." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Nieprawidłowa data." }, { status: 400 });
  }

  const slots = await getSlotAvailability(date);
  return NextResponse.json(
    { date, slots },
    {
      headers: {
        "Cache-Control": "private, max-age=30",
      },
    },
  );
}
