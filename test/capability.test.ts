import { describe, it, expect } from "vitest";
import { detectCapability } from "@/lib/capability";

function fakeWin(opts: {
  reduced?: boolean; cores?: number; ua?: string; touch?: number;
}) {
  return {
    matchMedia: (q: string) =>
      ({ matches: q.includes("reduced-motion") ? !!opts.reduced : false }) as MediaQueryList,
    navigator: {
      hardwareConcurrency: opts.cores ?? 8,
      userAgent: opts.ua ?? "Mozilla/5.0 (Macintosh)",
      maxTouchPoints: opts.touch ?? 0,
    },
  };
}

describe("detectCapability", () => {
  it("enables full 3D on a capable desktop", () => {
    expect(detectCapability(fakeWin({})).useFull3D).toBe(true);
  });
  it("disables full 3D when reduced motion is preferred", () => {
    const c = detectCapability(fakeWin({ reduced: true }));
    expect(c.prefersReducedMotion).toBe(true);
    expect(c.useFull3D).toBe(false);
  });
  it("disables full 3D on mobile user agents", () => {
    const c = detectCapability(fakeWin({ ua: "iPhone", touch: 5 }));
    expect(c.isMobile).toBe(true);
    expect(c.useFull3D).toBe(false);
  });
  it("disables full 3D on low core counts", () => {
    const c = detectCapability(fakeWin({ cores: 2 }));
    expect(c.isLowPower).toBe(true);
    expect(c.useFull3D).toBe(false);
  });
});
