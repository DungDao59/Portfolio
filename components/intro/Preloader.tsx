"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCapability } from "@/providers/Capability";
import { introState } from "@/lib/introState";
import { lenisRef } from "@/providers/SmoothScroll";

const DURATION = 3200; // ms

// Controls the cinematic intro timeline and renders a minimal corner HUD.
// The 3D fly-in (IntroSequence) reads introState.progress; this component drives it.
export function Preloader() {
  const { useFull3D } = useCapability();
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const started = useRef(false);
  const rafRef = useRef(0);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (started.current) return;
    // Only the full 3D experience plays the cinematic intro.
    if (!useFull3D) {
      introState.finish();
      return;
    }
    if (
      sessionStorage.getItem("intro-seen") ||
      new URLSearchParams(window.location.search).has("nointro")
    ) {
      introState.finish();
      return;
    }
    started.current = true;
    setVisible(true);
    introState.reset();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    lenisRef?.stop();

    const finish = () => {
      cancelAnimationFrame(rafRef.current);
      sessionStorage.setItem("intro-seen", "1");
      document.body.style.overflow = prevOverflow;
      lenisRef?.start();
      introState.finish();
      setVisible(false);
    };
    finishRef.current = finish;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      introState.setProgress(t);
      setPct(Math.round(t * 100));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else finish();
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = prevOverflow;
      lenisRef?.start();
    };
  }, [useFull3D]);

  const onSkip = useCallback(() => finishRef.current(), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80] flex items-end justify-between p-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-display text-sm tracking-[0.35em] text-muted">
            <span className="text-accent">{String(pct).padStart(3, "0")}</span>
            <span className="mx-1">/</span>100
          </div>
          <button
            onClick={onSkip}
            className="pointer-events-auto text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
          >
            Skip intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
