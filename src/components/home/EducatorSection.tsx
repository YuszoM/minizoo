import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { educators } from "@/data/educator";

export function EducatorSection() {
  return (
    <section className="section-y">
      <div className="container-site">
        <Reveal variant="blur-up">
          <SectionHeading
            className="mb-10"
            title="Poznaj swojego przewodnika"
            description="Spotkania prowadzą Filip i Patrycja — para, która na co dzień żyje ze zwierzętami, nie tylko „robi program”."
            align="center"
          />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {educators.map((person, index) => (
            <Reveal
              key={person.name}
              delay={(index === 0 ? 0 : 1) as 0 | 1}
              variant={index === 0 ? "tilt-right" : "tilt-left"}
            >
              <article>
                <p className="text-sm font-semibold text-gold">{person.role}</p>
                <h3 className="mt-1 font-display text-2xl text-forest md:text-3xl">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{person.experience}</p>
                <p className="mt-4 leading-relaxed text-ink-soft">{person.bio}</p>
                <ul className="mt-5 space-y-2">
                  {person.highlights.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/o-miejscu" className="btn-primary inline-flex">
            Więcej o miejscu
          </Link>
        </div>
      </div>
    </section>
  );
}
