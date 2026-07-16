import { NextResponse } from "next/server";
import { getDayAvailability } from "@/lib/booking/capacity";
import { getBlockedDatesInRange } from "@/lib/booking/day-overrides";
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
  const month = searchParams.get("month"); // YYYY-MM — lista zablokowanych dni

  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "Nieprawidłowy miesiąc." }, { status: 400 });
    }
    const [y, m] = month.split("-").map(Number);
    const fromIso = `${month}-01`;
    const lastDay = new Date(y!, m!, 0).getDate();
    const toIso = `${month}-${String(lastDay).padStart(2, "0")}`;
    const blockedDates = await getBlockedDatesInRange(fromIso, toIso);
    return NextResponse.json(
      { month, blockedDates },
      { headers: { "Cache-Control": "private, max-age=30" } },
    );
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Nieprawidłowa data." }, { status: 400 });
  }

  const day = await getDayAvailability(date);
  return NextResponse.json(
    { date: day.date, blocked: day.blocked, slots: day.slots },
    {
      headers: {
        "Cache-Control": "private, max-age=30",
      },
    },
  );
}
