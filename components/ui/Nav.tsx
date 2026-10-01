"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SECTIONS } from "@/lib/content";

const LABEL_MAP: Record<string, string> = {
  hero: "Home",
  about: "About",
  projects: "Projects",
  tech: "Tech",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
};

function toLabel(id: string): string {
  return LABEL_MAP[id] ?? id.charAt(0).toUpperCase() + id.slice(1);
}

export function Nav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = SECTIONS.indexOf(e.target.id as (typeof SECTIONS)[number]);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="fixed left-1/2 top-4 z-40 -translate-x-1/2">
      <div className="flex max-w-[95vw] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.06] px-2 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
        {SECTIONS.map((id, i) => {
          const isActive = active === i;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleNavClick(e, id)}
              className="group relative shrink-0 rounded-full px-4 py-1.5 transition-colors hover:bg-white/10"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-accent/25 ring-1 ring-accent/60"
                  style={{ boxShadow: "0 0 16px rgba(124,92,255,0.45)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className={`relative z-10 text-xs uppercase tracking-widest transition-colors ${
                  isActive ? "font-semibold text-white" : "text-muted group-hover:text-white"
                }`}
              >
                {toLabel(id)}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
