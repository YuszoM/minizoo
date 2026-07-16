import type { Metadata } from "next";
import { VoucherForm } from "@/components/voucher/VoucherForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/utils";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Bon podarunkowy",
  description: `Kup bon podarunkowy egZOOturystyka od ${formatPrice(site.startingPrice)} — PDF z kodem, ważny 12 miesięcy.`,
};

export default function BonPage() {
  return (
    <div className="section-y">
      <div className="container-site max-w-2xl">
        <SectionHeading
          as="h1"
          title="Bon podarunkowy"
          description="Podaruj spotkanie ze zwierzętami. Odbiorca sam wybierze termin — Ty dostajesz kod i PDF do wręczenia."
          align="center"
          className="mx-auto"
        />
        <VoucherForm />
      </div>
    </div>
  );
}
