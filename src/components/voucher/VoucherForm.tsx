"use client";

import { useState, useTransition } from "react";
import { Gift, Loader2 } from "lucide-react";
import { submitVoucherAction } from "@/app/actions/voucher";
import { formatPrice } from "@/lib/utils";
import { site } from "@/data/site";

const inputClass =
  "w-full rounded-lg border border-paper-deep bg-white px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

const AMOUNTS = [site.startingPrice, 349, 499] as const;

export function VoucherForm() {
  const [amount, setAmount] = useState<number>(AMOUNTS[0]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    code: string;
    emailSent: boolean;
    amount: number;
    validUntil: string;
  } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitVoucherAction({
        purchaserName: String(fd.get("purchaserName") ?? ""),
        purchaserEmail: String(fd.get("purchaserEmail") ?? ""),
        purchaserPhone: String(fd.get("purchaserPhone") ?? ""),
        recipientName: String(fd.get("recipientName") ?? "") || undefined,
        dedication: String(fd.get("dedication") ?? "") || undefined,
        amount,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setDone({
        code: result.voucherCode,
        emailSent: result.emailSent,
        amount: result.amount,
        validUntil: result.validUntil,
      });
    });
  }

  if (done) {
    return (
      <div className="rounded-xl border border-gold/30 bg-white p-8 text-center shadow-sm">
        <Gift className="mx-auto h-10 w-10 text-gold" />
        <p className="mt-4 font-display text-2xl text-forest">Bon gotowy</p>
        <p className="mt-2 text-sm text-ink-muted">
          Kod:{" "}
          <span className="font-mono text-lg tracking-wider text-forest">{done.code}</span>
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {formatPrice(done.amount)} · ważny do {done.validUntil}
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          {done.emailSent
            ? "PDF wysłaliśmy na podany e-mail."
            : "Bon zapisany. PDF wyślemy mailem, gdy będzie skonfigurowana wysyłka (Resend) — albo pobierz kod i przekaż odbiorcy."}
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Płatność za bon uregulujesz na miejscu / z organizatorem.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm md:p-8">
      <div>
        <p className="mb-2 text-sm font-medium text-forest">Kwota bonu</p>
        <div className="flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                amount === a
                  ? "border-gold bg-gold/10 text-forest"
                  : "border-paper-deep text-ink-muted hover:border-gold/50"
              }`}
            >
              {formatPrice(a)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Twoje imię i nazwisko</span>
          <input name="purchaserName" required minLength={3} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">E-mail</span>
          <input type="email" name="purchaserEmail" required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Telefon</span>
          <input type="tel" name="purchaserPhone" required className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Dla kogo (opcjonalnie)</span>
          <input name="recipientName" className={inputClass} placeholder="Imię obdarowanego" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Dedykacja (opcjonalnie)</span>
          <textarea
            name="dedication"
            rows={3}
            maxLength={200}
            className={`${inputClass} resize-y`}
            placeholder="Krótka wiadomość na bonie"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generuję bon…
          </>
        ) : (
          <>
            <Gift className="h-4 w-4" />
            Zamów bon {formatPrice(amount)}
          </>
        )}
      </button>
      <p className="text-xs text-ink-muted">
        Po zamówieniu dostaniesz kod (i PDF mailem, gdy Resend będzie aktywny). Płatność bez
        przelewu online — na miejscu.
      </p>
    </form>
  );
}
