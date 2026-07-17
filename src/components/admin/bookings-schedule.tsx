"use client";

import { ChevronDown, Users } from "lucide-react";
import { useState } from "react";
import type { SlotAvailability } from "@/lib/booking/capacity";
import type { BookingWithTickets } from "@/lib/booking/types";
import { cn, formatPrice } from "@/lib/utils";

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
    // Od razu otwórz wszystkie sloty z gośćmi — widać listę bez dodatkowego klikania
    return new Set(slots.filter((s) => s.bookings.length > 0).map((s) => s.time));
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
      <div className="rounded-xl border-2 border-forest/20 bg-forest px-5 py-4 text-paper">
        <p className="font-display text-xl capitalize text-gold-bright">{dateLabel}</p>
        <p className="mt-1 text-sm text-paper/90">
          {totalBookings} {totalBookings === 1 ? "rezerwacja" : "rezerwacji"} · {totalGuests}{" "}
          {totalGuests === 1 ? "gość" : totalGuests < 5 ? "gości" : "gości"} łącznie
        </p>
      </div>

      {slots.map(({ time, bookings, capacity }) => {
        const open = openSlots.has(time);
        const slotGuests = bookings.reduce((a, b) => a + b.guest_count, 0);
        const max = capacity?.max;
        const remaining = capacity?.remaining;
        const hasGuests = bookings.length > 0;

        return (
          <div
            key={time}
            className={cn(
              "overflow-hidden rounded-xl border-2 shadow-sm",
              hasGuests ? "border-gold/50 bg-white" : "border-paper-deep bg-white",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(time)}
              className={cn(
                "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition",
                hasGuests ? "bg-gold/15 hover:bg-gold/25" : "hover:bg-paper/60",
              )}
              aria-expanded={open}
            >
              <div>
                <p
                  className={cn(
                    "font-display text-xl",
                    hasGuests ? "text-forest" : "text-forest/80",
                  )}
                >
                  Godz. {time}
                  {hasGuests ? (
                    <span className="ml-2 rounded-md bg-forest px-2 py-0.5 text-sm font-sans font-bold text-gold-bright">
                      {slotGuests} {slotGuests === 1 ? "os." : "os."}
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink-soft">
                  {bookings.length === 0
                    ? "Brak rezerwacji"
                    : `${bookings.length} ${bookings.length === 1 ? "rezerwacja" : "rezerwacji"}`}
                  {max != null && (
                    <span>
                      {" "}
                      · {slotGuests}/{max} miejsc
                      {remaining === 0
                        ? " (pełny)"
                        : remaining != null
                          ? ` · wolne: ${remaining}`
                          : ""}
                    </span>
                  )}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-forest transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>

            {open && bookings.length > 0 && (
              <div className="border-t-2 border-gold/30 bg-amber-50/80 px-5 py-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-forest">
                  Lista zapisanych
                </p>
                <ul className="space-y-3">
                  {bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="rounded-lg border-2 border-forest/25 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-lg font-semibold text-forest">
                            {booking.customer_name}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
                            <Users className="h-4 w-4 text-gold" />
                            {guestLabel(booking.guest_count)} · {booking.offer_title}
                          </p>
                          <p className="mt-1 text-sm text-ink-soft">
                            <a
                              href={`mailto:${booking.email}`}
                              className="font-medium text-forest underline-offset-2 hover:underline"
                            >
                              {booking.email}
                            </a>
                            {" · "}
                            <a
                              href={`tel:${booking.phone.replace(/\D/g, "")}`}
                              className="font-medium text-forest underline-offset-2 hover:underline"
                            >
                              {booking.phone}
                            </a>
                          </p>
                          <p className="mt-1 text-xs text-ink-muted">
                            Zamówienie {booking.order_number} · {formatPrice(booking.total_price)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 border-t border-forest/15 pt-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-forest/70">
                          Numery biletów
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {booking.tickets.map((ticket, i) => (
                            <li
                              key={ticket.id}
                              className="rounded-md border-2 border-gold bg-forest px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-gold-bright"
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
