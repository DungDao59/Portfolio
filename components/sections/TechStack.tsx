import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { FlapHeading } from "@/components/ui/FlapHeading";
import { TechConstellation } from "@/components/ui/TechConstellation";

export function TechStack() {
  return (
    <Section id="tech">
      <div className="w-full">
        <FlapHeading text="TECH STACK" className="mb-5 flex justify-center" />

        {/* legend: colour → category */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          {content.techGroups.map((g) => (
            <span key={g.id} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: g.hue, boxShadow: `0 0 10px ${g.hue}` }}
              />
              {g.label}
            </span>
          ))}
        </div>

        <TechConstellation />
      </div>
    </Section>
  );
}
