export const EASE = [0.22, 1, 0.36, 1] as const;
export const DUR = { fast: 0.4, base: 0.8, slow: 1.4 };

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE },
  },
};
