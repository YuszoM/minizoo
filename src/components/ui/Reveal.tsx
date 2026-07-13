"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  reducedRevealVariants,
  revealVariants,
  type RevealVariant,
} from "@/lib/motion/variants";
import { springPop, springSoft, tweenSmooth } from "@/lib/motion/transitions";

export type { RevealVariant };

function transitionFor(variant: RevealVariant, reduce: boolean) {
  if (reduce) return { duration: 0.01 };
  if (variant === "pop" || variant === "scale") return springPop;
  if (variant === "tilt-left" || variant === "tilt-right") return springSoft;
  return tweenSmooth;
}

function isNearViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.94 && rect.bottom > window.innerHeight * 0.04;
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
  const reduce = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    amount: 0.08,
    margin: "0px 0px 0px 0px",
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) {
      setVisible(true);
      return;
    }
    if (inView) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const check = () => {
      if (isNearViewport(node)) setVisible(true);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("lenis:scroll", check);
    window.addEventListener("resize", check, { passive: true });

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("lenis:scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [inView, reduce]);

  const show = reduce || visible || inView;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={reduce ? reducedRevealVariants : revealVariants[variant]}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      transition={{
        ...transitionFor(variant, !!reduce),
        delay: reduce ? 0 : delay * 0.11,
      }}
    >
      {children}
    </motion.div>
  );
}
