import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Regulamin",
};

export default function RegulaminPage() {
  return (
    <div className="section-y">
      <div className="container-site max-w-3xl">
        <SectionHeading
          title="Regulamin rezerwacji i wizyt"
          description="Wersja demonstracyjna — do weryfikacji prawnej przed uruchomieniem produkcyjnym."
        />
        <div className="space-y-6 text-sm leading-relaxed text-ink-muted">
          {[
            {
              t: "§1 Postanowienia ogólne",
              b: `Regulamin określa zasady rezerwacji spotkań organizowanych przez ${site.name}, ${site.address.full}.`,
            },
            {
              t: "§2 Rezerwacje online",
              b: "Rezerwacja następuje po wyborze pakietu, terminu i płatności online. Potwierdzenie wysyłane jest na e-mail.",
            },
            {
              t: "§3 Bezpieczeństwo",
              b: "Uczestnicy stosują się do poleceń opiekuna. Dzieci do 12 lat pod opieką osoby dorosłej.",
            },
            {
              t: "§4 Anulowanie",
              b: "Zmiana terminu do 48 h przed wizytą — bezpłatnie. Późniejsza rezygnacja — zwrot 50% wpłaty.",
            },
          ].map((s) => (
            <section key={s.t}>
              <h2 className="font-display text-xl text-forest">{s.t}</h2>
              <p className="mt-2">{s.b}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
