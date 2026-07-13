import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { offers } from "@/data/offers";
import { formatPrice } from "@/lib/utils";

export function PricingTable() {
  return (
    <>
      {/* Mobile: karty zamiast tabeli — tabela z min-width rozpychała layout viewport */}
      <div className="space-y-4 md:hidden">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-xl border border-paper-deep bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-forest">{offer.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{offer.subtitle}</p>
              </div>
              <p className="font-display text-lg font-semibold whitespace-nowrap text-forest">
                {formatPrice(offer.price)}
              </p>
            </div>
            {offer.priceNote && (
              <p className="mt-1 text-xs text-ink-muted">{offer.priceNote}</p>
            )}
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
              <div className="flex gap-1.5">
                <dt className="text-ink-muted">Czas:</dt>
                <dd>{offer.duration}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-ink-muted">Grupa:</dt>
                <dd>{offer.groupSize}</dd>
              </div>
            </dl>
            <Link
              href={`/rezerwacja?pakiet=${offer.id}`}
              className="link-arrow mt-4 inline-flex py-1 text-sm"
            >
              Rezerwuj <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop: pełna tabela */}
      <div className="hidden overflow-x-auto rounded-xl border border-paper-deep bg-white md:block">
        <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">Cennik wizyt w mini zoo</caption>
        <thead>
          <tr className="border-b border-paper-deep bg-paper/60">
            <th scope="col" className="px-5 py-4 font-semibold text-forest">
              Pakiet
            </th>
            <th scope="col" className="px-5 py-4 font-semibold text-forest">
              Cena
            </th>
            <th scope="col" className="px-5 py-4 font-semibold text-forest">
              Czas
            </th>
            <th scope="col" className="px-5 py-4 font-semibold text-forest">
              Grupa
            </th>
            <th scope="col" className="px-5 py-4 font-semibold text-forest">
              <span className="sr-only">Rezerwacja</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="border-b border-paper-deep last:border-0">
              <td className="px-5 py-4">
                <p className="font-semibold text-forest">{offer.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{offer.subtitle}</p>
              </td>
              <td className="px-5 py-4 font-display text-lg font-semibold text-forest">
                {formatPrice(offer.price)}
                {offer.priceNote && (
                  <span className="block text-xs font-normal text-ink-muted">
                    {offer.priceNote}
                  </span>
                )}
              </td>
              <td className="px-5 py-4 text-ink-soft">{offer.duration}</td>
              <td className="px-5 py-4 text-ink-soft">{offer.groupSize}</td>
              <td className="px-5 py-4">
                <Link
                  href={`/rezerwacja?pakiet=${offer.id}`}
                  className="link-arrow whitespace-nowrap text-xs"
                >
                  Rezerwuj <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  );
}
