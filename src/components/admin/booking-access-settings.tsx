"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { updateBookingSettingsAction } from "@/app/actions/booking-settings";
import type { BookingSettings } from "@/lib/booking/settings";

type Props = {
  settings: BookingSettings;
};

export function BookingAccessSettings({ settings }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateBookingSettingsAction, null);

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

  return (
    <section className="mb-8 rounded-xl border border-gold/30 bg-white p-5 shadow-sm">
      <h3 className="font-display text-lg text-forest">Ustawienia rezerwacji</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Limit miejsc, godziny wizyt oraz jak daleko do przodu klienci mogą się zapisywać.
      </p>

      <form action={action} className="mt-4 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-forest">
              Domyślny limit osób / slot
            </span>
            <input
              type="number"
              name="max_guests_per_slot"
              min={1}
              max={200}
              defaultValue={settings.maxGuestsPerSlot}
              required
              className="w-full rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-forest">
              Godziny (po przecinku)
            </span>
            <input
              type="text"
              name="time_slots"
              defaultValue={settings.timeSlots.join(", ")}
              placeholder="10:00, 12:00, 14:00, 16:00, 18:00"
              required
              className="w-full rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
            <span className="mt-1 block text-xs text-ink-muted">Format 24h, np. 18:00</span>
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-forest">Dostępność kalendarza</legend>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-paper-deep bg-paper/40 px-4 py-3">
            <input
              type="radio"
              name="booking_mode"
              value="horizon"
              defaultChecked={settings.bookingMode === "horizon"}
              className="mt-1 accent-forest"
            />
            <span>
              <span className="block text-sm font-semibold text-forest">
                Okno czasowe (np. 2 tygodnie / miesiąc)
              </span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                Klienci widzą dni do X dni do przodu. Dalej — zamknięte, chyba że odblokujesz
                konkretny dzień.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-paper-deep bg-paper/40 px-4 py-3">
            <input
              type="radio"
              name="booking_mode"
              value="manual"
              defaultChecked={settings.bookingMode === "manual"}
              className="mt-1 accent-forest"
            />
            <span>
              <span className="block text-sm font-semibold text-forest">
                Tylko ręcznie odblokowane dni
              </span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                Domyślnie brak miejsc w kalendarzu — odblokowujesz wybrane dni poniżej.
              </span>
            </span>
          </label>
        </fieldset>

        <label className="block max-w-xs">
          <span className="mb-1.5 block text-sm font-medium text-forest">
            Max dni do przodu (tryb okna)
          </span>
          <select
            name="max_days_ahead"
            defaultValue={settings.maxDaysAhead}
            className="w-full rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            {[7, 14, 30, 60, 90]
              .concat(
                [7, 14, 30, 60, 90].includes(settings.maxDaysAhead)
                  ? []
                  : [settings.maxDaysAhead],
              )
              .sort((a, b) => a - b)
              .map((n) => (
                <option key={n} value={n}>
                  {n} dni
                  {n === 7
                    ? " (tydzień)"
                    : n === 14
                      ? " (2 tygodnie)"
                      : n === 30
                        ? " (miesiąc)"
                        : ""}
                </option>
              ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
        >
          {pending ? "Zapisuję…" : "Zapisz ustawienia"}
        </button>
      </form>

      {state?.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? (
        <p className="mt-3 text-sm font-medium text-forest">Zapisano ustawienia rezerwacji.</p>
      ) : null}
    </section>
  );
}
