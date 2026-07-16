import Link from "next/link";
import { BookingsSchedule } from "@/components/admin/bookings-schedule";
import { MaxGuestsSettings } from "@/components/admin/max-guests-settings";
import { PanelHeader } from "@/components/admin/panel-header";
import { BOOKING_TIME_SLOTS } from "@/lib/admin/hub-constants";
import { requireAdminHub } from "@/lib/admin/hub-auth";
import { getSlotAvailability } from "@/lib/booking/capacity";
import { fetchBookingsForDate } from "@/lib/booking/service";
import { getBookingSettings } from "@/lib/booking/settings";
import type { BookingWithTickets } from "@/lib/booking/types";
import { formatDatePL } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezerwacje",
  robots: { index: false, follow: false },
};

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateParam(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return todayIso();
  return value;
}

export default async function AdminRezerwacjePage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  await requireAdminHub();
  const params = await searchParams;
  const dateIso = parseDateParam(params.data);
  const [bookings, settings, availability] = await Promise.all([
    fetchBookingsForDate(dateIso) as Promise<BookingWithTickets[]>,
    getBookingSettings(),
    getSlotAvailability(dateIso),
  ]);

  const [y, m, d] = dateIso.split("-").map(Number);
  const dateObj = new Date(y!, m! - 1, d!);
  const dateLabel = formatDatePL(dateObj);

  const slots = BOOKING_TIME_SLOTS.map((time) => ({
    time,
    bookings: bookings.filter((b) => b.visit_time === time),
    capacity: availability.find((a) => a.time === time),
  }));

  return (
    <div className="container-site max-w-3xl py-10">
      <PanelHeader />

      <MaxGuestsSettings
        currentMax={settings.maxGuestsPerSlot}
        updatedAt={settings.updatedAt}
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-forest">Harmonogram wizyt</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Kliknij godzinę, aby rozwinąć listę gości i numery biletów.
          </p>
        </div>
        <Link
          href="/admin/panel"
          className="text-sm font-semibold text-gold hover:text-gold-bright"
        >
          ← Panel główny
        </Link>
      </div>

      <form method="get" className="mb-8 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-forest">Data</span>
          <input
            type="date"
            name="data"
            defaultValue={dateIso}
            className="rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-paper hover:bg-forest-light"
        >
          Pokaż
        </button>
      </form>

      <BookingsSchedule dateLabel={dateLabel} slots={slots} />
    </div>
  );
}
