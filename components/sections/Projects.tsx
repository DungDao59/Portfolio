"use client";

import { content, type Project } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlapHeading } from "@/components/ui/FlapHeading";
import AccordionGallery, { type AccordionItem } from "@/components/ui/AccordionGallery";

type ProjectItem = AccordionItem & { project: Project };

const items: ProjectItem[] = content.projects.map((p) => ({
  image: p.image ?? "",
  label: p.name,
  alt: `${p.name} — ${p.tagline}`,
  project: p,
}));

// Default-expanded panel = NCT Hub (the flagship).
const defaultIndex = Math.max(
  0,
  content.projects.findIndex((p) => p.id === "nct-hub"),
);

function PanelContent({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-display text-2xl font-bold leading-tight text-white md:text-3xl">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-white/80">{project.tagline}</p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <li
            key={t}
            className="rounded-full border border-accent/50 bg-black/30 px-2 py-0.5 text-[11px] font-medium text-[#e9e2ff] backdrop-blur-sm"
          >
            {t}
          </li>
        ))}
      </ul>
      {(project.live || project.github) && (
        <div className="flex gap-3 text-sm font-semibold">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-accent px-3 py-1.5 text-white shadow-[0_0_18px_rgba(124,92,255,0.5)] transition hover:brightness-110"
            >
              Live ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/40 px-3 py-1.5 text-white transition hover:bg-white/15"
            >
              GitHub ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function Projects() {
  return (
    <Section id="projects">
      <div className="w-full">
        <FlapHeading text="PROJECTS" className="mb-8" />
        <Reveal>
          <AccordionGallery<ProjectItem>
            items={items}
            defaultIndex={defaultIndex}
            accentColor="#7c5cff"
            overlayColor="#0d0b1c"
            textColor="#ededed"
            height={380}
            gap={10}
            radius={16}
            expandRatio={0.6}
            trigger="hover"
            grayscale
            renderContent={(item) => <PanelContent project={item.project} />}
          />
        </Reveal>
      </div>
    </Section>
  );
}
