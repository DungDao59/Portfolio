"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { useCapability } from "@/providers/Capability";

export let lenisRef: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { prefersReducedMotion } = useCapability();
  useEffect(() => {
    if (prefersReducedMotion) return;
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
    lenisRef = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef = null;
    };
  }, [prefersReducedMotion]);
  return <>{children}</>;
}
