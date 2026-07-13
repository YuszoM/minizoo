"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "rise" | "fade" | "slide-left" | "slide-right" | "scale";

const variantClass: Record<RevealVariant, string> = {
  rise: "reveal-v-rise",
  fade: "reveal-v-fade",
  "slide-left": "reveal-v-slide-left",
  "slide-right": "reveal-v-slide-right",
  scale: "reveal-v-scale",
};

function isInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setArmed(true);
      setActive(true);
      return;
    }

    setArmed(true);

    let done = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let observer: IntersectionObserver | undefined;

    const activate = () => {
      if (done) return;
      done = true;
      observer?.disconnect();

      // Wymuszamy paint stanu ukrytego, dopiero potem animacja
      void node.offsetHeight;
      timer = setTimeout(() => setActive(true), 60);
    };

    const scheduleActivate = () => {
      if (done) return;
      timer = setTimeout(activate, 140 + delay * 110);
    };

    const onScroll = () => {
      if (!done && isInViewport(node)) scheduleActivate();
    };

    if (isInViewport(node)) {
      scheduleActivate();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) scheduleActivate();
        },
        { threshold: 0.15, rootMargin: "0px 0px 8% 0px" },
      );
      observer.observe(node);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("lenis:scroll", onScroll);

    return () => {
      observer?.disconnect();
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("lenis:scroll", onScroll);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-el",
        variantClass[variant],
        armed && !active && "reveal-el--hidden",
        armed && active && "reveal-el--active",
        className,
      )}
    >
      {children}
    </div>
  );
}
