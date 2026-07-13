import type { Variants } from "framer-motion";

export type RevealVariant =
  | "rise"
  | "fade"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur-up"
  | "tilt-left"
  | "tilt-right"
  | "pop";

export const revealVariants: Record<RevealVariant, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 56 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 72 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -72 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.86 },
    visible: { opacity: 1, scale: 1 },
  },
  "blur-up": {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "tilt-left": {
    hidden: { opacity: 0, x: 56, rotate: -5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  "tilt-right": {
    hidden: { opacity: 0, x: -56, rotate: 5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.72 },
    visible: { opacity: 1, scale: 1 },
  },
};

export const reducedRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

/** Różne warianty per sekcja — żeby scroll nie był monotonny */
export const OFFER_VARIANTS: RevealVariant[] = ["tilt-right", "blur-up", "slide-left"];
export const ANIMAL_VARIANTS: RevealVariant[] = ["scale", "tilt-left", "tilt-right"];
export const FACT_VARIANTS: RevealVariant[] = ["pop", "tilt-left", "slide-right", "blur-up"];
export const TIP_VARIANTS: RevealVariant[] = ["rise", "slide-left", "slide-right", "pop", "tilt-right", "blur-up"];
export const TRUST_VARIANTS: RevealVariant[] = ["pop", "scale", "tilt-left", "tilt-right"];
