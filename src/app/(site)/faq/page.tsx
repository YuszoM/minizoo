import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Najczęstsze pytania o wizytę w mini zoo — rezerwacja, płatność, pogoda, wiek dzieci, dojazd. Sprawdź przed przyjazdem.",
};

export default function FaqPage() {
  return (
    <div className="section-y">
      <div className="container-site max-w-3xl">
        <SectionHeading
          as="h1"
          title="Najczęściej zadawane pytania"
          description="Nie znalazłeś odpowiedzi? Napisz — chętnie pomożemy."
          align="center"
          className="mx-auto"
        />
        <FaqAccordion />
      </div>
    </div>
  );
}
