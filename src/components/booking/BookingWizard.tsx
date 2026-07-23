"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
} from "lucide-react";
import { submitBookingAction } from "@/app/actions/booking";
import { offers } from "@/data/offers";
import { isValidPhone, sanitizePhoneInput } from "@/lib/phone";
import { cn, formatDatePL, formatPrice } from "@/lib/utils";

const TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00"] as const;

const STEPS = [
  { id: 1, label: "Oferta" },
  { id: 2, label: "Termin" },
  { id: 3, label: "Dane" },
  { id: 4, label: "Potwierdzenie" },
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
  return isPast(date) || isMonday(date);
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultGuests(offerId: string) {
  if (offerId === "szkola") return 15;
  if (offerId === "urodziny") return 6;
  return 4;
}

function guestLimits(offerId: string) {
  if (offerId === "szkola") return { min: 15, max: 30, label: "Liczba uczniów" };
  if (offerId === "urodziny") return { min: 1, max: 6, label: "Liczba dzieci" };
  return { min: 2, max: 6, label: "Liczba osób" };
}

type SlotAvailability = {
  time: string;
  booked: number;
  max: number;
  remaining: number;
  full: boolean;
};

export function BookingWizard({
  compact = false,
  initialOfferId,
}: {
  compact?: boolean;
  initialOfferId?: string;
}) {
  const validInitial =
    initialOfferId && offers.some((o) => o.id === initialOfferId)
      ? initialOfferId
      : offers[0].id;

  const [step, setStep] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState(validInitial);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(() => defaultGuests(validInitial));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [ticketCodes, setTicketCodes] = useState<string[]>([]);
  const [slotAvailability, setSlotAvailability] = useState<SlotAvailability[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([...TIME_SLOTS]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(() => new Set());
  const [maxDaysAhead, setMaxDaysAhead] = useState<number | null>(null);

  const offer = offers.find((o) => o.id === selectedOffer) ?? offers[0];
  const baseLimits = guestLimits(offer.id);

  const selectedSlot = slotAvailability.find((s) => s.time === selectedTime);
  const effectiveMax = selectedSlot
    ? Math.min(baseLimits.max, selectedSlot.remaining)
    : baseLimits.max;
  const limits = { ...baseLimits, max: effectiveMax };
  const slotTooSmallForOffer =
    selectedSlot != null && selectedSlot.remaining > 0 && selectedSlot.remaining < baseLimits.min;

  useEffect(() => {
    const y = viewDate.getFullYear();
    const m = String(viewDate.getMonth() + 1).padStart(2, "0");
    let cancelled = false;

    fetch(`/api/bookings/availability?month=${y}-${m}`)
      .then((res) => res.json())
      .then(
        (data: {
          unavailableDates?: string[];
          blockedDates?: string[];
          timeSlots?: string[];
          maxDaysAhead?: number;
        }) => {
          if (cancelled) return;
          const list = data.unavailableDates ?? data.blockedDates ?? [];
          setUnavailableDates(new Set(list));
          if (data.timeSlots?.length) setTimeSlots(data.timeSlots);
          if (typeof data.maxDaysAhead === "number") setMaxDaysAhead(data.maxDaysAhead);
        },
      )
      .catch(() => {
        if (!cancelled) setUnavailableDates(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [viewDate]);

  useEffect(() => {
    if (!selectedDay) {
      setSlotAvailability([]);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);

    fetch(`/api/bookings/availability?date=${toIsoDate(selectedDay)}`)
      .then((res) => res.json())
      .then(
        (data: {
          slots?: SlotAvailability[];
          blocked?: boolean;
          bookable?: boolean;
          timeSlots?: string[];
        }) => {
          if (cancelled) return;
          if (data.timeSlots?.length) setTimeSlots(data.timeSlots);
          if (data.blocked || data.bookable === false) {
            setSlotAvailability([]);
            setSelectedTime(null);
            return;
          }
          setSlotAvailability(data.slots ?? []);
        },
      )
      .catch(() => {
        if (!cancelled) setSlotAvailability([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDay]);

  useEffect(() => {
    if (selectedSlot?.full) setSelectedTime(null);
  }, [selectedSlot?.full]);

  useEffect(() => {
    setGuests((g) => Math.min(Math.max(g, limits.min), limits.max));
  }, [limits.min, limits.max]);

  const totalPrice = useMemo(() => {
    if (offer.id === "szkola") return offer.price * Math.max(guests, limits.min);
    return offer.price;
  }, [offer, guests, limits.min]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = new Date(year, month, 1).getDay();
  const offset = firstWeekday === 0 ? 6 : firstWeekday - 1;

  const monthLabel = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(viewDate);

  function selectOffer(id: string) {
    setSelectedOffer(id);
    setGuests(defaultGuests(id));
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, 4));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleConfirm() {
    if (!selectedDay || !selectedTime) return;

    setPaying(true);
    setPayError(null);

    const result = await submitBookingAction({
      offerId: offer.id,
      visitDate: toIsoDate(selectedDay),
      visitTime: selectedTime,
      guestCount: guests,
      customerName: name,
      email,
      phone,
    });

    setPaying(false);

    if (!result.ok) {
      setPayError(result.error);
      return;
    }

    setOrderNumber(result.orderNumber);
    setTicketCodes(result.ticketCodes);
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
          Wysłaliśmy na <strong className="text-forest">{email}</strong> dwa e-maile: potwierdzenie
          rezerwacji oraz numery biletów. Płatność ({formatPrice(totalPrice)}) przy wejściu na
          miejscu.
        </p>
        <dl className="mt-6 space-y-2 rounded-lg bg-paper p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Numer zamówienia</dt>
            <dd className="font-mono font-medium">{orderNumber}</dd>
          </div>
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
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Osoby</dt>
            <dd className="font-medium">{guests}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-paper-deep pt-2">
            <dt className="text-ink-muted">Kwota</dt>
            <dd className="font-display text-xl text-gold">{formatPrice(totalPrice)}</dd>
          </div>
        </dl>
        {ticketCodes.length > 0 && (
          <div className="mt-4 rounded-lg border border-gold/30 bg-gold/8 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Numery biletów
            </p>
            <ul className="mt-2 space-y-1 font-mono text-sm font-semibold tracking-wider text-forest">
              {ticketCodes.map((code, i) => (
                <li key={code}>
                  Bilet {i + 1}: {code}
                </li>
              ))}
            </ul>
          </div>
        )}
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
            <p className="mt-1 text-sm font-medium text-ink-soft">
              Pakiet → termin → dane → potwierdzenie
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
                    : "border border-paper-deep bg-white text-ink-soft",
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
                    onClick={() => selectOffer(o.id)}
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
                        <span className="rounded-full bg-gold/25 px-2 py-0.5 text-[10px] font-bold text-forest uppercase">
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
                    const iso = toIsoDate(date);
                    const unavailable =
                      isUnavailable(date) || unavailableDates.has(iso);
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
                  Poniedziałki zamknięte
                  {maxDaysAhead != null
                    ? ` · zapisy max ${maxDaysAhead} dni do przodu (lub dni odblokowane przez organizatora)`
                    : ""}
                </p>
              </div>

              {selectedDay && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-forest">
                    Godzina — {formatDatePL(selectedDay)}
                  </p>
                  {loadingSlots ? (
                    <p className="text-sm text-ink-muted">Sprawdzam wolne miejsca…</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((time) => {
                        const slot = slotAvailability.find((s) => s.time === time);
                        const full = slot?.full ?? false;
                        const remaining = slot?.remaining;

                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={full}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                              full && "cursor-not-allowed opacity-40 line-through",
                              !full &&
                                selectedTime === time &&
                                "border-forest bg-forest text-paper",
                              !full &&
                                selectedTime !== time &&
                                "border-paper-deep hover:border-gold",
                            )}
                          >
                            {time}
                            {remaining != null && !full && (
                              <span className="ml-1.5 text-xs opacity-80">({remaining} miejsc)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                    autoComplete="name"
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
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Telefon</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={9}
                    pattern="[0-9]{9}"
                    value={phone}
                    onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                    className={inputClass}
                    placeholder="600000000"
                    autoComplete="tel"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    {limits.label}
                  </span>
                  <input
                    type="number"
                    min={limits.min}
                    max={limits.max}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-ink-muted">
                    Od {limits.min} do {limits.max} — każda osoba otrzyma osobny numer biletu.
                    {selectedSlot && selectedSlot.remaining < baseLimits.max && (
                      <> W tym terminie zostało {selectedSlot.remaining} miejsc.</>
                    )}
                    {slotTooSmallForOffer && (
                      <span className="block text-red-600">
                        Ten termin ma za mało miejsc dla pakietu (min. {baseLimits.min} os.).
                        Wybierz inną godzinę lub pakiet.
                      </span>
                    )}
                  </p>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="font-display text-xl text-forest">Potwierdzenie rezerwacji</h3>
              <div className="rounded-lg border border-gold/30 bg-gold/8 p-6">
                <div className="flex items-center gap-3">
                  <Banknote className="h-8 w-8 text-gold" />
                  <div>
                    <p className="font-semibold text-forest">Płatność na miejscu</p>
                    <p className="text-sm text-ink-muted">
                      Rezerwacja online jest bezpłatna. Kwotę {formatPrice(totalPrice)} uregulujesz
                      przy wejściu (gotówka lub BLIK). Bilety wyślemy na e-mail po potwierdzeniu.
                    </p>
                  </div>
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" defaultChecked className="mt-1" />
                <span className="text-ink-muted">
                  Akceptuję{" "}
                  <a href="/regulamin" className="text-link">
                    regulamin
                  </a>{" "}
                  rezerwacji.
                </span>
              </label>
              {payError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {payError}
                </p>
              )}
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
                  (step === 2 && (!selectedDay || !selectedTime || slotTooSmallForOffer)) ||
                  (step === 3 &&
                    (!name ||
                      !email ||
                      !isValidPhone(phone) ||
                      guests < limits.min ||
                      guests > limits.max ||
                      slotTooSmallForOffer))
                }
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Dalej
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={paying}
                className="btn-gold min-w-[160px]"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Zapisywanie…
                  </>
                ) : (
                  <>Potwierdź rezerwację</>
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
            {step >= 3 && (
              <p className="text-ink-muted">
                {guests} {guests === 1 ? "bilet" : guests < 5 ? "bilety" : "biletów"}
              </p>
            )}
            <div className="border-t border-paper-deep pt-3">
              <div className="flex justify-between font-semibold">
                <span>Do zapłaty na miejscu</span>
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
