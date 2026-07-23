import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { DemoPhotoLabel } from "@/components/ui/DemoPhotoLabel";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { FaqMotionCard } from "@/components/motion/FaqMotionCard";
import {
  HeroBookingCard,
  HeroMascot,
  HeroStaggerGroup,
} from "@/components/motion/HeroAnimated";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { animals } from "@/data/animals";
import { faqItems } from "@/data/faq";
import { offers } from "@/data/offers";
import { reviews } from "@/data/reviews";
import { GoogleReviewsBadge } from "@/components/social/GoogleReviewsBadge";
import { site } from "@/data/site";
import {
  ANIMAL_VARIANTS,
  OFFER_VARIANTS,
  TRUST_VARIANTS,
} from "@/lib/motion/variants";
import { trustStats } from "@/data/trust";
import { getUpcomingSlots } from "@/lib/next-slots";
import { formatPrice } from "@/lib/utils";

export function HeroSection() {
  const slots = getUpcomingSlots(3);

  return (
    <section className="relative -mt-[76px] min-h-[min(92vh,900px)] overflow-hidden bg-forest">
      <div className="absolute inset-0 overflow-hidden">
        {/* Mobile: pionowy kadr z tej samej sceny co desktop */}
        <div className="hero-ken-burns absolute inset-0 md:hidden">
          <Image
            src="/images/hero-encounter-mobile.jpg"
            alt="Dzieci podczas spotkania ze zwierzętami"
            fill
            className="object-cover object-[center_42%]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-ken-burns absolute inset-0 hidden md:block">
          <Image
            src="/images/hero-encounter.png"
            alt="Dzieci podczas spotkania ze zwierzętami"
            fill
            className="object-cover object-[center_30%]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-forest/95 via-forest/82 to-forest/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-transparent to-forest/40" />
        <div className="grain absolute inset-0 opacity-50" />
        <div className="hero-glow pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="hero-float pointer-events-none absolute bottom-[28%] left-[6%] h-14 w-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm md:h-20 md:w-20" />
        <div className="pointer-events-none absolute right-2 bottom-28 w-28 opacity-90 sm:right-4 sm:bottom-32 sm:w-32 md:right-0 md:bottom-0 md:w-48 lg:w-56">
          <HeroMascot>
            <Image
              src="/images/illustrations/mascot-lemur.jpg"
              alt=""
              width={512}
              height={512}
              className="h-auto w-full drop-shadow-lg"
              priority
            />
          </HeroMascot>
        </div>
        <DemoPhotoLabel className="right-4 bottom-4 md:right-8 md:bottom-8" />
      </div>

      <div className="container-site relative grid min-h-[min(92vh,900px)] items-center gap-10 pb-14 pt-[calc(76px+3rem)] lg:grid-cols-[1.1fr_0.9fr] lg:pb-20 lg:pt-[calc(76px+4rem)]">
        <div className="max-w-xl text-paper">
          <HeroStaggerGroup>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-1.5 text-sm text-paper backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-gold-bright" />
              Mini zoo · {site.address.city}
            </p>
            <h1 className="display-xl font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              Poznaj świat zwierząt —{" "}
              <span className="text-gold-bright">bez tłumów i pośpiechu</span>
            </h1>
            <p className="lead mt-6 text-paper/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
              Kameralne spotkania dla rodzin i żywe lekcje biologii dla szkół.
              Wybierz termin online — płatność na miejscu, gotowe w 3 minuty.
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
          </HeroStaggerGroup>
        </div>

        <HeroBookingCard>
          <div className="surface-elevated card-hover overflow-hidden p-6 md:p-8">
            <p className="text-sm font-semibold text-forest">Najbliższe wolne terminy</p>
            <ul className="mt-4 space-y-3">
              {slots.map((slot) => (
                <li
                  key={`${slot.label}-${slot.time}`}
                  className="flex items-center justify-between border-b border-paper-deep py-2 text-sm last:border-0"
                >
                  <span className="text-ink-soft">
                    <span className="font-medium text-ink">{slot.label}</span>
                    {" · "}
                    {slot.time}
                  </span>
                  <span className="font-semibold text-gold">wolne</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-ink-soft">
              Od {formatPrice(249)} za spotkanie rodzinne · płatność na miejscu
            </p>
            <Link href="/rezerwacja" className="btn-primary mt-5 w-full">
              Wybierz termin
            </Link>
          </div>
        </HeroBookingCard>
      </div>
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="border-y border-paper-deep bg-white" aria-label="Liczby zaufania">
      <div className="container-site grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {trustStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i as 0 | 1 | 2 | 3} variant={TRUST_VARIANTS[i] ?? "pop"}>
            <div className="text-center lg:text-left">
              <p className="font-display text-3xl text-gold md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-forest">{stat.label}</p>
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
        <Reveal variant="blur-up">
          <SectionHeading
            title="Trzy sposoby na spotkanie ze zwierzętami"
            description="Prosto i kameralnie — wybierz to, czego potrzebujesz. Resztą zajmiemy się na miejscu."
          />
        </Reveal>

        <div className="space-y-6">
          {offers.map((offer, index) => (
            <Reveal
              key={offer.id}
              delay={index as 0 | 1 | 2}
              variant={OFFER_VARIANTS[index] ?? "tilt-right"}
            >
              <article className="card-hover group grid overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(47,58,38,0.06)] md:grid-cols-[280px_1fr_auto] md:items-center">
                <div className="relative aspect-[16/10] bg-paper md:aspect-auto md:min-h-[220px]">
                  <Image
                    src={offer.image}
                    alt=""
                    fill
                    className="object-cover opacity-30"
                    sizes="(max-width: 768px) 100vw, 280px"
                    aria-hidden
                  />
                  {offer.icon && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <Image
                        src={offer.icon}
                        alt={offer.title}
                        width={200}
                        height={200}
                        className="h-auto max-h-[160px] w-auto max-w-[160px] drop-shadow-sm"
                      />
                    </div>
                  )}
                  <DemoPhotoLabel />
                </div>
                <div className="p-6 md:px-8">
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.icon && (
                      <Image
                        src={offer.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="hidden h-10 w-10 rounded-full md:hidden"
                        aria-hidden
                      />
                    )}
                    <h3 className="font-display text-2xl text-forest">{offer.title}</h3>
                    {offer.popular && (
                      <span className="rounded-full bg-gold/25 px-2.5 py-0.5 text-[11px] font-bold text-forest uppercase">
                        Ulubione rodzin
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-ink-muted">{offer.subtitle}</p>
                  <p className="mt-3 text-sm text-ink-soft">
                    {offer.duration} · {offer.groupSize}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 border-t border-paper-deep p-6 md:min-w-[200px] md:border-t-0 md:border-l">
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

        <p className="mt-8 text-center">
          <Link href="/oferta#cennik" className="link-arrow text-sm">
            Pełny cennik <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
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
            description="Karakal, krokodyl — i wiele innych. Każde spotkanie to opowieść o przyrodzie, a nie zwykły pokaz za szybą."
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-5">
          <Reveal className="md:col-span-7 md:row-span-2" variant="blur-up">
            <article className="card-hover group relative min-h-[360px] overflow-hidden rounded-xl bg-paper">
              <Image
                src={featured[0].illustration}
                alt={featured[0].name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-6 text-paper">
                <p className="text-sm italic text-gold-bright">{featured[0].latin}</p>
                <h3 className="mt-1 font-display text-3xl">{featured[0].name}</h3>
                <p className="mt-2 max-w-lg text-sm text-paper/85">{featured[0].funFact}</p>
              </div>
            </article>
          </Reveal>

          {featured.slice(1).map((animal, i) => (
            <Reveal
              key={animal.id}
              className="md:col-span-5"
              variant={ANIMAL_VARIANTS[i + 1] ?? "tilt-left"}
            >
              <article className="card-hover group relative min-h-[220px] overflow-hidden rounded-xl bg-paper">
                <Image
                  src={animal.illustration}
                  alt={animal.name}
                  fill
                  className="object-contain p-3"
                  sizes="40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-5 text-paper">
                  <h3 className="font-display text-xl">{animal.name}</h3>
                  <p className="mt-1 text-xs text-paper/80">{animal.habitat}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-paper/90">
                    {animal.funFact}
                  </p>
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

export function FaqPreviewSection() {
  const preview = faqItems.slice(0, 3);

  return (
    <section className="section-y bg-paper-deep/40">
      <div className="container-site max-w-3xl">
        <Reveal variant="blur-up">
          <div className="relative">
            <SectionHeading
              title="Najczęstsze pytania"
              description="Krótko o rezerwacji, wieku dzieci i dotyku zwierząt — reszta na stronie FAQ."
              align="center"
              className="mx-auto"
            />
            <div className="mx-auto mt-6 flex justify-center md:pointer-events-none md:absolute md:-top-4 md:right-0 md:mt-0 md:overflow-hidden md:rounded-2xl md:border md:border-gold/25 md:bg-gradient-to-br md:from-[#ebe3d0] md:to-[#e2d4bc] md:p-1.5 md:shadow-sm">
              <Image
                src="/images/illustrations/mascot-lemur.jpg"
                alt=""
                width={80}
                height={80}
                className="h-16 w-16 rotate-6 rounded-xl object-cover md:h-16 md:w-16"
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 space-y-3">
          {preview.map((item, i) => (
            <Reveal
              key={item.question}
              delay={(i as 0 | 1 | 2) || 0}
              variant={(["blur-up", "tilt-left", "slide-right"] as const)[i] ?? "rise"}
            >
              <FaqMotionCard question={item.question} answer={item.answer} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link href="/faq" className="link-arrow text-sm">
            Wszystkie pytania <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}

export function BookingSection() {
  return (
    <section className="section-y bg-forest text-paper" id="rezerwacja">
      <div className="container-site">
        <Reveal variant="blur-up">
          <SectionHeading
            tone="light"
            title="Zarezerwuj wizytę online"
            description="Kalendarz, wybór godziny i bilety mailem — płatność przy wejściu."
            align="center"
            className="mx-auto"
          />
        </Reveal>
        <Reveal delay={1} variant="pop">
          <BookingWizard compact />
        </Reveal>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const [featured, second] = reviews;

  return (
    <section className="section-y">
      <div className="container-site">
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-paper-deep bg-white px-4 py-2">
            <span className="font-display text-2xl text-forest">{site.googleReviews.rating}</span>
            <span className="text-sm text-ink-muted">· {site.googleReviews.reviewCount} opinii</span>
          </div>
          <GoogleReviewsBadge />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal variant="tilt-right">
            <blockquote className="card-hover surface-elevated relative h-full p-8">
              <div className="mb-4 flex gap-1 text-gold">
                {Array.from({ length: featured.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="font-display text-xl leading-snug text-forest md:text-2xl">
                &ldquo;{featured.text}&rdquo;
              </p>
              <footer className="mt-6 border-t border-paper-deep pt-5">
                <p className="font-semibold text-forest">{featured.name}</p>
                <p className="text-sm text-ink-muted">
                  {featured.role} · {featured.date}
                </p>
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={1} variant="tilt-left">
            <blockquote className="card-hover surface-elevated relative h-full p-8">
              <div className="mb-4 flex gap-1 text-gold">
                {Array.from({ length: second.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="font-display text-xl leading-snug text-forest md:text-2xl">
                &ldquo;{second.text}&rdquo;
              </p>
              <footer className="mt-6 flex items-center justify-between gap-4 border-t border-paper-deep pt-5">
                <div>
                  <p className="font-semibold text-forest">{second.name}</p>
                  <p className="text-sm text-ink-muted">
                    {second.role} · {second.date}
                  </p>
                </div>
                <Link href="/opinie" className="link-arrow shrink-0 text-sm">
                  Więcej <ArrowRight className="h-4 w-4" />
                </Link>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="container-site">
        <Reveal variant="pop">
          <div className="relative overflow-hidden rounded-2xl bg-forest px-8 py-14 text-center md:px-16 md:py-16">
            <div className="hero-glow absolute -top-24 -right-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-2 -bottom-2 w-28 opacity-40 sm:w-32 md:-right-4 md:-bottom-4 md:w-40">
              <Image
                src="/images/illustrations/corner-flourish.jpg"
                alt=""
                width={400}
                height={400}
                className="h-auto w-full"
              />
            </div>
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
