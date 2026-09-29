"use client";
import { useSyncExternalStore } from "react";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RotatingText } from "@/components/ui/RotatingText";
import { introState } from "@/lib/introState";
import { lenisRef } from "@/providers/SmoothScroll";

function useIntroActive() {
  return useSyncExternalStore(
    introState.subscribe,
    () => introState.isActive(),
    () => true,
  );
}

// `immediate` bypasses intro gating and uses a centered layout (non-3D fallback).
export function Hero({ immediate = false }: { immediate?: boolean }) {
  const introActive = useIntroActive();
  const show = immediate || !introActive;

  const goContact = (e: React.MouseEvent) => {
    if (lenisRef) {
      e.preventDefault();
      lenisRef.scrollTo("#contact");
    }
  };

  const align = immediate ? "text-center" : "text-center md:text-left";
  const btnRow = immediate ? "justify-center" : "justify-center md:justify-start";

  const text = (
    <div className={`relative ${align}`}>
      {/* readability scrim local to the text column */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[160%] w-[150%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,11,0.6) 0%, rgba(10,10,11,0.3) 45%, transparent 72%)",
        }}
      />
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">{content.title}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="font-display text-5xl font-bold md:text-7xl" aria-label={content.name}>
          {content.name.split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="name-letter"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <div className={`mt-6 max-w-xl text-lg text-muted ${immediate ? "mx-auto" : "mx-auto md:mx-0"}`}>
          <RotatingText prefix="I build " items={content.roles} />
        </div>
      </Reveal>
      <Reveal delay={0.35}>
        <div className={`mt-8 flex flex-wrap gap-4 ${btnRow}`}>
          <a
            href={content.cv}
            download
            className="rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
          >
            Download CV
          </a>
          <a
            href="#contact"
            onClick={goContact}
            className="rounded-full border border-accent/40 px-6 py-3 font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Contact Info
          </a>
        </div>
      </Reveal>
    </div>
  );

  return (
    <Section id="hero">
      <div className={`transition-opacity duration-700 ${show ? "opacity-100" : "opacity-0"}`}>
        {immediate ? (
          text
        ) : (
          <div className="grid items-center gap-8 md:grid-cols-2">
            {text}
            {/* right column reserved; the 3D terminal renders behind on the right */}
            <div aria-hidden="true" className="hidden md:block" />
          </div>
        )}
      </div>
    </Section>
  );
}
