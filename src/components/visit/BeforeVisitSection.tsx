import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealStagger } from "@/components/ui/RevealStagger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { beforeVisitTips } from "@/data/visit-info";
import { TIP_VARIANTS } from "@/lib/motion/variants";

export function BeforeVisitSection() {
  return (
    <section className="section-y bg-paper-deep/50">
      <div className="container-site">
        <Reveal variant="rise">
          <SectionHeading
            title="Przed wizytą — krótko i praktycznie"
            description="Wiesz, czego się spodziewać, zanim przyjedziesz."
          />
        </Reveal>

        <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beforeVisitTips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <RevealItem key={tip.title} variant={TIP_VARIANTS[i] ?? "rise"}>
                <article className="h-full rounded-xl bg-white p-6">
                  <Icon className="mb-3 h-6 w-6 text-gold" />
                  <h3 className="font-display text-lg text-forest">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{tip.text}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>

        <Reveal delay={1} variant="scale">
          <div className="mt-12 overflow-hidden rounded-2xl border border-forest/15 bg-forest text-paper shadow-[0_16px_48px_rgba(47,58,38,0.12)]">
            <div className="grid items-stretch md:grid-cols-[minmax(0,240px)_1fr]">
              <div className="relative min-h-[220px] bg-forest-light/40 md:min-h-full">
                {/* Placeholder — docelowa grafika zaproszeń od klientki */}
                <Image
                  src="/images/illustrations/diploma-template.jpg"
                  alt="Zaproszenie na urodziny w mini zoo — podgląd"
                  fill
                  className="object-cover object-top opacity-90"
                  sizes="(max-width: 768px) 100vw, 240px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent md:bg-gradient-to-r" />
                <p className="absolute bottom-3 left-3 rounded bg-black/35 px-2 py-1 text-[10px] font-semibold tracking-wide text-paper/90 uppercase backdrop-blur-sm">
                  Grafika do wymiany
                </p>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                <p className="text-sm font-semibold text-gold-bright">Urodziny</p>
                <h3 className="mt-2 font-display text-2xl text-paper md:text-3xl">
                  Zaproszenia na urodziny
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/85">
                  Przed imprezą warto zaprosić gości — dlatego przygotowaliśmy zaproszenia.
                  Pobierz, uzupełnij datę i godzinę, wyślij rodzicom.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/images/illustrations/diploma-template.jpg"
                    download
                    className="btn-gold inline-flex text-sm"
                  >
                    Pobierz zaproszenie
                  </a>
                  <Link href="/rezerwacja?pakiet=urodziny" className="btn-ghost inline-flex text-sm">
                    Zarezerwuj przyjęcie
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Szczegóły dotyku zwierząt i rezygnacji — w{" "}
          <Link href="/regulamin" className="text-link">
            regulaminie rezerwacji
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
