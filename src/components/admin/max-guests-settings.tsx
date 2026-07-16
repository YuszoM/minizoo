"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { updateMaxGuestsPerSlotAction } from "@/app/actions/booking-settings";

type Props = {
  currentMax: number;
  updatedAt: string | null;
};

export function MaxGuestsSettings({ currentMax, updatedAt }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateMaxGuestsPerSlotAction, null);

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

  return (
    <section className="mb-8 rounded-xl border border-gold/30 bg-white p-5 shadow-sm">
      <h3 className="font-display text-lg text-forest">Domyślny limit miejsc na godzinę</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Globalny limit dla wszystkich dni (gdy nie ustawisz limitu dla konkretnego dnia poniżej).
        Po wyczerpaniu termin znika z kalendarza rezerwacji.
      </p>

      <form action={action} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-forest">Maks. osób / slot</span>
          <input
            type="number"
            name="max_guests_per_slot"
            min={1}
            max={200}
            defaultValue={currentMax}
            required
            className="w-28 rounded-lg border border-paper-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
        >
          {pending ? "Zapisuję…" : "Zapisz limit"}
        </button>
      </form>

      {state?.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? (
        <p className="mt-3 text-sm font-medium text-forest">Zapisano nowy limit miejsc.</p>
      ) : null}
      {updatedAt && !state?.success ? (
        <p className="mt-2 text-xs text-ink-muted">
          Ostatnia zmiana:{" "}
          {new Intl.DateTimeFormat("pl-PL", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(updatedAt))}
        </p>
      ) : null}
    </section>
  );
}
