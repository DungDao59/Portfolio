import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <Section id="hero">
      <div className="text-center">
        <Reveal>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">
            {content.title}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-6xl font-bold md:text-8xl">{content.name}</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{content.tagline}</p>
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
