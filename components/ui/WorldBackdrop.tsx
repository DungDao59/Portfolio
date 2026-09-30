"use client";
import { useEffect, useState } from "react";
import { scrollProgress } from "@/components/three/ScrollCamera";

// The backmost layer: base color + tech grid sitting UNDER the transparent 3D
// canvas (stars, monitor, zone props) and all content. Blends from cosmos-black
// into the display's color as you dive into the screen; the grid fades in with it.
const COSMOS = [10, 10, 11];
const INDIGO = [13, 11, 28]; // display's on-screen edge color (#0d0b1c)
const BLEND_END = 0.1; // finish fast, before the About zone

export function WorldBackdrop() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setT(Math.min(1, scrollProgress / BLEND_END));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const bg = `rgb(${lerp(COSMOS[0], INDIGO[0])}, ${lerp(COSMOS[1], INDIGO[1])}, ${lerp(COSMOS[2], INDIGO[2])})`;

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0" style={{ backgroundColor: bg }}>
      <div className="tech-grid absolute inset-0" style={{ opacity: t }} />
    </div>
  );
}
