import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <div className="section-y">
      <div className="container-site mx-auto max-w-lg text-center">
        <div className="relative mx-auto mb-8 h-48 w-48">
          <Image
            src="/images/illustrations/mascot-lemur.jpg"
            alt="Lemur przewodnik egZOOturystyka"
            fill
            className="object-contain"
            sizes="192px"
          />
        </div>
        <p className="text-sm font-semibold text-gold">404</p>
        <h1 className="mt-2 font-display text-3xl text-forest">Zabłądziłeś w lesie?</h1>
        <p className="mt-4 text-ink-muted">
          Ta ścieżka nie prowadzi do żadnego ze zwierząt. Wróć na stronę główną lub zarezerwuj
          wizytę w {site.address.city}.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Strona główna
          </Link>
          <Link href="/rezerwacja" className="btn-gold">
            Rezerwuj termin
          </Link>
        </div>
      </div>
    </div>
  );
}
