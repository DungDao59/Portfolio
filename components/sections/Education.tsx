import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlapHeading } from "@/components/ui/FlapHeading";

export function Education() {
  return (
    <Section id="education">
      <div className="w-full">
        <FlapHeading text="EDUCATION" className="mb-10" />
        <div className="grid gap-6 md:grid-cols-2">
          {content.education.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.1}>
              <div className="rounded-[var(--radius)] border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl font-semibold">{e.school}</h3>
                <p className="mt-1 text-accent">{e.credential}</p>
                <p className="mt-1 text-sm text-muted">{e.period}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
