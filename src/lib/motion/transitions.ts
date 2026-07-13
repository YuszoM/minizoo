export const springSoft = {
  type: "spring" as const,
  stiffness: 220,
  damping: 26,
};

export const springPop = {
  type: "spring" as const,
  stiffness: 320,
  damping: 20,
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
};

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const tweenSmooth = {
  type: "tween" as const,
  duration: 0.75,
  ease: easeOutExpo,
};
