"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getMapEmbedUrl, getMapLinkUrl, site } from "@/data/site";

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const mapSrc = getMapEmbedUrl();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="section-y">
      <div className="container-site">
        <SectionHeading
          title="Porozmawiajmy o Twojej wizycie"
          description="Pytania o ofertę szkolną, dojazd lub niestandardowy termin? Odpowiadamy tego samego dnia."
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {[
              { icon: MapPin, title: "Adres", value: site.address.full },
              {
                icon: Phone,
                title: "Telefon",
                value: site.phone,
                href: `tel:${site.phone.replace(/\s/g, "")}`,
              },
              {
                icon: Mail,
                title: "E-mail",
                value: site.email,
                href: `mailto:${site.email}`,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-5">
                <item.icon className="mb-2 h-5 w-5 text-gold" />
                <p className="font-semibold text-forest">{item.title}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm text-ink-muted hover:text-gold">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-ink-muted">{item.value}</p>
                )}
              </div>
            ))}
            <p className="text-sm text-ink-muted">{site.hours}</p>

            <div className="rounded-xl bg-forest p-6 text-paper">
              <p className="font-display text-lg text-gold-bright">Zaplanuj wizytę</p>
              <ul className="mt-4 space-y-3 text-sm text-paper/85">
                <li className="flex gap-3">
                  <Car className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    <strong className="text-paper">Samochodem:</strong> ok. 40 min z centrum
                    Wrocławia (A4 / kierunek Oleśnica, gmina Dobroszyce). Parking gratis na miejscu.
                  </span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    <strong className="text-paper">Pociągiem:</strong> do Wrocławia Głównego, potem
                    autobus lub krótki przejazd do Sadkowa (ok. 40 min łącznie).
                  </span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    <strong className="text-paper">Na miejscu:</strong> prosimy o przyjazd 10 min
                    przed rezerwacją — krótkie spotkanie z edukatorem.
                  </span>
                </li>
              </ul>
              <Link href="/rezerwacja" className="btn-gold mt-5 inline-flex text-sm">
                Rezerwuj termin online
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-white p-8 lg:col-span-3">
            {sent ? (
              <div className="py-8 text-center">
                <p className="font-display text-xl text-forest">Dziękujemy!</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Wiadomość została wysłana (demo). W produkcji trafi na {site.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Imię</span>
                    <input
                      required
                      className="w-full rounded-lg border border-paper-deep px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">E-mail</span>
                    <input
                      type="email"
                      required
                      className="w-full rounded-lg border border-paper-deep px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Temat</span>
                  <select className="w-full rounded-lg border border-paper-deep px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                    <option>Rezerwacja rodzinna</option>
                    <option>Wizyta szkolna</option>
                    <option>Urodziny</option>
                    <option>Inne</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Wiadomość</span>
                  <textarea
                    required
                    rows={5}
                    className="w-full resize-y rounded-lg border border-paper-deep px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </label>
                <button type="submit" className="btn-primary">
                  <Send className="h-4 w-4" />
                  Wyślij
                </button>
              </form>
            )}
          </div>
        </div>

        <section className="mt-12" aria-label="Mapa dojazdu">
          <h2 className="mb-4 font-display text-2xl text-forest">Jak do nas trafić</h2>
          <div className="overflow-hidden rounded-xl border border-paper-deep bg-white">
            <iframe
              title={`Mapa — ${site.address.full}`}
              src={mapSrc}
              className="h-[360px] w-full border-0 md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            <a
              href={getMapLinkUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              Otwórz w Google Maps
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
