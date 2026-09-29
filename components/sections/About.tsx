import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <div className="aspect-square w-full rounded-[var(--radius)] bg-accent-soft ring-1 ring-accent/30" />
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <h2 className="font-display mb-6 text-4xl font-bold">About</h2>
            <p className="text-lg leading-relaxed text-muted">{content.about}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
