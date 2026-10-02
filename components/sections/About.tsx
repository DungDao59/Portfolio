import Image from "next/image";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlapHeading } from "@/components/ui/FlapHeading";

const FACTS: { label: string; value: string }[] = [
  { label: "role", value: content.title },
  { label: "focus", value: "Backend & data flow" },
  { label: "location", value: content.location },
  { label: "education", value: "RMIT — Software Engineering" },
];

export function About() {
  const main = content.photo ?? content.aboutPhotos[0]?.src;
  const thumbs = content.aboutPhotos.slice(1); // all extra photos become polaroids

  return (
    <Section id="about">
      <FlapHeading text="ABOUT ME" className="mb-5" fontSize="clamp(20px, 3.4vw, 32px)" />
      <Reveal>
        {/* themed profile "window" — capped to the viewport so it always fits one screen */}
        <div className="mx-auto flex max-h-[74vh] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          {/* title bar */}
          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-2">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </span>
            <span className="font-mono text-xs text-muted">~/about/dung-dao — profile</span>
          </div>

          {/* body */}
          <div className="grid min-h-0 flex-1 gap-6 p-6 md:grid-cols-[35fr_65fr] md:gap-8">
            {/* left: portrait (flexes to fill) + facts */}
            <div className="flex min-h-0 flex-col">
              {main && (
                <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-lg ring-1 ring-accent/30">
                  <Image
                    src={main}
                    alt={content.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              )}
              <dl className="mt-4 shrink-0 space-y-2 font-mono text-sm">
                {FACTS.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <dt className="w-20 shrink-0 text-accent">{f.label}:</dt>
                    <dd className="text-fg/90">{f.value}</dd>
                  </div>
                ))}
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-accent">status:</dt>
                  <dd className="flex items-center gap-2 text-[#4ade80]">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#4ade80]" />
                    {content.status}
                  </dd>
                </div>
              </dl>
            </div>

            {/* right: whoami + bio + polaroids */}
            <div className="flex min-h-0 flex-col">
              <p className="mb-1 font-mono text-sm text-accent">$ whoami</p>
              <h2 className="font-display mb-3 text-3xl font-bold">{content.name}</h2>
              <p className="text-[15px] leading-relaxed text-muted">{content.about}</p>

              <div className="mt-auto shrink-0 border-t border-white/10 pt-4">
                <p className="mb-3 font-mono text-sm text-accent">$ outside_of_code</p>
                <div className="flex pl-2">
                  {thumbs.map((t, i) => (
                    <div
                      key={t.src}
                      style={{ transform: `rotate(${t.rotate}deg)` }}
                      className={`${i > 0 ? "-ml-6" : ""} shrink-0 rounded-[2px] bg-[#f4f1ea] p-1 pb-3 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:z-10 hover:rotate-0 hover:scale-110`}
                    >
                      <div className="relative h-16 w-24 overflow-hidden bg-black">
                        <Image src={t.src} alt="" fill sizes="96px" className="object-cover" />
                      </div>
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
