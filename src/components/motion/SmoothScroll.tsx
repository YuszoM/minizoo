"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const HEADER_OFFSET = 80;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    // Mobile: natywny scroll (Lenis psuje useInView)
    if (reduced || coarsePointer) return;

    // lerp ↑ = bliżej natywnego (szybki, płynny); niski lerp = „leniwy” gumowy scroll
    const lenis = new Lenis({
      lerp: 0.18,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.15,
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("lenis:scroll"));
    });

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const el = document.querySelector(hash);
      if (!el) return;

      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -HEADER_OFFSET, duration: 0.7 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return children;
}
