import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealStagger } from "@/components/ui/RevealStagger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { beforeVisitTips } from "@/data/visit-info";
import { TIP_VARIANTS } from "@/lib/motion/variants";

function SouvenirCard({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageLabel,
  downloadHref,
  downloadLabel,
  secondaryHref,
  secondaryLabel,
  delay = 1,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageLabel: string;
  downloadHref: string;
  downloadLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  return (
    <Reveal delay={delay} variant="scale">
      <div className="overflow-hidden rounded-2xl border border-paper-deep/80 bg-[#f3ebe0] shadow-[0_8px_32px_rgba(47,58,38,0.06)]">
        <div className="grid items-stretch md:grid-cols-[minmax(0,240px)_1fr]">
          <div className="relative min-h-[260px] bg-paper md:min-h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 240px"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8 lg:px-10 lg:py-9">
            {eyebrow ? (
              <p className="text-sm font-semibold text-gold">{eyebrow}</p>
            ) : null}
            <h3
              className={`font-display text-2xl text-forest md:text-3xl ${eyebrow ? "mt-2" : ""}`}
            >
              {title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={downloadHref} download className="btn-primary inline-flex text-sm">
                {downloadLabel}
              </a>
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:bg-white/60"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

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

        <div className="mt-12 space-y-6">
          <SouvenirCard
            title="Dyplom Małego Odkrywcy"
            description="Po wizycie każde dziecko dostaje pamiątkowy dyplom – jak po prawdziwej wyprawie przyrodniczej. Rodzice chętnie wrzucają go na Facebooka – a my się z tego cieszymy."
            imageSrc="/images/illustrations/explorer-kids.jpg"
            imageAlt="Małe odkrywcy — dzieci w klimacie wyprawy przyrodniczej"
            imageLabel="Mały odkrywca"
            downloadHref="/images/illustrations/diploma-malego-odkrywcy.jpg"
            downloadLabel="Pobierz podgląd dyplomu"
            delay={1}
          />

          <SouvenirCard
            eyebrow="Urodziny"
            title="Zaproszenia na urodziny"
            description="Przed imprezą warto zaprosić gości, dlatego przygotowaliśmy zaproszenia."
            imageSrc="/images/illustrations/birthday-invitation.jpg"
            imageAlt="Zaproszenie na urodziny — podgląd"
            imageLabel="Zaproszenie"
            downloadHref="/images/illustrations/birthday-invitation.jpg"
            downloadLabel="Pobierz zaproszenie"
            secondaryHref="/rezerwacja?pakiet=urodziny"
            secondaryLabel="Zarezerwuj przyjęcie"
            delay={2}
          />
        </div>

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
