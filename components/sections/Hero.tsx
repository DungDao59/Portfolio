"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { RotatingText } from "@/components/ui/RotatingText";
import { introState } from "@/lib/introState";
import { getDive } from "@/lib/scroll";

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
      setAway(getDive() > 0.2);
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
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const btnPrimary =
    "rounded-md bg-accent px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_24px_rgba(124,92,255,0.55)] transition hover:brightness-110";
  const btnSecondary =
    "rounded-md border-2 border-[#b9a6ff] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#e9e2ff] transition hover:bg-[#b9a6ff]/15";

  return (
    <Section id="hero">
      <div
        className={`transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {/* content styled to sit on the CRT screen — the highlight of the hero */}
        <div className="hero-crt relative mx-auto w-full max-w-[40rem] text-center font-mono">
          {/* subtle tech-grid decoration on the display (matches the world grid) */}
          <div
            aria-hidden="true"
            className="tech-grid hero-grid pointer-events-none absolute -inset-x-16 -inset-y-12"
          />
          <p className="relative mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-[#c8b8ff]">
            {content.title}
          </p>
          <h1 className="hero-name whitespace-nowrap text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            {content.heroName}
          </h1>
          <div className="mt-5 text-lg font-medium text-[#d8ccff] sm:text-xl">
            <RotatingText prefix="> I build " items={content.roles} />
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={content.cv} download className={btnPrimary}>
              Download CV
            </a>
            <a href="#contact" onClick={goContact} className={btnSecondary}>
              Contact Info
            </a>
          </div>
          <p
            className="blink mt-7 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#4ade80]"
            style={{ textShadow: "0 0 10px rgba(74,222,128,0.6)" }}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[#4ade80]" />
            {content.status}
          </p>
        </div>
      </div>
    </Section>
  );
}
