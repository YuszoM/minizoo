"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Menu, X } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { cn, formatPrice } from "@/lib/utils";
import { Logo } from "./Logo";

const reserveLabel = `Rezerwuj · od ${formatPrice(site.startingPrice)}`;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-paper-deep bg-paper/98 shadow-[0_2px_16px_rgba(47,58,38,0.06)] backdrop-blur-md">
      <div className="container-site flex min-h-[76px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Główne">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
                  active
                    ? "bg-forest/10 text-forest font-semibold ring-1 ring-gold/40"
                    : "text-forest/90 hover:bg-paper-deep/80 hover:text-forest",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/rezerwacja" className="btn-gold hidden text-sm sm:inline-flex">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden md:inline">{reserveLabel}</span>
            <span className="md:hidden">Rezerwuj</span>
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper-deep bg-white text-forest shadow-sm lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-paper-deep bg-paper lg:hidden"
          >
            <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobilne">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-2 py-3 text-sm font-medium",
                      pathname === link.href
                        ? "bg-forest/10 font-semibold text-forest ring-1 ring-gold/40"
                        : "text-ink hover:text-forest",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/rezerwacja" className="btn-gold mt-2" onClick={() => setOpen(false)}>
                <CalendarDays className="h-4 w-4" />
                {reserveLabel}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
