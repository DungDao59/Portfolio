"use client";
import { useEffect, useState } from "react";
import { getDive } from "@/lib/scroll";

// The page's base backdrop. Blends from cosmos-black (hero) into a subtle themed
// gradient (deep indigo + faint violet glow) as you dive into the screen. Sits
// behind everything; the 3D canvas (hero) fades out to reveal it for the content.
const COSMOS = [10, 10, 11];
const INDIGO = [13, 11, 28];

export function WorldBackdrop() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setT(Math.min(1, getDive() / 0.8));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const base = `rgb(${lerp(COSMOS[0], INDIGO[0])}, ${lerp(COSMOS[1], INDIGO[1])}, ${lerp(COSMOS[2], INDIGO[2])})`;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0"
      style={{
        background: `radial-gradient(1200px 820px at 50% 22%, rgba(124,92,255,${0.12 * t}) 0%, transparent 62%), ${base}`,
      }}
    />
  );
}
