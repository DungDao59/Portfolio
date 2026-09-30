"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "@/lib/content";
import { useCapability } from "@/providers/Capability";
import { introState } from "@/lib/introState";
import { EASE } from "@/lib/motion";

const DURATION = 2800; // ms — the "world building" build-up

type Star = { x: number; y: number; r: number; tw: number; appear: number };

// A world-building loader: a starfield + nebula assemble behind the handle and a
// 0→100% counter; at 100% the panel wipes up to reveal the ready hero.
export function Preloader() {
  const { useFull3D } = useCapability();
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const started = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (started.current) return;
    // The cinematic loader only runs for the full 3D experience.
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

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    const stars: Star[] = Array.from({ length: 260 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      tw: Math.random() * Math.PI * 2,
      appear: Math.random(),
    }));

    const draw = (p: number, now: number) => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d")!;
      const W = c.width;
      const H = c.height;
      ctx.clearRect(0, 0, W, H);
      // nebula glow grows with progress
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
      g.addColorStop(0, `rgba(124,92,255,${0.14 * p})`);
      g.addColorStop(0.5, `rgba(80,90,255,${0.05 * p})`);
      g.addColorStop(1, "rgba(8,8,13,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // stars fade in progressively as the world builds
      for (const s of stars) {
        if (s.appear > p) continue;
        const tw = 0.5 + 0.5 * Math.sin(now * 0.003 + s.tw);
        ctx.globalAlpha = tw * Math.min(1, (p - s.appear) * 4);
        ctx.fillStyle = "#dfe0ff";
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setPct(Math.round(p * 100));
      draw(p, now);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("intro-seen", "1");
        document.body.style.overflow = prevOverflow;
        introState.finish();
        setTimeout(() => setVisible(false), 750); // allow the wipe to play
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, [useFull3D]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[80] overflow-hidden bg-[#08080d]"
          initial={{ y: 0 }}
          animate={pct >= 100 ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="relative flex h-full flex-col items-center justify-center">
            <h2 className="hero-name font-mono text-5xl font-extrabold tracking-widest sm:text-6xl">
              {content.handle}
            </h2>
            <div className="mt-8 h-[2px] w-64 overflow-hidden bg-white/10">
              <div
                className="h-full bg-accent"
                style={{ width: `${pct}%`, boxShadow: "0 0 12px rgba(124,92,255,0.9)" }}
              />
            </div>
            <div className="mt-4 font-mono text-sm tracking-[0.5em] text-[#d8ccff]">
              {pct}%
            </div>
            <div className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.4em] text-muted/70">
              Loading world
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
