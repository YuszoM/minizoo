import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { funFacts } from "@/data/fun-facts";

export function FunFactsStrip() {
  return (
    <section className="bg-paper-deep/50 py-10 md:py-12" aria-label="Dlaczego egZOOturystyka">
      <div className="container-site">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {funFacts.map((fact, i) => (
            <Reveal key={fact.id} delay={i as 0 | 1 | 2 | 3} variant="rise">
              <article className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(47,58,38,0.05)]">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-paper">
                  <Image
                    src={fact.icon}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-display text-2xl text-forest">{fact.value}</p>
                  <p className="mt-1 text-sm leading-snug text-ink-muted">{fact.label}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
