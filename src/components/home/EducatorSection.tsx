import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { DemoPhotoLabel } from "@/components/ui/DemoPhotoLabel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { educator } from "@/data/educator";

export function EducatorSection() {
  return (
    <section className="section-y">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal variant="fade">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl lg:mx-0">
            <Image
              src={educator.image}
              alt={educator.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 400px"
            />
            <DemoPhotoLabel />
          </div>
        </Reveal>

        <Reveal delay={1} variant="rise">
          <SectionHeading
            className="mb-6"
            title="Poznasz edukatora, nie anonimowego przewodnika"
            description="Każde spotkanie prowadzi ta sama osoba — budujemy zaufanie rodzin i szkół, które do nas wracają."
          />
          <p className="text-sm font-semibold text-gold">{educator.role}</p>
          <h3 className="mt-1 font-display text-3xl text-forest">{educator.name}</h3>
          <p className="mt-1 text-sm text-ink-muted">{educator.experience}</p>
          <p className="mt-4 leading-relaxed text-ink-soft">{educator.bio}</p>
          <ul className="mt-6 space-y-2">
            {educator.highlights.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/o-miejscu" className="btn-primary mt-8 inline-flex">
            Więcej o miejscu
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
