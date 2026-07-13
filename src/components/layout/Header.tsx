"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import { navLinks } from "@/data/site";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-paper-deep/80 bg-paper/95 shadow-[0_4px_24px_rgba(47,58,38,0.06)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-site flex min-h-[76px] items-center justify-between gap-4">
        <Logo inverted={!scrolled} />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Główne">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
                scrolled
                  ? "text-ink-soft hover:text-forest"
                  : "text-white/90 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/rezerwacja"
            className={cn(
              "hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[transform,background-color] duration-200 active:scale-[0.98] sm:inline-flex",
              scrolled ? "btn-gold" : "bg-white text-forest hover:bg-paper",
            )}
          >
            <CalendarDays className="h-4 w-4" />
            Rezerwuj
          </Link>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
              scrolled
                ? "border border-paper-deep bg-white text-forest"
                : "bg-white/15 text-white backdrop-blur-sm",
            )}
            aria-expanded={open}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-paper-deep bg-paper transition-all lg:hidden",
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobilne">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-3 text-sm font-medium text-ink hover:text-forest"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/rezerwacja" className="btn-gold mt-2" onClick={() => setOpen(false)}>
            <CalendarDays className="h-4 w-4" />
            Rezerwuj wizytę
          </Link>
        </nav>
      </div>
    </header>
  );
}
