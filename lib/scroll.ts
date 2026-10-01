// Dive progress: 0 at the top, 1 after one viewport-height of scroll.
// Drives the "zoom into the screen" + universe fade-out that happens over the hero.
export const getDive = () =>
  typeof window === "undefined"
    ? 0
    : Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
