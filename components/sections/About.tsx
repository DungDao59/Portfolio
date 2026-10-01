import Image from "next/image";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

function Polaroid({
  src,
  portrait,
  rotate,
  caption,
}: {
  src: string;
  portrait: boolean;
  rotate: number;
  caption: string;
}) {
  return (
    <figure
      className="group relative shrink-0 cursor-pointer rounded-[2px] bg-[#f4f1ea] p-2.5 pb-9 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out hover:z-20 hover:scale-105 hover:rotate-0"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className={`relative overflow-hidden bg-black ${
          portrait ? "aspect-[3/4] w-40 sm:w-44" : "aspect-[4/3] w-48 sm:w-56"
        }`}
      >
        <Image src={src} alt={caption || content.name} fill sizes="240px" className="object-cover" />
      </div>
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-1.5 text-center font-hand text-xl leading-none text-[#2b2b2b]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function About() {
  return (
    <Section id="about">
      <div className="flex flex-col items-center gap-12">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display mb-6 text-4xl font-bold">About</h2>
            <p className="text-lg leading-relaxed text-muted">{content.about}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {/* scattered polaroids across the full width */}
          <div className="flex flex-wrap items-center justify-center gap-y-8">
            {content.aboutPhotos.map((p, i) => (
              <div key={p.src} className={i > 0 ? "-ml-5 sm:-ml-7" : ""}>
                <Polaroid src={p.src} portrait={p.portrait} rotate={p.rotate} caption={p.caption} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
