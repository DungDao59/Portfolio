import Image from "next/image";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const FACTS: { label: string; value: string }[] = [
  { label: "role", value: content.title },
  { label: "focus", value: "Backend & data flow" },
  { label: "location", value: content.location },
  { label: "education", value: "RMIT — Software Engineering" },
];

export function About() {
  const main = content.photo ?? content.aboutPhotos[0]?.src;
  const thumbs = content.aboutPhotos.slice(1, 4);

  return (
    <Section id="about">
      <Reveal>
        {/* themed profile "window" */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          {/* title bar */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </span>
            <span className="font-mono text-xs text-muted">~/about/dung-dao — profile</span>
          </div>

          {/* body */}
          <div className="grid gap-8 p-6 md:grid-cols-[300px_1fr] md:gap-10 md:p-10">
            {/* left: portrait + facts */}
            <div>
              {main && (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg ring-1 ring-accent/30">
                  <Image src={main} alt={content.name} fill sizes="300px" className="object-cover" />
                </div>
              )}
              <dl className="mt-6 space-y-2 font-mono text-sm">
                {FACTS.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <dt className="w-24 shrink-0 text-accent">{f.label}:</dt>
                    <dd className="text-fg/90">{f.value}</dd>
                  </div>
                ))}
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-accent">status:</dt>
                  <dd className="flex items-center gap-2 text-[#4ade80]">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#4ade80]" />
                    {content.status}
                  </dd>
                </div>
              </dl>
            </div>

            {/* right: whoami + bio + hobbies */}
            <div className="flex flex-col">
              <p className="mb-2 font-mono text-sm text-accent">$ whoami</p>
              <h2 className="font-display mb-5 text-3xl font-bold md:text-4xl">{content.name}</h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                {content.about}
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="mb-4 font-mono text-sm text-accent">$ outside_of_code</p>
                <div className="flex flex-wrap gap-4">
                  {thumbs.map((t) => (
                    <div
                      key={t.src}
                      className="relative h-24 w-32 overflow-hidden rounded-md ring-1 ring-white/10"
                    >
                      <Image src={t.src} alt="" fill sizes="128px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
