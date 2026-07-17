import { NextResponse } from "next/server";
import {
  isDateBookable,
  parseIsoDate,
  toIsoDate,
} from "@/lib/booking/availability-rules";
import { getDayAvailability } from "@/lib/booking/capacity";
import { getDayFlagsMap } from "@/lib/booking/day-overrides";
import { getBookingSettings } from "@/lib/booking/settings";
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
  const month = searchParams.get("month"); // YYYY-MM

  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "Nieprawidłowy miesiąc." }, { status: 400 });
    }
    const [y, m] = month.split("-").map(Number);
    const fromIso = `${month}-01`;
    const lastDay = new Date(y!, m!, 0).getDate();
    const toIso = `${month}-${String(lastDay).padStart(2, "0")}`;

    const [settings, flagsMap] = await Promise.all([
      getBookingSettings(),
      getDayFlagsMap(fromIso, toIso),
    ]);

    const unavailableDates: string[] = [];
    for (let day = 1; day <= lastDay; day++) {
      const d = new Date(y!, m! - 1, day);
      const iso = toIsoDate(d);
      const flags = flagsMap.get(iso) ?? { blocked: false, unlocked: false };
      if (!isDateBookable(d, settings, flags)) {
        unavailableDates.push(iso);
      }
    }

    return NextResponse.json(
      {
        month,
        unavailableDates,
        /** legacy alias */
        blockedDates: unavailableDates,
        bookingMode: settings.bookingMode,
        maxDaysAhead: settings.maxDaysAhead,
        timeSlots: settings.timeSlots,
      },
      { headers: { "Cache-Control": "private, max-age=30" } },
    );
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Nieprawidłowa data." }, { status: 400 });
  }

  const visitDate = parseIsoDate(date);
  if (!visitDate) {
    return NextResponse.json({ error: "Nieprawidłowa data." }, { status: 400 });
  }

  const [settings, day] = await Promise.all([
    getBookingSettings(),
    getDayAvailability(date),
  ]);

  const bookable = isDateBookable(visitDate, settings, {
    blocked: day.blocked,
    unlocked: day.unlocked,
  });

  return NextResponse.json(
    {
      date: day.date,
      blocked: day.blocked || !bookable,
      unlocked: day.unlocked,
      bookable,
      slots: bookable ? day.slots : day.slots.map((s) => ({ ...s, remaining: 0, full: true })),
      timeSlots: settings.timeSlots,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=30",
      },
    },
  );
}
