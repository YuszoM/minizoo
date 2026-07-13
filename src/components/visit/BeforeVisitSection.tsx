import Link from "next/link";
import { Clock, Footprints, ParkingCircle, Shield, Shirt } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { beforeVisitTips } from "@/data/visit-info";

export function BeforeVisitSection() {
  return (
    <section className="section-y bg-paper-deep/50">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            title="Przed wizytą — krótko i praktycznie"
            description="Tak jak u najlepszych atrakcji edukacyjnych: wiesz, czego się spodziewać, zanim przyjedziesz."
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beforeVisitTips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <Reveal key={tip.title} delay={(i % 3) as 0 | 1 | 2}>
                <article className="h-full rounded-xl bg-white p-6">
                  <Icon className="mb-3 h-6 w-6 text-gold" />
                  <h3 className="font-display text-lg text-forest">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{tip.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Szczegóły dotyku zwierząt i rezygnacji — w{" "}
          <Link href="/regulamin" className="font-medium text-forest hover:text-gold">
            regulaminie rezerwacji
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
