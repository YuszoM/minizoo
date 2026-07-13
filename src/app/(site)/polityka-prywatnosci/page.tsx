import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
};

export default function PolitykaPage() {
  return (
    <div className="section-y">
      <div className="container-site max-w-3xl">
        <SectionHeading
          title="Polityka prywatności"
          description="Szkielet dokumentu — do uzupełnienia przed wdrożeniem produkcyjnym."
        />
        <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
          <p>
            Administratorem danych jest {site.name}. Dane z formularza
            rezerwacji i kontaktu przetwarzamy w celu realizacji usługi i
            kontaktu zwrotnego.
          </p>
          <p>
            Przysługuje prawo dostępu, sprostowania, usunięcia danych oraz
            skarga do Prezesa UODO.
          </p>
        </div>
      </div>
    </div>
  );
}
