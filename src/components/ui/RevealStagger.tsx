"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  reducedRevealVariants,
  revealVariants,
  staggerContainer,
  type RevealVariant,
} from "@/lib/motion/variants";
import { springPop, springSoft, tweenSmooth } from "@/lib/motion/transitions";

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

export function RevealStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.06, margin: "0px 0px 0px 0px" });
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
      variants={reduce ? { hidden: {}, visible: {} } : staggerContainer}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={reduce ? reducedRevealVariants : revealVariants[variant]}
      transition={transitionFor(variant, !!reduce)}
    >
      {children}
    </motion.div>
  );
}
