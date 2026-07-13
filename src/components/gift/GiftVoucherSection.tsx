import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/utils";
import { site } from "@/data/site";

export function GiftVoucherSection() {
  return (
    <section className="section-y bg-paper-deep/40">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal variant="slide-left">
            <div className="relative overflow-hidden rounded-2xl shadow-[0_16px_48px_rgba(47,58,38,0.1)]">
              <Image
                src="/images/illustrations/gift-voucher.jpg"
                alt="Bon podarunkowy egZOOturystyka"
                width={2048}
                height={1152}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-display text-3xl text-forest md:text-4xl">
                  Bon podarunkowy
                </p>
                <p className="mt-2 max-w-sm text-sm text-ink-muted">
                  Podaruj spotkanie ze zwierzętami — idealny prezent dla rodziny z dziećmi.
                </p>
                <p className="mt-4 font-display text-2xl text-gold">
                  od {formatPrice(site.startingPrice)}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1} variant="slide-right">
            <SectionHeading
              className="mb-6"
              title="Prezent, który zostaje w pamięci"
              description="Voucher na kameralne spotkanie ze zwierzętami — bez kolejek, bez tłumów. Odbiorca sam wybiera termin."
            />
            <ul className="space-y-3 text-sm text-ink-soft">
              <li className="flex gap-2">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Ważny 12 miesięcy od zakupu
              </li>
              <li className="flex gap-2">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Wysyłamy PDF na e-mail — gotowy do wręczenia
              </li>
              <li className="flex gap-2">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Można dołączyć osobistą dedykację
              </li>
            </ul>
            <Link href="/rezerwacja?pakiet=voucher" className="btn-primary mt-8 inline-flex">
              Kup bon podarunkowy
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
