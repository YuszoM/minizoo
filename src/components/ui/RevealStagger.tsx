"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  reducedRevealVariants,
  revealVariants,
  staggerContainer,
  staggerItem,
  type RevealVariant,
} from "@/lib/motion/variants";
import { springPop, springSoft, tweenSmooth } from "@/lib/motion/transitions";

function transitionFor(variant: RevealVariant, reduce: boolean) {
  if (reduce) return { duration: 0.01 };
  if (variant === "pop" || variant === "scale") return springPop;
  if (variant === "tilt-left" || variant === "tilt-right") return springSoft;
  return tweenSmooth;
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
  const inView = useInView(ref, { once: true, amount: 0.12, margin: "0px 0px -5% 0px" });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={
        reduce
          ? { hidden: {}, visible: {} }
          : staggerContainer
      }
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
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
      variants={reduce ? reducedRevealVariants : revealVariants[variant] ?? staggerItem}
      transition={transitionFor(variant, !!reduce)}
    >
      {children}
    </motion.div>
  );
}
