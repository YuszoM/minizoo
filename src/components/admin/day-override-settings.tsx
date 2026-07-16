"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { saveDayOverrideAction } from "@/app/actions/booking-settings";
import { BOOKING_TIME_SLOTS } from "@/lib/admin/hub-constants";
import type { DayOverride } from "@/lib/booking/day-overrides";

type Props = {
  dateIso: string;
  dateLabel: string;
  globalMax: number;
  override: DayOverride | null;
};

function slotFieldName(time: string) {
  return `slot_${time.replace(":", "")}`;
}

export function DayOverrideSettings({ dateIso, dateLabel, globalMax, override }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveDayOverrideAction, null);

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

  return (
    <section className="mb-8 rounded-xl border border-paper-deep bg-white p-5 shadow-sm">
      <h3 className="font-display text-lg text-forest">Dzień: {dateLabel}</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Wykreśl cały dzień albo ustaw osobny limit miejsc na każdą godzinę. Puste pole = limit
        globalny ({globalMax}). <strong>0</strong> = slot zamknięty.
      </p>

      <form action={action} className="mt-4 space-y-4">
        <input type="hidden" name="visit_date" value={dateIso} />

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-paper-deep bg-paper/40 px-4 py-3">
          <input
            type="checkbox"
            name="blocked"
            defaultChecked={override?.blocked ?? false}
            className="mt-1 h-4 w-4 accent-forest"
          />
          <span>
            <span className="block text-sm font-semibold text-forest">
              Wykreśl cały dzień
            </span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              Dzień znika z kalendarza rezerwacji (jak poniedziałek).
            </span>
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {BOOKING_TIME_SLOTS.map((time) => {
            const current = override?.slotLimits[time];
            return (
              <label key={time} className="block">
                <span className="mb-1.5 block text-sm font-medium text-forest">
                  Limit · {time}
                </span>
                <input
                  type="number"
                  name={slotFieldName(time)}
                  min={0}
                  max={200}
                  placeholder={`domyślnie ${globalMax}`}
                  defaultValue={current != null ? current : ""}
                  className="w-full rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </label>
            );
          })}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-forest">
            Notatka (opcjonalnie)
          </span>
          <input
            type="text"
            name="note"
            defaultValue={override?.note ?? ""}
            placeholder="np. urlop, impreza zamknięta"
            maxLength={200}
            className="w-full rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
        >
          {pending ? "Zapisuję…" : "Zapisz ustawienia dnia"}
        </button>
      </form>

      {state?.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? (
        <p className="mt-3 text-sm font-medium text-forest">Zapisano ustawienia dnia.</p>
      ) : null}
      {override?.blocked ? (
        <p className="mt-3 text-sm font-semibold text-amber-800">
          Ten dzień jest wykreślony — rezerwacje zablokowane.
        </p>
      ) : null}
    </section>
  );
}
