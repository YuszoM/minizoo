"use client";

import { ChevronDown, Users } from "lucide-react";
import { useState } from "react";
import type { SlotAvailability } from "@/lib/booking/capacity";
import type { BookingWithTickets } from "@/lib/booking/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  dateLabel: string;
  slots: {
    time: string;
    bookings: BookingWithTickets[];
    capacity?: SlotAvailability;
  }[];
};

function guestLabel(n: number) {
  if (n === 1) return "1 osoba";
  if (n >= 2 && n <= 4) return `${n} osoby`;
  return `${n} osób`;
}

export function BookingsSchedule({ dateLabel, slots }: Props) {
  const [openSlots, setOpenSlots] = useState<Set<string>>(() => {
    const firstWithBookings = slots.find((s) => s.bookings.length > 0);
    return firstWithBookings ? new Set([firstWithBookings.time]) : new Set();
  });

  const totalGuests = slots.reduce(
    (sum, s) => sum + s.bookings.reduce((a, b) => a + b.guest_count, 0),
    0,
  );
  const totalBookings = slots.reduce((sum, s) => sum + s.bookings.length, 0);

  function toggle(time: string) {
    setOpenSlots((prev) => {
      const next = new Set(prev);
      if (next.has(time)) next.delete(time);
      else next.add(time);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-paper-deep bg-white p-4 text-sm">
        <p className="font-semibold text-forest capitalize">{dateLabel}</p>
        <p className="mt-1 text-ink-muted">
          {totalBookings} {totalBookings === 1 ? "rezerwacja" : "rezerwacji"} · {totalGuests}{" "}
          {totalGuests === 1 ? "gość" : totalGuests < 5 ? "gości" : "gości"} łącznie
        </p>
      </div>

      {slots.map(({ time, bookings, capacity }) => {
        const open = openSlots.has(time);
        const slotGuests = bookings.reduce((a, b) => a + b.guest_count, 0);
        const max = capacity?.max;
        const remaining = capacity?.remaining;

        return (
          <div
            key={time}
            className="overflow-hidden rounded-xl border border-paper-deep bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(time)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-paper/60"
              aria-expanded={open}
            >
              <div>
                <p className="font-display text-xl text-forest">Godz. {time}</p>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {bookings.length === 0
                    ? "Brak rezerwacji"
                    : `${bookings.length} ${bookings.length === 1 ? "rezerwacja" : "rezerwacji"} · ${slotGuests} ${slotGuests === 1 ? "osoba" : slotGuests < 5 ? "osoby" : "osób"}`}
                  {max != null && (
                    <span className="text-ink-soft">
                      {" "}
                      · {slotGuests}/{max} miejsc
                      {remaining === 0 ? " (pełny)" : remaining != null ? ` · wolne: ${remaining}` : ""}
                    </span>
                  )}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-gold transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>

            {open && bookings.length > 0 && (
              <div className="border-t border-paper-deep px-5 py-4">
                <ul className="space-y-5">
                  {bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="rounded-lg border border-paper-deep bg-paper/40 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-forest">{booking.customer_name}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                            <Users className="h-4 w-4 text-gold" />
                            {guestLabel(booking.guest_count)} · {booking.offer_title}
                          </p>
                          <p className="mt-1 text-xs text-ink-muted">
                            {booking.email} · {booking.phone}
                          </p>
                          <p className="mt-1 text-xs text-ink-muted">
                            Zamówienie {booking.order_number} · {formatPrice(booking.total_price)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 border-t border-paper-deep pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          Numery biletów
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {booking.tickets.map((ticket, i) => (
                            <li
                              key={ticket.id}
                              className="rounded-md border border-gold/30 bg-white px-3 py-1.5 font-mono text-sm font-semibold tracking-wider text-forest"
                              title={`Bilet ${i + 1}`}
                            >
                              {ticket.ticket_code}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {open && bookings.length === 0 && (
              <p className="border-t border-paper-deep px-5 py-4 text-sm text-ink-muted">
                Na tę godzinę nie ma jeszcze zapisanych gości.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
