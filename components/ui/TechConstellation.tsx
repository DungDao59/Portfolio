"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { content, type Tech, type TechGroupId } from "@/lib/content";
import "./TechConstellation.css";

const hueOf = (g: TechGroupId) =>
  content.techGroups.find((grp) => grp.id === g)?.hue ?? "#ffffff";

// Connect each node to the next node of the SAME group (the array is pre-ordered
// so consecutive same-group entries are neighbours — forming a clean path).
function buildLines(techs: Tech[]) {
  const lines: { a: Tech; b: Tech; group: TechGroupId }[] = [];
  for (let i = 0; i < techs.length - 1; i++) {
    if (techs[i].group === techs[i + 1].group) {
      lines.push({ a: techs[i], b: techs[i + 1], group: techs[i].group });
    }
  }
  return lines;
}

export function TechConstellation() {
  const techs = content.techStack;
  const lines = useMemo(() => buildLines(techs), [techs]);
  const [active, setActive] = useState<number | null>(null);
  const activeGroup = active != null ? techs[active].group : null;

  return (
    <div className="tech-constellation-wrap">
      {/* desktop / tablet: the constellation */}
      <div className="tech-constellation" role="list" aria-label="Technologies">
        <svg
          className="tech-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {lines.map((ln, i) => {
            const on = activeGroup == null || activeGroup === ln.group;
            return (
              <line
                key={i}
                x1={ln.a.x}
                y1={ln.a.y}
                x2={ln.b.x}
                y2={ln.b.y}
                stroke={hueOf(ln.group)}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                style={{ opacity: on ? (activeGroup ? 0.6 : 0.22) : 0.05 }}
              />
            );
          })}
        </svg>

        {techs.map((t, i) => {
          const hue = hueOf(t.group);
          const isActive = active === i;
          const receded = active != null && !isActive;
          return (
            <div
              key={t.name}
              role="listitem"
              className={`tech-node${isActive ? " is-active" : ""}${receded ? " is-receded" : ""}`}
              style={
                {
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  "--hue": hue,
                  "--dur": `${5 + (i % 4)}s`,
                  "--delay": `${(i % 6) * -0.9}s`,
                } as React.CSSProperties
              }
              tabIndex={0}
              aria-label={t.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className="tech-node__float">
                <span className="tech-node__tile">
                  <Image
                    src={t.icon}
                    alt={t.name}
                    width={34}
                    height={34}
                    unoptimized
                    className="tech-node__img"
                  />
                </span>
              </span>
              <span className="tech-node__label">{t.name}</span>
            </div>
          );
        })}
      </div>

      {/* mobile: grouped chips fallback */}
      <div className="tech-groups-mobile">
        {content.techGroups.map((g) => (
          <div key={g.id} className="tech-group">
            <p className="tech-group__label" style={{ color: g.hue }}>
              {g.label}
            </p>
            <div className="tech-group__chips">
              {techs
                .filter((t) => t.group === g.id)
                .map((t) => (
                  <span
                    key={t.name}
                    className="tech-chip"
                    style={{ "--hue": g.hue } as React.CSSProperties}
                  >
                    <Image
                      src={t.icon}
                      alt=""
                      width={20}
                      height={20}
                      unoptimized
                      className="tech-chip__img"
                    />
                    {t.name}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
