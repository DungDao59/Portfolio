"use client";
import { useEffect, useState } from "react";
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
  const [shrink, setShrink] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setShrink(window.scrollY > 40);
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
    <nav
      className={`fixed left-0 top-0 z-40 flex w-full items-center justify-center gap-6 transition-all ${
        shrink ? "py-3 backdrop-blur-md" : "py-6"
      }`}
    >
      {SECTIONS.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => handleNavClick(e, id)}
          className={`text-sm uppercase tracking-widest transition-colors ${
            active === i ? "text-accent" : "text-muted hover:text-fg"
          }`}
        >
          {toLabel(id)}
        </a>
      ))}
    </nav>
  );
}
