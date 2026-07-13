"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Users,
} from "lucide-react";
import { offers } from "@/data/offers";
import { cn, formatDatePL, formatPrice } from "@/lib/utils";

const TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00"] as const;

const STEPS = [
  { id: 1, label: "Oferta" },
  { id: 2, label: "Termin" },
  { id: 3, label: "Dane" },
  { id: 4, label: "Płatność" },
] as const;

const inputClass =
  "w-full rounded-lg border border-paper-deep bg-white px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isMonday(date: Date) {
  return date.getDay() === 1;
}

function isUnavailable(date: Date) {
  if (isPast(date) || isMonday(date)) return true;
  const seed = date.getDate() + date.getMonth();
  return seed % 5 === 0;
}

export function BookingWizard({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState(offers[0].id);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(4);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const offer = offers.find((o) => o.id === selectedOffer) ?? offers[0];

  const totalPrice = useMemo(() => {
    if (offer.id === "szkola") return offer.price * Math.max(guests, 15);
    return offer.price;
  }, [offer, guests]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = new Date(year, month, 1).getDay();
  const offset = firstWeekday === 0 ? 6 : firstWeekday - 1;

  const monthLabel = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(viewDate);

  function nextStep() {
    setStep((s) => Math.min(s + 1, 4));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handlePay() {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="surface-elevated mx-auto max-w-xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="font-display text-2xl text-forest">Rezerwacja potwierdzona</h3>
        <p className="mt-3 text-ink-muted">
          Płatność została zasymulowana. W wersji produkcyjnej otrzymasz e-mail z
          potwierdzeniem.
        </p>
        <dl className="mt-6 space-y-2 rounded-lg bg-paper p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Pakiet</dt>
            <dd className="font-medium">{offer.title}</dd>
          </div>
          {selectedDay && selectedTime && (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Termin</dt>
              <dd className="text-right font-medium">
                {formatDatePL(selectedDay)}, {selectedTime}
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-paper-deep pt-2">
            <dt className="text-ink-muted">Kwota</dt>
            <dd className="font-display text-xl text-gold">{formatPrice(totalPrice)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "surface-elevated overflow-hidden",
        compact ? "max-w-4xl" : "mx-auto max-w-5xl",
      )}
    >
      <div className="border-b border-paper-deep px-5 py-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg text-forest">Rezerwacja online</p>
            <p className="mt-1 text-sm text-ink-muted">
              Pakiet → termin → dane → płatność
            </p>
          </div>
          <ol className="flex gap-2" aria-label="Kroki rezerwacji">
            {STEPS.map((s) => (
              <li
                key={s.id}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  step >= s.id
                    ? "bg-forest text-paper"
                    : "bg-paper-deep text-ink-muted",
                )}
                title={s.label}
              >
                {s.id}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="p-5 md:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-forest">Wybierz pakiet</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {offers.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSelectedOffer(o.id)}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-colors",
                      selectedOffer === o.id
                        ? "border-gold bg-gold/8"
                        : "border-paper-deep hover:border-gold/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-forest">{o.title}</p>
                        <p className="text-sm text-ink-muted">{o.subtitle}</p>
                      </div>
                      {o.popular && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-muted uppercase">
                          Hit
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-display text-2xl text-gold">
                      {formatPrice(o.price)}
                      {o.priceNote && (
                        <span className="text-sm font-normal text-ink-muted">
                          {" "}
                          / {o.priceNote}
                        </span>
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl text-forest">Wybierz termin</h3>
              <div className="rounded-lg border border-paper-deep p-4">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setViewDate(new Date(year, month - 1, 1))}
                    className="rounded-full p-2 hover:bg-paper"
                    aria-label="Poprzedni miesiąc"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <p className="font-semibold capitalize text-forest">{monthLabel}</p>
                  <button
                    type="button"
                    onClick={() => setViewDate(new Date(year, month + 1, 1))}
                    className="rounded-full p-2 hover:bg-paper"
                    aria-label="Następny miesiąc"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-muted">
                  {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);
                    const unavailable = isUnavailable(date);
                    const selected =
                      selectedDay?.toDateString() === date.toDateString();

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={unavailable}
                        onClick={() => {
                          setSelectedDay(date);
                          setSelectedTime(null);
                        }}
                        className={cn(
                          "aspect-square rounded-md text-sm font-medium transition-colors",
                          unavailable &&
                            "cursor-not-allowed text-ink-muted/35 line-through",
                          !unavailable && !selected && "hover:bg-paper text-ink",
                          selected && "bg-forest text-paper",
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-ink-muted">
                  Poniedziałki zamknięte · przekreślone dni bez wolnych miejsc
                </p>
              </div>

              {selectedDay && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-forest">
                    Godzina — {formatDatePL(selectedDay)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          selectedTime === time
                            ? "border-forest bg-forest text-paper"
                            : "border-paper-deep hover:border-gold",
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-display text-xl text-forest">Twoje dane</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium">Imię i nazwisko</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Anna Kowalska"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">E-mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="anna@email.pl"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Telefon</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="600 000 000"
                  />
                </label>
                {offer.id === "szkola" && (
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Users className="h-4 w-4" />
                      Liczba uczniów
                    </span>
                    <input
                      type="number"
                      min={15}
                      max={30}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className={inputClass}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="font-display text-xl text-forest">Płatność online</h3>
              <div className="rounded-lg border border-gold/30 bg-gold/8 p-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-gold" />
                  <div>
                    <p className="font-semibold text-forest">Przelewy24</p>
                    <p className="text-sm text-ink-muted">
                      Karta, BLIK lub szybki przelew
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-ink-muted">
                  Demo — po kliknięciu „Zapłać” symulujemy bramkę płatności bez
                  pobierania środków.
                </p>
              </div>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" defaultChecked className="mt-1" />
                <span className="text-ink-muted">
                  Akceptuję{" "}
                  <a href="/regulamin" className="font-semibold text-forest underline-offset-2 hover:underline">
                    regulamin
                  </a>{" "}
                  rezerwacji.
                </span>
              </label>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-full border border-paper-deep px-6 py-3 text-sm font-semibold text-forest transition active:scale-[0.98] hover:bg-paper"
              >
                Wstecz
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 2 && (!selectedDay || !selectedTime)) ||
                  (step === 3 && (!name || !email || !phone))
                }
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Dalej
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={handlePay}
                disabled={paying}
                className="btn-gold min-w-[160px]"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Przetwarzanie…
                  </>
                ) : (
                  <>Zapłać {formatPrice(totalPrice)}</>
                )}
              </button>
            )}
          </div>
        </div>

        <aside className="border-t border-paper-deep bg-paper p-5 lg:border-t-0 lg:border-l">
          <p className="mb-4 text-sm font-semibold text-forest">Podsumowanie</p>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-forest">{offer.title}</p>
              <p className="text-ink-muted">
                {offer.duration} · {offer.groupSize}
              </p>
            </div>
            {selectedDay && selectedTime && (
              <div className="flex items-start gap-2 text-ink-muted">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  {formatDatePL(selectedDay)}
                  <br />
                  godz. {selectedTime}
                </span>
              </div>
            )}
            <div className="border-t border-paper-deep pt-3">
              <div className="flex justify-between font-semibold">
                <span>Razem</span>
                <span className="font-display text-xl text-gold">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
