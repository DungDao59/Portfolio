"use client";
import { useSyncExternalStore } from "react";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RotatingText } from "@/components/ui/RotatingText";
import { introState } from "@/lib/introState";

function useIntroActive() {
  return useSyncExternalStore(
    introState.subscribe,
    () => introState.isActive(),
    () => true, // server + first paint: treat intro as active (hero hidden)
  );
}

// `immediate` bypasses intro gating for the non-3D fallback path.
export function Hero({ immediate = false }: { immediate?: boolean }) {
  const introActive = useIntroActive();
  const show = immediate || !introActive;

  return (
    <Section id="hero">
      <div
        className={`relative text-center transition-opacity duration-700 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* readability scrim so text stays legible over the glowing terminal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,10,11,0.7) 0%, rgba(10,10,11,0.4) 42%, transparent 70%)",
          }}
        />
        <Reveal>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">{content.title}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-6xl font-bold md:text-8xl" aria-label={content.name}>
            {content.name.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="name-letter"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mx-auto mt-6 max-w-xl text-lg text-muted">
            <RotatingText prefix="I build " items={content.roles} />
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-16 animate-pulse text-xs uppercase tracking-widest text-muted">
            Scroll to begin ↓
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
