import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { offers } from "@/data/offers";

export const metadata: Metadata = {
  title: "Rezerwacja online",
  description:
    "Zarezerwuj spotkanie ze zwierzętami lub lekcję biologii. Wybierz termin — płatność na miejscu.",
};

export default async function RezerwacjaPage({
  searchParams,
}: {
  searchParams: Promise<{ pakiet?: string }>;
}) {
  const params = await searchParams;
  const pakiet = params.pakiet;
  const initialOfferId =
    pakiet && offers.some((o) => o.id === pakiet) ? pakiet : undefined;

  return (
    <div className="section-y">
      <div className="container-site">
        <SectionHeading
          as="h1"
          title="Zarezerwuj wizytę w mini zoo"
          description="Wybierz pakiet i termin — bilety dostaniesz mailem, płatność przy wejściu."
          align="center"
          className="mx-auto"
        />
        <BookingWizard initialOfferId={initialOfferId} />
      </div>
    </div>
  );
}
