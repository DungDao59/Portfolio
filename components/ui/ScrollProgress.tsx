"use client";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      <div className="h-full bg-accent" style={{ width: `${p * 100}%` }} />
    </div>
  );
}
