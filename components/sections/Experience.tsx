"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlapHeading } from "@/components/ui/FlapHeading";

export function Experience() {
  const items = content.experience;

  return (
    <Section id="experience">
      <div className="w-full">
        <FlapHeading text="EXPERIENCE" className="mb-4" />

        <div className="relative pl-10 md:pl-12">
          {/* animated spine — draws itself top→bottom when scrolled into view */}
          <motion.span
            aria-hidden="true"
            className="absolute left-[14px] top-1 bottom-1 w-[2px] origin-top rounded-full bg-gradient-to-b from-accent via-accent/60 to-accent/10 md:left-[18px]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />

          <div className="space-y-3">
            {items.map((e, i) => {
              const isPresent = /present/i.test(e.period);
              return (
                <Reveal key={e.id} delay={0.15 + i * 0.12}>
                  <div className="relative">
                    {/* node on the spine */}
                    <span className="absolute left-[-30px] top-3 z-10 flex h-3.5 w-3.5 -translate-x-1/2 md:left-[-30px]">
                      {isPresent && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                      )}
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_12px_rgba(124,92,255,0.9)] ring-2 ring-bg" />
                    </span>

                    {/* card */}
                    <article className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm transition-colors duration-300 hover:border-accent/40">
                      <div className="flex items-start gap-3">
                        {e.logo && (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                            <Image
                              src={e.logo}
                              alt={e.org}
                              width={28}
                              height={28}
                              className="h-full w-full object-contain"
                            />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <h3 className="text-base font-semibold leading-tight md:text-lg">
                              {e.role} <span className="text-muted">·</span>{" "}
                              <span className="text-accent">{e.org}</span>
                            </h3>
                            <span className="flex shrink-0 items-center gap-2">
                              {e.type && (
                                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-medium text-muted">
                                  {e.type}
                                </span>
                              )}
                              <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-[#d8ccff]">
                                {e.period}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {e.summary && !(e.bullets && e.bullets.length > 0) && (
                        <p className="mt-2.5 text-sm leading-snug text-muted">{e.summary}</p>
                      )}

                      {e.bullets && e.bullets.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {e.bullets.map((b) => (
                            <li key={b} className="flex gap-2 text-sm leading-snug text-fg/85">
                              <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {e.tags && e.tags.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {e.tags.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-white/15 bg-black/20 px-2 py-0.5 text-[11px] font-medium text-white/80"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
