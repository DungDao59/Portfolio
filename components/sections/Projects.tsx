import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlapHeading } from "@/components/ui/FlapHeading";

export function Projects() {
  return (
    <Section id="projects">
      <div className="w-full">
        <FlapHeading text="PROJECTS" className="mb-10" />
        <div className="grid gap-8 md:grid-cols-3">
          {content.projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <article className="group h-full rounded-[var(--radius)] border border-white/10 bg-white/[0.03] p-6 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-accent/40">
                <div className="mb-4 aspect-video w-full rounded-md bg-accent-soft" />
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-full border border-accent/30 px-2 py-0.5 text-xs text-accent">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-4 text-sm">
                  {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">GitHub ↗</a>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
