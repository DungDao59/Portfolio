export type Capability = {
  prefersReducedMotion: boolean;
  isMobile: boolean;
  isLowPower: boolean;
  useFull3D: boolean;
};

type WinLike = {
  matchMedia: (q: string) => { matches: boolean };
  navigator: Pick<Navigator, "hardwareConcurrency" | "userAgent" | "maxTouchPoints">;
};

export function detectCapability(win: WinLike): Capability {
  const prefersReducedMotion =
    win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ua = win.navigator.userAgent || "";
  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile|Opera Mini/i.test(ua) ||
    (win.navigator.maxTouchPoints ?? 0) > 2;
  const cores = win.navigator.hardwareConcurrency ?? 8;
  const isLowPower = cores <= 3;
  const useFull3D = !prefersReducedMotion && !isMobile && !isLowPower;
  return { prefersReducedMotion, isMobile, isLowPower, useFull3D };
}

export const SSR_DEFAULT: Capability = {
  prefersReducedMotion: false,
  isMobile: false,
  isLowPower: false,
  useFull3D: false, // conservative until measured on client
};
