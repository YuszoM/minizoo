"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Car, Clock, Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { submitContactAction } from "@/app/actions/contact";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getMapEmbedUrl, getMapLinkUrl, site } from "@/data/site";

const inputClass =
  "w-full rounded-lg border border-paper-deep px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const mapSrc = getMapEmbedUrl();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitContactAction({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        subject: String(fd.get("subject") ?? ""),
        message: String(fd.get("message") ?? ""),
        website: String(fd.get("website") ?? ""),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  }

  return (
    <div className="section-y">
      <div className="container-site">
        <SectionHeading
          as="h1"
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
                  Wiadomość dotarła do nas. Odpowiemy na {site.email} lub telefon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  aria-hidden
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Imię</span>
                    <input name="name" required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">E-mail</span>
                    <input type="email" name="email" required className={inputClass} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Telefon (opcjonalnie)</span>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    maxLength={9}
                    pattern="[0-9]{9}"
                    className={inputClass}
                    placeholder="600000000"
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.value = t.value.replace(/\D/g, "").slice(0, 9);
                    }}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Temat</span>
                  <select name="subject" className={inputClass} defaultValue="Rezerwacja rodzinna">
                    <option>Rezerwacja rodzinna</option>
                    <option>Wizyta szkolna</option>
                    <option>Urodziny</option>
                    <option>Inne</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Wiadomość</span>
                  <textarea name="message" required rows={5} className={`${inputClass} resize-y`} />
                </label>
                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <button type="submit" className="btn-primary" disabled={pending}>
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Wysyłanie…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Wyślij
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <section className="mt-12" aria-label="Mapa dojazdu">
          <h2 className="mb-4 font-display text-2xl text-forest">Jak do nas trafić</h2>
          <div className="mb-6 overflow-hidden rounded-xl border border-paper-deep bg-paper">
            <Image
              src="/images/illustrations/map-route.jpg"
              alt="Ilustrowana mapa dojazdu z Wrocławia do Sadkowa"
              width={2048}
              height={1536}
              className="h-auto w-full"
              sizes="(max-width: 1180px) 100vw, 960px"
            />
          </div>
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
              className="text-link"
            >
              Otwórz w Google Maps
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
