import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { DemoPhotoLabel } from "@/components/ui/DemoPhotoLabel";
import { PricingTable } from "@/components/oferta/PricingTable";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { offers } from "@/data/offers";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Oferta",
  description:
    "Spotkania rodzinne, urodziny w mini zoo i żywe lekcje biologii dla szkół.",
};

export default function OfertaPage() {
  return (
    <div className="section-y">
      <div className="container-site">
        <SectionHeading
          as="h1"
          title="Programy spotkań ze zwierzętami"
          description="Każda wizyta to indywidualnie prowadzone spotkanie — bez tłumów, z czasem na pytania."
        />

        <div className="space-y-8">
          {offers.map((offer, index) => (
            <article
              key={offer.id}
              className="grid overflow-hidden rounded-xl bg-white md:grid-cols-2"
            >
              <div
                className={`relative min-h-[280px] ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <DemoPhotoLabel />
              </div>
              <div className="flex flex-col justify-center p-8">
                {offer.popular && (
                  <span className="mb-2 w-fit rounded-full bg-gold/25 px-3 py-1 text-xs font-bold text-forest uppercase">
                    Najczęściej wybierane
                  </span>
                )}
                <h2 className="font-display text-2xl text-forest md:text-3xl">
                  {offer.title}
                </h2>
                <p className="mt-2 text-ink-muted">{offer.subtitle}</p>
                <p className="mt-4 text-sm text-ink-soft">
                  <strong>{offer.duration}</strong> · {offer.groupSize}
                </p>
                <p className="mt-4 font-display text-3xl text-gold">
                  {formatPrice(offer.price)}
                  {offer.priceNote && (
                    <span className="text-base font-normal text-ink-muted">
                      {" "}
                      / {offer.priceNote}
                    </span>
                  )}
                </p>
                <ul className="mt-6 space-y-2">
                  {offer.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/rezerwacja?pakiet=${offer.id}`}
                  className="btn-primary mt-8 w-fit"
                >
                  Zarezerwuj ten pakiet
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section id="cennik" className="mt-20 scroll-mt-28">
          <SectionHeading
            title="Cennik — przejrzyście i bez niespodzianek"
            description="Wszystkie ceny brutto. Płatność online przy rezerwacji (karta, BLIK)."
          />
          <div className="mt-8">
            <PricingTable />
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Dla grup szkolnych powyżej 30 uczniów lub wizyt poza standardowymi godzinami —{" "}
            <Link href="/kontakt" className="text-gold hover:underline">
              napisz do nas
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
