import Link from "next/link";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { footerLinks, navLinks, site } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-forest text-paper">
      <div className="container-site section-y grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-paper/75">
            Kameralne mini zoo — spotkania ze zwierzętami w małych grupach oraz
            edukacyjne lekcje biologii dla szkół pod Warszawą.
          </p>
          <Link href="/rezerwacja" className="btn-gold inline-flex text-sm">
            <CalendarDays className="h-4 w-4" />
            Rezerwacja online
          </Link>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold text-gold-bright">Menu</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-paper/80">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold text-gold-bright">Kontakt</p>
          <ul className="space-y-3 text-sm text-paper/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {site.address.full}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-paper/55">{site.hours}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <div className="flex gap-4">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-paper/80">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
