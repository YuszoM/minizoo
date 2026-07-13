"use client";

import { Children, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springPop, springSoft } from "@/lib/motion/transitions";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 72 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
};

const card = {
  hidden: { opacity: 0, y: 48, scale: 0.92, rotate: 2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { ...springPop, delay: 0.55 },
  },
};

const mascot = {
  hidden: { opacity: 0, y: 40, rotate: -8, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { ...springPop, delay: 1 },
  },
};

export function HeroStaggerGroup({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      {Children.toArray(children).map((child, i) =>
        isValidElement(child) ? (
          <motion.div key={child.key ?? i} variants={item}>
            {child}
          </motion.div>
        ) : null,
      )}
    </motion.div>
  );
}

export function HeroBookingCard({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div variants={card} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}

export function HeroMascot({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      variants={mascot}
      initial="hidden"
      animate="visible"
      className="hero-float"
    >
      {children}
    </motion.div>
  );
}
