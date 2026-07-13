import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <div className="section-y">
      <div className="container-site max-w-3xl">
        <SectionHeading
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
