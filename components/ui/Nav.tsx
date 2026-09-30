"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SECTIONS } from "@/lib/content";
import { zoneIndexAt } from "@/lib/journey";
import { scrollProgress } from "@/components/three/ScrollCamera";
import { lenisRef } from "@/providers/SmoothScroll";

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
    let raf = 0;
    const loop = () => {
      setActive(zoneIndexAt(scrollProgress));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    if (lenisRef) {
      e.preventDefault();
      lenisRef.scrollTo(`#${id}`);
    }
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
              className="relative shrink-0 rounded-full px-4 py-1.5"
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
                  isActive ? "font-semibold text-white" : "text-muted hover:text-fg"
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
