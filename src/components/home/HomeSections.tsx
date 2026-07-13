import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Shield, Sparkles, Users } from "lucide-react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { animals } from "@/data/animals";
import { offers } from "@/data/offers";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-[min(92vh,900px)] overflow-hidden bg-forest">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-encounter.png"
          alt="Dzieci podczas spotkania ze zwierzętami"
          fill
          className="object-cover object-[center_30%] opacity-90"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/92 via-forest/72 to-forest/35" />
        <div className="grain absolute inset-0 opacity-60" />
      </div>

      <div className="container-site relative grid min-h-[min(92vh,900px)] items-end gap-10 pb-14 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20 lg:pt-32">
        <div className="reveal max-w-xl text-paper">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-paper/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-gold-bright" />
            Mini zoo · {site.address.city}
          </p>
          <h1 className="display-xl font-semibold text-white">
            Poznaj świat zwierząt —{" "}
            <span className="text-gold-bright">bez tłumów i pośpiechu</span>
          </h1>
          <p className="lead mt-6 text-paper/85">
            Kameralne spotkania dla rodzin i żywe lekcje biologii dla szkół.
            Wybierz termin, opłać online — gotowe w 3 minuty.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/rezerwacja" className="btn-gold">
              <CalendarDays className="h-4 w-4" />
              Zarezerwuj termin
            </Link>
            <Link href="/zwierzeta" className="btn-ghost">
              Poznaj zwierzęta
            </Link>
          </div>
        </div>

        <div className="reveal reveal-delay-1 surface-elevated overflow-hidden p-6 md:p-8">
          <p className="text-sm font-semibold text-forest">Najbliższe wolne terminy</p>
          <ul className="mt-4 space-y-3">
            {["Sobota 10:00", "Sobota 14:00", "Niedziela 12:00"].map((slot) => (
              <li
                key={slot}
                className="flex items-center justify-between border-b border-paper-deep py-2 text-sm last:border-0"
              >
                <span className="text-ink-soft">{slot}</span>
                <span className="font-semibold text-gold">wolne</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-ink-muted">
            Od {formatPrice(249)} za spotkanie rodzinne · płatność kartą lub BLIK
          </p>
          <Link href="/rezerwacja" className="btn-primary mt-5 w-full">
            Wybierz termin
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items = [
    { icon: Users, label: "Max 6 osób w grupie" },
    { icon: Clock, label: "90 min bez pośpiechu" },
    { icon: Shield, label: "Opieka edukatora" },
  ];

  return (
    <section className="border-y border-paper-deep bg-white">
      <div className="container-site grid gap-6 py-8 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={(i as 0 | 1 | 2) || 0}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-forest">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-forest">{item.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function OfferPreviewSection() {
  return (
    <section className="section-y">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            title="Trzy sposoby na spotkanie ze zwierzętami"
            description="Prosto i bez przeładowania — wybierz to, czego potrzebujesz. Resztą zajmiemy się na miejscu."
          />
        </Reveal>

        <div className="space-y-6">
          {offers.map((offer, index) => (
            <Reveal key={offer.id} delay={(index as 0 | 1 | 2) || 0}>
              <article className="group grid overflow-hidden rounded-xl bg-white md:grid-cols-[280px_1fr_auto] md:items-center">
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[220px]">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 280px"
                  />
                </div>
                <div className="p-6 md:px-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-2xl text-forest">{offer.title}</h3>
                    {offer.popular && (
                      <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-bold text-gold-muted uppercase">
                        Ulubione rodzin
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-ink-muted">{offer.subtitle}</p>
                  <p className="mt-3 text-sm text-ink-soft">
                    {offer.duration} · {offer.groupSize}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 border-t border-paper-deep p-6 md:border-t-0 md:border-l md:min-w-[200px]">
                  <p className="font-display text-3xl text-gold">
                    {formatPrice(offer.price)}
                    {offer.priceNote && (
                      <span className="block text-sm font-normal text-ink-muted">
                        {offer.priceNote}
                      </span>
                    )}
                  </p>
                  <Link href={`/rezerwacja?pakiet=${offer.id}`} className="link-arrow text-sm">
                    Rezerwuj <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnimalsBentoSection() {
  const featured = animals.slice(0, 3);

  return (
    <section className="section-y bg-paper-deep/60">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            title="Mieszkańcy, których poznasz z bliska"
            description="Karakal, lemur, kajman — i wiele innych. Każde spotkanie to opowieść o przyrodzie, nie pokaz za szybą."
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-5">
          <Reveal className="md:col-span-7 md:row-span-2">
            <article className="group relative min-h-[360px] overflow-hidden rounded-xl">
              <Image
                src={featured[0].image}
                alt={featured[0].name}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-6 text-paper">
                <p className="text-sm italic text-gold-bright">{featured[0].latin}</p>
                <h3 className="mt-1 font-display text-3xl">{featured[0].name}</h3>
                <p className="mt-2 max-w-lg text-sm text-paper/85">{featured[0].funFact}</p>
              </div>
            </article>
          </Reveal>

          {featured.slice(1).map((animal, i) => (
            <Reveal key={animal.id} className="md:col-span-5" delay={(i + 1) as 1 | 2}>
              <article className="group relative min-h-[220px] overflow-hidden rounded-xl">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-5 text-paper">
                  <h3 className="font-display text-xl">{animal.name}</h3>
                  <p className="text-xs text-paper/75">{animal.habitat}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/zwierzeta" className="btn-primary">
            Wszystkie zwierzęta
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BookingSection() {
  return (
    <section className="section-y bg-forest text-paper" id="rezerwacja">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            tone="light"
            title="Zarezerwuj i opłać wizytę online"
            description="Kalendarz, wybór godziny i płatność w jednym miejscu — tak prosto, jak powinno być."
            align="center"
            className="mx-auto"
          />
        </Reveal>
        <Reveal delay={1}>
          <BookingWizard compact />
        </Reveal>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const featured = reviews[0];

  return (
    <section className="section-y">
      <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="font-display text-5xl leading-none text-gold md:text-6xl">4.9</p>
          <p className="mt-2 text-sm font-semibold text-forest">średnia ocen gości</p>
          <SectionHeading
            className="mt-8 mb-0"
            title="Rodziny i szkoły wracają z uśmiechem"
            description="Nie budujemy strony na setkach sekcji — wystarczą prawdziwe historie od osób, które były u nas."
          />
        </Reveal>

        <Reveal delay={1}>
          <blockquote className="surface-elevated relative p-8 md:p-10">
            <div className="mb-4 flex gap-1 text-gold">
              {Array.from({ length: featured.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="font-display text-2xl leading-snug text-forest md:text-[1.65rem]">
              &ldquo;{featured.text}&rdquo;
            </p>
            <footer className="mt-6 flex items-center justify-between gap-4 border-t border-paper-deep pt-5">
              <div>
                <p className="font-semibold text-forest">{featured.name}</p>
                <p className="text-sm text-ink-muted">
                  {featured.role} · {featured.date}
                </p>
              </div>
              <Link href="/opinie" className="link-arrow shrink-0 text-sm">
                Więcej <ArrowRight className="h-4 w-4" />
              </Link>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="container-site">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-forest px-8 py-14 text-center md:px-16 md:py-16">
            <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
            <h2 className="display-lg relative font-semibold text-white">
              Weekendy znikają szybko
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-paper/80">
              Zarezerwuj termin z wyprzedzeniem — spotkanie ze zwierzętami czeka.
            </p>
            <Link href="/rezerwacja" className="btn-gold relative mt-8">
              <CalendarDays className="h-4 w-4" />
              Rezerwuj teraz
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
