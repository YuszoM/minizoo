import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { animals } from "@/data/animals";

export const metadata: Metadata = {
  title: "Zwierzęta",
  description: "Poznaj mieszkańców mini zoo egZOOturystyka.",
};

export default function ZwierzetaPage() {
  return (
    <div className="section-y">
      <div className="container-site">
        <SectionHeading
          as="h1"
          title="Nasi podopieczni"
          description="Karakal, krokodyl i wiele innych. Każde spotkanie to opowieść o przyrodzie, a nie zwykły pokaz za szybą."
        />

        <div className="space-y-8">
          {animals.map((animal, index) => (
            <article
              key={animal.id}
              className="grid overflow-hidden rounded-xl bg-white md:grid-cols-2"
            >
              <div
                className={`relative min-h-[280px] bg-paper ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <Image
                  src={animal.illustration}
                  alt={animal.name}
                  fill
                  className="object-contain p-4"
                  sizes="50vw"
                />
              </div>
              <div className="flex flex-col justify-center p-8">
                <p className="text-sm italic text-gold">{animal.latin}</p>
                <h2 className="font-display text-2xl text-forest">{animal.name}</h2>
                <p className="mt-1 text-xs font-semibold text-ink-muted uppercase">
                  {animal.habitat}
                </p>
                <p className="mt-4 leading-relaxed text-ink-muted">{animal.description}</p>
                <div className="mt-4 rounded-lg bg-paper p-4 text-sm">
                  <span className="font-semibold text-forest">Ciekawostka: </span>
                  <span className="text-ink-muted">{animal.funFact}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/rezerwacja" className="btn-primary">
            Zarezerwuj spotkanie
          </Link>
        </div>
      </div>
    </div>
  );
}
