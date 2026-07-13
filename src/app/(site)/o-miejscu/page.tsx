import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Shield, Sparkles, TreePine } from "lucide-react";
import { DemoPhotoLabel } from "@/components/ui/DemoPhotoLabel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BeforeVisitSection } from "@/components/visit/BeforeVisitSection";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "O miejscu",
  description:
    "Poznaj mini zoo egZOOturystyka — kameralne spotkania ze zwierzętami pod Wrocławiem.",
};

const features = [
  {
    icon: TreePine,
    title: "Blisko natury",
    text: "Sadków, Kąty Wrocławskie — ok. 30 minut od centrum Wrocławia. Spokojne, zielone otoczenie.",
  },
  {
    icon: Shield,
    title: "Bezpieczeństwo",
    text: "Spotkania pod opieką przeszkolonego edukatora. Zwierzęta mają wyznaczone godziny kontaktu.",
  },
  {
    icon: Sparkles,
    title: "Edukacja przez doświadczenie",
    text: "Nie pokazujemy zwierząt za szybą — opowiadamy, pozwalamy obserwować i bezpiecznie dotykać.",
  },
];

export default function OMiejscuPage() {
  return (
    <>
      <section className="relative -mt-[76px] overflow-hidden bg-forest">
        <div className="absolute inset-0">
          <Image
            src="/images/place-interior.png"
            alt="Wnętrze mini zoo"
            fill
            className="object-cover opacity-50"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest/95 via-forest/85 to-forest/70" />
          <DemoPhotoLabel className="right-4 bottom-4 md:right-8 md:bottom-8" />
        </div>
        <div className="container-site relative px-5 py-[calc(76px+4rem)] md:px-8 md:py-[calc(76px+5rem)]">
          <h1 className="display-lg max-w-2xl font-semibold text-white">
            Mini zoo, w którym liczy się każde spotkanie
          </h1>
          <p className="lead mt-6 max-w-xl text-paper/90">
            Kameralne miejsce dla rodzin i szkół — żywe lekcje biologii bez
            hałasu wielkiego ogrodu zoologicznego.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            title="Mniej hałasu, więcej bliskości"
            description="Małe grupy, indywidualne podejście i czas na pytania. Gość nie jest jednym z tysięcy."
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/school-lesson.png"
              alt="Lekcja biologii"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <DemoPhotoLabel />
          </div>
        </div>
      </section>

      <section className="section-y bg-paper-deep/50">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl bg-white p-6">
              <f.icon className="mb-4 h-8 w-8 text-gold" />
              <h3 className="font-display text-xl text-forest">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <BeforeVisitSection />

      <section className="section-y">
        <div className="container-site flex flex-col items-start gap-6 rounded-xl bg-white p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <MapPin className="h-10 w-10 shrink-0 text-gold" />
            <div>
              <h2 className="font-display text-2xl text-forest">Jak dojechać?</h2>
              <p className="mt-2 text-ink-muted">{site.address.full}</p>
              <p className="mt-1 text-sm text-ink-muted">{site.hours}</p>
            </div>
          </div>
          <Link href="/kontakt" className="btn-primary shrink-0">
            Zapytaj o dojazd
          </Link>
        </div>
      </section>
    </>
  );
}
