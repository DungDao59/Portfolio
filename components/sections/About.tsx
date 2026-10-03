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
        <div className="mx-auto w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          {/* title bar */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </span>
            <span className="font-mono text-xs text-muted">~/about/dung-dao — profile</span>
          </div>

          {/* body */}
          <div className="grid gap-8 p-7 md:grid-cols-[30fr_70fr] md:gap-10 md:p-8">
            {/* left: portrait (full photo, sized by height) + facts */}
            <div className="flex flex-col">
              {main && (
                <div
                  className="relative mx-auto aspect-square overflow-hidden rounded-full ring-1 ring-accent/30"
                  style={{
                    width: "clamp(200px, calc(100svh - 480px), 420px)",
                    maxWidth: "100%",
                  }}
                >
                  <Image
                    src={content.avatar}
                    alt={content.name}
                    fill
                    sizes="420px"
                    quality={90}
                    priority
                    className="object-cover"
                  />
                </div>
              )}
              <dl className="mt-5 shrink-0 space-y-2.5 font-mono text-sm">
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
              <p className="mb-2 font-mono text-sm text-accent">$ whoami</p>
              <h2 className="font-display mb-4 text-3xl font-bold md:text-4xl">{content.name}</h2>
              <p className="text-base leading-relaxed text-muted">{content.about}</p>

              <div className="mt-8 shrink-0 border-t border-white/10 pt-6">
                <p className="mb-4 font-mono text-sm text-accent">$ outside_of_code</p>
                <div className="flex">
                  {thumbs.map((t, i) => (
                    <div
                      key={t.src}
                      style={{
                        transform: `rotate(${t.rotate}deg)`,
                        marginLeft:
                          i === 0
                            ? undefined
                            : `calc((100% - ${thumbs.length} * 104px) / ${thumbs.length - 1})`,
                      }}
                      className="shrink-0 rounded-[2px] bg-[#f4f1ea] p-1 pb-3 shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:z-10 hover:rotate-0 hover:scale-110"
                    >
                      <div className="relative h-20 w-24 overflow-hidden bg-black">
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
