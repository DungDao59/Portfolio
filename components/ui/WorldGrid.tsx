"use client";
import { useEffect, useState } from "react";
import { scrollProgress } from "@/components/three/ScrollCamera";

// The "inside the screen" world grid: fades in during the dive so the sections
// from About onward sit on a tech grid matching the monitor's display.
const FADE_END = 0.1; // finish quickly, before reaching the About zone

export function WorldGrid() {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setOpacity(Math.min(1, scrollProgress / FADE_END));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="tech-grid pointer-events-none fixed inset-0 z-[5]"
      style={{ opacity }}
    />
  );
}
