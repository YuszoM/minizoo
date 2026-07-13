"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "rise" | "fade" | "slide-left" | "slide-right" | "scale";
type RevealPhase = "idle" | "pre" | "anim";

const variantClass: Record<RevealVariant, string> = {
  rise: "motion-rise",
  fade: "motion-fade",
  "slide-left": "motion-slide-left",
  "slide-right": "motion-slide-right",
  scale: "motion-scale",
};

const preClass: Record<RevealVariant, string> = {
  rise: "reveal-pre-rise",
  fade: "reveal-pre-fade",
  "slide-left": "reveal-pre-slide-left",
  "slide-right": "reveal-pre-slide-right",
  scale: "reveal-pre-scale",
};

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
  const [phase, setPhase] = useState<RevealPhase>("idle");

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("anim");
      return;
    }

    const activate = () => setPhase("anim");

    const inView =
      node.getBoundingClientRect().top < window.innerHeight * 0.92 &&
      node.getBoundingClientRect().bottom > 0;

    if (inView) {
      activate();
      return;
    }

    setPhase("pre");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        phase === "pre" && preClass[variant],
        phase === "anim" && variantClass[variant],
        phase === "anim" && delay > 0 && `motion-delay-${delay}`,
        className,
      )}
    >
      {children}
    </div>
  );
}
