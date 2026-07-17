import type { BookingMode } from "@/lib/booking/settings";

export function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isMonday(date: Date) {
  return date.getDay() === 1;
}

export function isPastDate(date: Date) {
  return date < startOfToday();
}

/** Ile pełnych dni od dziś (dziś = 0). */
export function daysFromToday(date: Date) {
  const today = startOfToday();
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export type DayAccessFlags = {
  blocked: boolean;
  unlocked: boolean;
};

export type BookingAccessSettings = {
  bookingMode: BookingMode;
  maxDaysAhead: number;
};

/**
 * Czy dzień jest dostępny do rezerwacji (bez limitu miejsc w slotach).
 * — poniedziałki i przeszłość zawsze zamknięte
 * — blocked → zawsze zamknięty
 * — horizon: otwarty w oknie maxDaysAhead, albo ręcznie unlocked poza oknem
 * — manual: tylko dni z unlocked=true
 */
export function isDateBookable(
  date: Date,
  access: BookingAccessSettings,
  flags: DayAccessFlags,
): boolean {
  if (isPastDate(date) || isMonday(date)) return false;
  if (flags.blocked) return false;

  if (access.bookingMode === "manual") {
    return flags.unlocked;
  }

  // horizon
  const ahead = daysFromToday(date);
  if (ahead <= access.maxDaysAhead) return true;
  return flags.unlocked;
}

export function whyDateUnavailable(
  date: Date,
  access: BookingAccessSettings,
  flags: DayAccessFlags,
): string | null {
  if (isPastDate(date)) return "Termin w przeszłości.";
  if (isMonday(date)) return "Poniedziałki są zamknięte.";
  if (flags.blocked) return "Ten dzień jest wykreślony.";
  if (access.bookingMode === "manual" && !flags.unlocked) {
    return "Ten dzień nie jest jeszcze odblokowany do rezerwacji.";
  }
  if (
    access.bookingMode === "horizon" &&
    daysFromToday(date) > access.maxDaysAhead &&
    !flags.unlocked
  ) {
    return `Rezerwacje możliwe maksymalnie ${access.maxDaysAhead} dni do przodu.`;
  }
  return null;
}
