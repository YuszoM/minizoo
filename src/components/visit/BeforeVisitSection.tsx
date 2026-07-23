import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealStagger } from "@/components/ui/RevealStagger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { beforeVisitTips } from "@/data/visit-info";
import { TIP_VARIANTS } from "@/lib/motion/variants";

function DownloadCard({
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
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageLabel: string;
  downloadHref: string;
  downloadLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-forest/15 bg-forest text-paper shadow-[0_16px_48px_rgba(47,58,38,0.12)]">
      <div className="grid items-stretch md:grid-cols-[minmax(0,240px)_1fr]">
        <div className="relative min-h-[220px] bg-forest-light/40 md:min-h-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 240px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-forest/40" />
          <p className="absolute bottom-3 left-3 rounded bg-black/35 px-2 py-1 text-[10px] font-semibold tracking-wide text-paper/90 uppercase backdrop-blur-sm">
            {imageLabel}
          </p>
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
          <p className="text-sm font-semibold text-gold-bright">{eyebrow}</p>
          <h3 className="mt-2 font-display text-2xl text-paper md:text-3xl">{title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/85">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={downloadHref} download className="btn-gold inline-flex text-sm">
              {downloadLabel}
            </a>
            {secondaryHref && secondaryLabel ? (
              <Link href={secondaryHref} className="btn-ghost inline-flex text-sm">
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
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
          <Reveal delay={1} variant="scale">
            <DownloadCard
              eyebrow="Pamiątka z wizyty"
              title="Spis karmienia"
              description="Checklistę „Mały odkrywca” możesz pobrać przed wizytą albo zabrać jako pamiątkę po spotkaniu ze zwierzętami."
              imageSrc="/images/illustrations/feeding-schedule.jpg"
              imageAlt="Spis karmienia — Mały odkrywca egZOOturystyka"
              imageLabel="Spis karmienia"
              downloadHref="/images/illustrations/feeding-schedule.jpg"
              downloadLabel="Pobierz spis karmienia"
            />
          </Reveal>

          <Reveal delay={2} variant="scale">
            <DownloadCard
              eyebrow="Urodziny"
              title="Zaproszenia na urodziny"
              description="Przed imprezą warto zaprosić gości, dlatego przygotowaliśmy zaproszenia. Pobierz, uzupełnij datę i godzinę, wyślij rodzicom."
              imageSrc="/images/illustrations/birthday-invitation.jpg"
              imageAlt="Zaproszenie na urodziny w mini zoo — podgląd"
              imageLabel="Wzorzec zaproszenia"
              downloadHref="/images/illustrations/birthday-invitation.jpg"
              downloadLabel="Pobierz zaproszenie"
              secondaryHref="/rezerwacja?pakiet=urodziny"
              secondaryLabel="Zarezerwuj przyjęcie"
            />
          </Reveal>
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
