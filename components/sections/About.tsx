import Image from "next/image";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[var(--radius)] ring-1 ring-accent/30">
            {content.photo ? (
              <Image
                src={content.photo}
                alt={content.name}
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-accent-soft" />
            )}
          </div>
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
