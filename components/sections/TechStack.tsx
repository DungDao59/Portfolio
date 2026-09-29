import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function TechStack() {
  return (
    <Section id="tech">
      <div className="w-full text-center">
        <Reveal><h2 className="mb-10 text-4xl font-bold">Tech Stack</h2></Reveal>
        <div className="flex flex-wrap justify-center gap-3">
          {content.techStack.map((t, i) => (
            <Reveal key={t} delay={i * 0.05}>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-fg">
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
