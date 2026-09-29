"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "@/lib/content";
import { useCapability } from "@/providers/Capability";
import { EASE } from "@/lib/motion";

export function Preloader() {
  const { prefersReducedMotion } = useCapability();
  const [done, setDone] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (sessionStorage.getItem("intro-seen")) return;
    setDone(false);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2000); // ~2s
      setPct(Math.round(t * 100));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else {
        sessionStorage.setItem("intro-seen", "1");
        setTimeout(() => setDone(true), 700); // allow wipe
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-bg"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          animate={pct >= 100 ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-6xl font-bold text-accent">{content.initials}</div>
          <div className="mt-8 h-[2px] w-48 overflow-hidden bg-white/10">
            <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 text-sm text-muted">{pct}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
