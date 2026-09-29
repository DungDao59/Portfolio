"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { RotatingText } from "@/components/ui/RotatingText";
import { introState } from "@/lib/introState";
import { lenisRef } from "@/providers/SmoothScroll";
import { scrollProgress } from "@/components/three/ScrollCamera";

function useIntroActive() {
  return useSyncExternalStore(
    introState.subscribe,
    () => introState.isActive(),
    () => true,
  );
}

// Hide the on-screen content once the dive into the CRT begins.
function useScrolledAway(enabled: boolean) {
  const [away, setAway] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const loop = () => {
      setAway(scrollProgress > 0.04);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);
  return away;
}

// `immediate` = non-3D fallback (no intro gating, no scroll dive).
export function Hero({ immediate = false }: { immediate?: boolean }) {
  const introActive = useIntroActive();
  const scrolledAway = useScrolledAway(!immediate);
  const visible = immediate || (!introActive && !scrolledAway);

  const goContact = (e: React.MouseEvent) => {
    if (lenisRef) {
      e.preventDefault();
      lenisRef.scrollTo("#contact");
    }
  };

  const btn =
    "w-56 rounded border border-accent/60 px-4 py-2 text-sm text-fg transition-colors hover:bg-accent hover:text-white";

  return (
    <Section id="hero">
      <div
        className={`transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {/* content styled to sit on the CRT screen */}
        <div className="hero-crt mx-auto w-full max-w-[26rem] text-center font-mono">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">{content.title}</p>
          <h1 className="text-2xl font-bold leading-tight text-fg sm:text-3xl md:text-4xl">
            {content.name}
          </h1>
          <div className="mt-3 text-sm text-accent">
            <RotatingText prefix="> I build " items={content.roles} />
          </div>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a href={content.cv} download className={btn}>
              [ Download CV ]
            </a>
            <a href="#contact" onClick={goContact} className={btn}>
              [ Contact Info ]
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
