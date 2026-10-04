"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content, type ExperienceItem } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { FlapHeading } from "@/components/ui/FlapHeading";

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

// first "Mon YYYY" in the period → sortable number
function startKey(period: string): number {
  const m = period.match(/([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  if (!m) return 0;
  return Number(m[2]) * 12 + (MONTHS[m[1].toLowerCase()] ?? 0);
}

// short start label e.g. "May 2025"
function startLabel(period: string): string {
  const m = period.match(/([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  return m ? `${m[1]} ${m[2]}` : period;
}

function DetailCard({ e }: { e: ExperienceItem }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
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

      {e.summary && !(e.bullets && e.bullets.length > 0) && (
        <p className="mt-2.5 text-sm leading-snug text-muted">{e.summary}</p>
      )}

      {e.bullets && e.bullets.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {e.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm leading-snug text-fg/85">
              <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {e.tags && e.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
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
    </div>
  );
}

export function Experience() {
  // order the journey oldest → newest (left → right)
  const journey = useMemo(
    () => [...content.experience].sort((a, b) => startKey(a.period) - startKey(b.period)),
    [],
  );
  const n = journey.length;
  const [active, setActive] = useState(n - 1); // default: most recent / "now"

  const posOf = (i: number) => ((i + 0.5) / n) * 100;
  const first = posOf(0);
  const last = posOf(n - 1);

  return (
    <Section id="experience">
      <div className="w-full">
        <FlapHeading text="EXPERIENCE" className="mb-6" />

        {/* ---------- desktop: horizontal journey ---------- */}
        <div className="hidden md:block">
          {/* detail card for the active node */}
          <div className="min-h-[196px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={journey[active].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <DetailCard e={journey[active]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* the path + nodes */}
          <div className="relative mt-8 h-[120px]">
            {/* glowing line, draws on reveal */}
            <motion.span
              aria-hidden="true"
              className="absolute top-[9px] h-[2px] origin-left rounded-full bg-gradient-to-r from-accent/20 via-accent to-accent/20"
              style={{ left: `${first}%`, right: `${100 - last}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />

            {journey.map((e, i) => {
              const isActive = i === active;
              return (
                <button
                  key={e.id}
                  type="button"
                  className="absolute top-0 flex -translate-x-1/2 flex-col items-center text-center outline-none"
                  style={{ left: `${posOf(i)}%`, width: `${90 / n}%` }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={`${e.role} at ${e.org}`}
                >
                  {/* dot */}
                  <span className="relative flex h-[18px] w-[18px] items-center justify-center">
                    {isActive && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full ring-2 ring-bg transition-all duration-300 ${
                        isActive
                          ? "h-[18px] w-[18px] bg-accent shadow-[0_0_14px_rgba(124,92,255,0.95)]"
                          : "h-3 w-3 bg-accent/50"
                      }`}
                    />
                  </span>
                  {/* labels */}
                  <span
                    className={`mt-3 text-sm font-semibold leading-tight transition-colors duration-300 ${
                      isActive ? "text-fg" : "text-muted"
                    }`}
                  >
                    {e.role}
                  </span>
                  <span className="mt-0.5 text-xs text-muted">{startLabel(e.period)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- mobile: stacked cards ---------- */}
        <div className="flex flex-col gap-3 md:hidden">
          {journey
            .slice()
            .reverse()
            .map((e) => (
              <DetailCard key={e.id} e={e} />
            ))}
        </div>
      </div>
    </Section>
  );
}
