import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlapHeading } from "@/components/ui/FlapHeading";

export function Contact() {
  return (
    <Section id="contact">
      <div className="flex flex-col items-center text-center">
        <FlapHeading text="CONTACT" className="mb-8 flex justify-center" />
        <Reveal>
          <h2 className="font-display text-5xl font-bold md:text-7xl">Let's build something.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={`mailto:${content.email}`}
            className="mt-8 inline-block rounded-full bg-accent px-8 py-4 font-semibold text-white transition-transform hover:scale-105"
          >
            {content.email}
          </a>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center gap-8">
            {content.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="text-muted transition-colors hover:text-accent">
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
        <footer className="mt-24 text-xs text-muted">
          © {new Date().getFullYear()} {content.name}
        </footer>
      </div>
    </Section>
  );
}
