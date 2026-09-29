import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <Section id="experience">
      <div className="w-full">
        <Reveal><h2 className="mb-10 text-4xl font-bold">Experience</h2></Reveal>
        <div className="relative border-l border-accent/30 pl-8">
          {content.experience.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.1}>
              <div className="mb-10">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-accent" />
                <p className="text-sm text-muted">{e.period}</p>
                <h3 className="text-xl font-semibold">{e.role} · <span className="text-accent">{e.org}</span></h3>
                <p className="mt-2 text-muted">{e.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
