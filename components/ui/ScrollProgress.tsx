"use client";
import { useEffect, useState } from "react";
import { scrollProgress } from "@/components/three/ScrollCamera";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => { setP(scrollProgress); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      <div className="h-full bg-accent" style={{ width: `${p * 100}%` }} />
    </div>
  );
}
