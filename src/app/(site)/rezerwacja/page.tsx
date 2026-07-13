import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Rezerwacja online",
  description:
    "Zarezerwuj spotkanie ze zwierzętami lub lekcję biologii. Wybierz termin i opłać wizytę online.",
};

export default function RezerwacjaPage() {
  return (
    <div className="section-y">
      <div className="container-site">
        <SectionHeading
          title="Zarezerwuj wizytę w mini zoo"
          description="Wybierz pakiet, termin i opłać spotkanie — cały proces zajmuje około 3 minut."
          align="center"
          className="mx-auto"
        />
        <BookingWizard />
      </div>
    </div>
  );
}
