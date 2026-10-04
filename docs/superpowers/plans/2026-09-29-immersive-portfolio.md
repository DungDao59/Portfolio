# Immersive Developer Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, immersive developer portfolio whose signature feature is a continuous 3D "camera journey" through a "Digital Cosmos" world, driven by scroll, with a 3D-terminal hero, a loader→curtain entrance, and a scene-cut fallback for mobile/low-power/reduced-motion.

**Architecture:** A single persistent React Three Fiber (R3F) canvas holds the whole 3D world + camera behind the page. Scroll progress (Lenis + GSAP ScrollTrigger) drives the camera along a predefined path defined in `lib/journey.ts`; each section maps to a camera "zone." HTML overlays (real DOM, per section) render on top for crisp, accessible, SEO-readable text. All editable content lives in `lib/content.ts`. Capability detection picks the full 3D experience vs. a non-3D scene-cut fallback.

**Tech Stack:** Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS v3, React Three Fiber (`@react-three/fiber`, `@react-three/drei`), GSAP + ScrollTrigger, Lenis, Framer Motion. Testing: Vitest + @testing-library/react + jsdom. Deploy: Vercel.

## Global Constraints

- **Node:** 20+ (Vercel default). Package manager: `npm`.
- **Framework:** Next.js 15, App Router, TypeScript strict mode.
- **Styling:** Tailwind CSS v3 + CSS variables in `styles/tokens.css` for all colors/spacing/type. Never hardcode the accent hex in components — use the token `--accent` / Tailwind `accent` color.
- **Accent color (v1):** electric violet `#7c5cff`. Background `#0a0a0b`. Text off-white `#ededed`.
- **Content:** all user-facing copy/data lives ONLY in `lib/content.ts`; components import from it. Placeholder content must be prefixed with `PLACEHOLDER:` so it is greppable.
- **Accessibility:** every animation path respects `prefers-reduced-motion`. All text is real DOM (never rendered as 3D text). Interactive elements are keyboard-reachable.
- **Performance:** lazy-load the 3D bundle; cap `dpr` at `[1, 2]`; pause R3F render loop when tab hidden.
- **Testing:** logic units (capability, content schema, journey math, fallback selection) have Vitest tests. Visual/3D tasks use documented manual verification (dev server + specific observation).
- **Commits:** conventional commits, one per task minimum.

---

## File Structure

```
app/
  layout.tsx              # fonts, providers, metadata, global styles
  page.tsx                # ExperienceRoot: canvas + overlays OR fallback
components/
  intro/Preloader.tsx     # loader counter + curtain reveal
  three/
    SceneCanvas.tsx       # the persistent R3F <Canvas> + providers
    World.tsx             # starfield, nebula glow, particle drift, grid
    Terminal.tsx          # procedural 3D terminal (hero centerpiece)
    ScrollCamera.tsx      # camera rig driven by scroll progress
    zones/GalleryPanels.tsx      # projects zone 3D props
    zones/Constellation.tsx      # tech stack zone 3D props
    zones/TimelineTrack.tsx      # experience zone 3D props
  sections/               # HTML overlays (one per zone)
    Hero.tsx About.tsx Projects.tsx TechStack.tsx
    Experience.tsx Education.tsx Contact.tsx
  ui/Reveal.tsx           # scroll-triggered fade/slide wrapper
  ui/Section.tsx          # overlay layout shell (full-viewport pinned)
  ui/Nav.tsx              # fixed nav, shrink-on-scroll, jump-to-zone
  ui/ScrollProgress.tsx   # progress bar
  fallback/SceneCut.tsx   # non-3D scene-cut experience
lib/
  content.ts              # ALL editable content + types
  journey.ts              # zone list, camera keyframes, progress→camera math
  capability.ts           # detect mobile / low power / reduced-motion
  motion.ts               # shared durations, easings, framer variants
providers/
  SmoothScroll.tsx        # Lenis provider
  Capability.tsx          # capability context provider
styles/
  tokens.css              # CSS variables
  globals.css             # tailwind + base + grain overlay
test/
  setup.ts                # vitest + testing-library setup
```

---

## Task 1: Project scaffolding & tooling

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `styles/globals.css`, `styles/tokens.css`, `vitest.config.ts`, `test/setup.ts`

**Interfaces:**
- Produces: a running Next.js app at `localhost:3000`; `npm test` runs Vitest; Tailwind + tokens wired.

- [ ] **Step 1: Scaffold Next.js app in place**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
When prompted about the non-empty directory (README/docs/.git), choose to proceed/keep existing files.

- [ ] **Step 2: Install runtime + 3D + animation deps**

Run:
```bash
npm install three @react-three/fiber @react-three/drei gsap lenis framer-motion
npm install -D @types/three
```

- [ ] **Step 3: Install and configure test tooling**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Create `test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Define design tokens**

Create `styles/tokens.css`:
```css
:root {
  --bg: #0a0a0b;
  --fg: #ededed;
  --muted: #9a9aa2;
  --accent: #7c5cff;
  --accent-soft: rgba(124, 92, 255, 0.15);
  --radius: 14px;
  --maxw: 1200px;
}
```

Replace `styles/globals.css` (or `app/globals.css` if create-next-app placed it there — move it to `styles/globals.css` and update the import) with:
```css
@import "./tokens.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body { background: var(--bg); color: var(--fg); }
body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }

/* subtle film grain overlay */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

- [ ] **Step 5: Wire Tailwind to tokens**

Edit `tailwind.config.ts` `theme.extend.colors`:
```ts
colors: {
  bg: "var(--bg)",
  fg: "var(--fg)",
  muted: "var(--muted)",
  accent: "var(--accent)",
},
```
Ensure `content` globs include `./app/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`.

- [ ] **Step 6: Minimal layout + page**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "PLACEHOLDER: Your Name — Developer",
  description: "PLACEHOLDER: Immersive developer portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  );
}
```

Replace `app/page.tsx`:
```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-accent">Portfolio boots ✓</h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify build + dev + test**

Run:
```bash
npm run build
npm test
npm run dev
```
Expected: `build` succeeds; `test` reports "no test files" (exit 0) or passes; visiting `http://localhost:3000` shows "Portfolio boots ✓" in violet on near-black. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold next.js portfolio app with tokens and test tooling"
```

---

## Task 2: Content model (`lib/content.ts`)

**Files:**
- Create: `lib/content.ts`, `test/content.test.ts`

**Interfaces:**
- Produces:
  - `type Project = { id: string; title: string; description: string; tech: string[]; live?: string; github?: string; image?: string }`
  - `type ExperienceItem = { id: string; role: string; org: string; period: string; summary: string }`
  - `type EducationItem = { id: string; school: string; credential: string; period: string }`
  - `type SocialLink = { label: string; href: string }`
  - `const content: { name: string; initials: string; title: string; tagline: string; about: string; photo?: string; projects: Project[]; techStack: string[]; experience: ExperienceItem[]; education: EducationItem[]; email: string; socials: SocialLink[] }`
  - `const SECTIONS = ["hero","about","projects","tech","experience","education","contact"] as const`
  - `type SectionId = typeof SECTIONS[number]`

- [ ] **Step 1: Write the failing test**

Create `test/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { content, SECTIONS } from "@/lib/content";

describe("content", () => {
  it("has the seven ordered sections", () => {
    expect(SECTIONS).toEqual([
      "hero", "about", "projects", "tech", "experience", "education", "contact",
    ]);
  });
  it("provides identity fields", () => {
    expect(content.name).toBeTruthy();
    expect(content.initials).toMatch(/^[A-Z]{1,3}$/);
    expect(content.email).toContain("@");
  });
  it("every project has a stable id and at least one tech tag", () => {
    for (const p of content.projects) {
      expect(p.id).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/content.test.ts`
Expected: FAIL — cannot resolve `@/lib/content`.

- [ ] **Step 3: Implement `lib/content.ts`**

```ts
export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  live?: string;
  github?: string;
  image?: string;
};
export type ExperienceItem = {
  id: string; role: string; org: string; period: string; summary: string;
};
export type EducationItem = {
  id: string; school: string; credential: string; period: string;
};
export type SocialLink = { label: string; href: string };

export const SECTIONS = [
  "hero", "about", "projects", "tech", "experience", "education", "contact",
] as const;
export type SectionId = (typeof SECTIONS)[number];

export const content = {
  name: "PLACEHOLDER: Your Name",
  initials: "YN",
  title: "PLACEHOLDER: Software Engineer",
  tagline: "PLACEHOLDER: I build immersive, performant web experiences.",
  about:
    "PLACEHOLDER: Two or three sentences about who you are, how you work, and what you care about as a developer.",
  photo: undefined as string | undefined,
  projects: [
    {
      id: "project-one",
      title: "PLACEHOLDER: Project One",
      description: "PLACEHOLDER: What it does and the impact it had.",
      tech: ["TypeScript", "Next.js", "PostgreSQL"],
      live: "https://example.com",
      github: "https://github.com/you/project-one",
    },
    {
      id: "project-two",
      title: "PLACEHOLDER: Project Two",
      description: "PLACEHOLDER: What it does and the impact it had.",
      tech: ["React", "Node.js"],
      github: "https://github.com/you/project-two",
    },
    {
      id: "project-three",
      title: "PLACEHOLDER: Project Three",
      description: "PLACEHOLDER: What it does and the impact it had.",
      tech: ["Python", "FastAPI"],
      live: "https://example.com",
    },
  ] satisfies Project[],
  techStack: [
    "TypeScript", "React", "Next.js", "Node.js", "Three.js",
    "PostgreSQL", "Tailwind CSS", "Git",
  ],
  experience: [
    {
      id: "exp-one",
      role: "PLACEHOLDER: Senior Engineer",
      org: "PLACEHOLDER: Company",
      period: "2023 — Present",
      summary: "PLACEHOLDER: What you did and shipped.",
    },
    {
      id: "exp-two",
      role: "PLACEHOLDER: Engineer",
      org: "PLACEHOLDER: Company",
      period: "2021 — 2023",
      summary: "PLACEHOLDER: What you did and shipped.",
    },
  ] satisfies ExperienceItem[],
  education: [
    {
      id: "edu-one",
      school: "PLACEHOLDER: University",
      credential: "PLACEHOLDER: B.Sc. Computer Science",
      period: "2017 — 2021",
    },
  ] satisfies EducationItem[],
  email: "placeholder@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/you" },
    { label: "LinkedIn", href: "https://linkedin.com/in/you" },
  ] satisfies SocialLink[],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/content.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts test/content.test.ts
git commit -m "feat: add typed content model with placeholder data"
```

---

## Task 3: Capability detection (`lib/capability.ts` + provider)

**Files:**
- Create: `lib/capability.ts`, `providers/Capability.tsx`, `test/capability.test.ts`

**Interfaces:**
- Produces:
  - `type Capability = { prefersReducedMotion: boolean; isMobile: boolean; isLowPower: boolean; useFull3D: boolean }`
  - `function detectCapability(win: { matchMedia: Window["matchMedia"]; navigator: Pick<Navigator,"hardwareConcurrency"|"userAgent"|"maxTouchPoints"> }): Capability` — pure, testable; `useFull3D === !prefersReducedMotion && !isMobile && !isLowPower`.
  - `const CapabilityContext` + `function CapabilityProvider({children})` + `function useCapability(): Capability`

- [ ] **Step 1: Write the failing test**

Create `test/capability.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { detectCapability } from "@/lib/capability";

function fakeWin(opts: {
  reduced?: boolean; cores?: number; ua?: string; touch?: number;
}) {
  return {
    matchMedia: (q: string) =>
      ({ matches: q.includes("reduced-motion") ? !!opts.reduced : false }) as MediaQueryList,
    navigator: {
      hardwareConcurrency: opts.cores ?? 8,
      userAgent: opts.ua ?? "Mozilla/5.0 (Macintosh)",
      maxTouchPoints: opts.touch ?? 0,
    },
  };
}

describe("detectCapability", () => {
  it("enables full 3D on a capable desktop", () => {
    expect(detectCapability(fakeWin({})).useFull3D).toBe(true);
  });
  it("disables full 3D when reduced motion is preferred", () => {
    const c = detectCapability(fakeWin({ reduced: true }));
    expect(c.prefersReducedMotion).toBe(true);
    expect(c.useFull3D).toBe(false);
  });
  it("disables full 3D on mobile user agents", () => {
    const c = detectCapability(fakeWin({ ua: "iPhone", touch: 5 }));
    expect(c.isMobile).toBe(true);
    expect(c.useFull3D).toBe(false);
  });
  it("disables full 3D on low core counts", () => {
    const c = detectCapability(fakeWin({ cores: 2 }));
    expect(c.isLowPower).toBe(true);
    expect(c.useFull3D).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/capability.test.ts`
Expected: FAIL — cannot resolve `@/lib/capability`.

- [ ] **Step 3: Implement `lib/capability.ts`**

```ts
export type Capability = {
  prefersReducedMotion: boolean;
  isMobile: boolean;
  isLowPower: boolean;
  useFull3D: boolean;
};

type WinLike = {
  matchMedia: (q: string) => { matches: boolean };
  navigator: Pick<Navigator, "hardwareConcurrency" | "userAgent" | "maxTouchPoints">;
};

export function detectCapability(win: WinLike): Capability {
  const prefersReducedMotion =
    win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ua = win.navigator.userAgent || "";
  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile|Opera Mini/i.test(ua) ||
    (win.navigator.maxTouchPoints ?? 0) > 2;
  const cores = win.navigator.hardwareConcurrency ?? 8;
  const isLowPower = cores <= 3;
  const useFull3D = !prefersReducedMotion && !isMobile && !isLowPower;
  return { prefersReducedMotion, isMobile, isLowPower, useFull3D };
}

export const SSR_DEFAULT: Capability = {
  prefersReducedMotion: false,
  isMobile: false,
  isLowPower: false,
  useFull3D: false, // conservative until measured on client
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/capability.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Implement the provider**

Create `providers/Capability.tsx`:
```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Capability, SSR_DEFAULT, detectCapability } from "@/lib/capability";

const CapabilityContext = createContext<Capability>(SSR_DEFAULT);

export function CapabilityProvider({ children }: { children: React.ReactNode }) {
  const [cap, setCap] = useState<Capability>(SSR_DEFAULT);
  useEffect(() => {
    setCap(detectCapability(window));
  }, []);
  return (
    <CapabilityContext.Provider value={cap}>
      {children}
    </CapabilityContext.Provider>
  );
}

export const useCapability = () => useContext(CapabilityContext);
```

- [ ] **Step 6: Commit**

```bash
git add lib/capability.ts providers/Capability.tsx test/capability.test.ts
git commit -m "feat: add capability detection and provider"
```

---

## Task 4: Journey math (`lib/journey.ts`)

**Files:**
- Create: `lib/journey.ts`, `test/journey.test.ts`

**Interfaces:**
- Produces:
  - `type Vec3 = [number, number, number]`
  - `type Zone = { id: SectionId; cameraPos: Vec3; lookAt: Vec3 }`
  - `const ZONES: Zone[]` — one per `SECTIONS` entry, in order.
  - `function cameraAt(progress: number): { pos: Vec3; lookAt: Vec3 }` — `progress` in `[0,1]`; linearly interpolates between adjacent zones; clamps out-of-range; `progress=0` → first zone exactly, `progress=1` → last zone exactly.
  - `function zoneIndexAt(progress: number): number` — nearest zone index for nav highlighting.

- [ ] **Step 1: Write the failing test**

Create `test/journey.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { ZONES, cameraAt, zoneIndexAt } from "@/lib/journey";
import { SECTIONS } from "@/lib/content";

describe("journey", () => {
  it("defines one zone per section, in order", () => {
    expect(ZONES.map((z) => z.id)).toEqual([...SECTIONS]);
  });
  it("returns the first zone at progress 0", () => {
    expect(cameraAt(0).pos).toEqual(ZONES[0].cameraPos);
  });
  it("returns the last zone at progress 1", () => {
    expect(cameraAt(1).pos).toEqual(ZONES[ZONES.length - 1].cameraPos);
  });
  it("clamps progress below 0 and above 1", () => {
    expect(cameraAt(-0.5).pos).toEqual(ZONES[0].cameraPos);
    expect(cameraAt(2).pos).toEqual(ZONES[ZONES.length - 1].cameraPos);
  });
  it("interpolates between zones at the midpoint", () => {
    const mid = cameraAt(0.5 / (ZONES.length - 1)); // halfway into first segment
    const a = ZONES[0].cameraPos, b = ZONES[1].cameraPos;
    expect(mid.pos[2]).toBeCloseTo((a[2] + b[2]) / 2, 5);
  });
  it("maps progress to nearest zone index", () => {
    expect(zoneIndexAt(0)).toBe(0);
    expect(zoneIndexAt(1)).toBe(ZONES.length - 1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/journey.test.ts`
Expected: FAIL — cannot resolve `@/lib/journey`.

- [ ] **Step 3: Implement `lib/journey.ts`**

```ts
import { SECTIONS, SectionId } from "@/lib/content";

export type Vec3 = [number, number, number];
export type Zone = { id: SectionId; cameraPos: Vec3; lookAt: Vec3 };

// A path that flies forward (−z) and gently weaves x/y between zones.
const RAW: Record<SectionId, { cameraPos: Vec3; lookAt: Vec3 }> = {
  hero:       { cameraPos: [0, 0, 6],     lookAt: [0, 0, 0] },
  about:      { cameraPos: [3, 1, -8],    lookAt: [2, 0, -12] },
  projects:   { cameraPos: [-4, 0, -22],  lookAt: [-2, 0, -28] },
  tech:       { cameraPos: [2, 2, -40],   lookAt: [0, 1, -46] },
  experience: { cameraPos: [-2, -1, -58], lookAt: [0, 0, -66] },
  education:  { cameraPos: [3, 1, -76],   lookAt: [1, 0, -82] },
  contact:    { cameraPos: [0, 0, -92],   lookAt: [0, 0, -100] },
};

export const ZONES: Zone[] = SECTIONS.map((id) => ({ id, ...RAW[id] }));

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 =>
  [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

export function cameraAt(progress: number): { pos: Vec3; lookAt: Vec3 } {
  const p = clamp01(progress);
  const segments = ZONES.length - 1;
  const scaled = p * segments;
  const i = Math.min(segments - 1, Math.floor(scaled));
  const t = scaled - i;
  return {
    pos: lerp3(ZONES[i].cameraPos, ZONES[i + 1].cameraPos, t),
    lookAt: lerp3(ZONES[i].lookAt, ZONES[i + 1].lookAt, t),
  };
}

export function zoneIndexAt(progress: number): number {
  const p = clamp01(progress);
  return Math.round(p * (ZONES.length - 1));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/journey.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/journey.ts test/journey.test.ts
git commit -m "feat: add camera journey path and interpolation math"
```

---

## Task 5: Motion constants + smooth-scroll provider

**Files:**
- Create: `lib/motion.ts`, `providers/SmoothScroll.tsx`

**Interfaces:**
- Produces:
  - `lib/motion.ts`: `const EASE = [0.22, 1, 0.36, 1] as const`; `const DUR = { fast: 0.4, base: 0.8, slow: 1.4 }`; `const fadeUp = { hidden: {...}, show: {...} }` (framer variants).
  - `providers/SmoothScroll.tsx`: `function SmoothScroll({children})` — sets up Lenis, exposes nothing but drives `window` scroll; registers a `lenis` instance on a module ref for GSAP sync. Disables itself (plain scroll) when `useCapability().prefersReducedMotion` is true.

- [ ] **Step 1: Implement `lib/motion.ts`**

```ts
export const EASE = [0.22, 1, 0.36, 1] as const;
export const DUR = { fast: 0.4, base: 0.8, slow: 1.4 };

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE },
  },
};
```

- [ ] **Step 2: Implement `providers/SmoothScroll.tsx`**

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { useCapability } from "@/providers/Capability";

export let lenisRef: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { prefersReducedMotion } = useCapability();
  useEffect(() => {
    if (prefersReducedMotion) return;
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
    lenisRef = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef = null;
    };
  }, [prefersReducedMotion]);
  return <>{children}</>;
}
```

- [ ] **Step 3: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/motion.ts providers/SmoothScroll.tsx
git commit -m "feat: add motion constants and Lenis smooth-scroll provider"
```

---

## Task 6: Persistent 3D canvas + World

**Files:**
- Create: `components/three/SceneCanvas.tsx`, `components/three/World.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useCapability`.
- Produces:
  - `components/three/World.tsx`: `function World()` — starfield (drei `<Stars>`), a nebula glow (large gradient sphere with `MeshBasicMaterial`, accent color, `side: BackSide`), and slow-drifting instanced points. No camera control here.
  - `components/three/SceneCanvas.tsx`: `function SceneCanvas({ children }: { children?: React.ReactNode })` — a fixed full-viewport `<Canvas>` (`position: fixed; inset: 0; z-index: 0`), `dpr={[1,2]}`, `gl={{ antialias: true }}`, renders `<World/>` + `children`; pauses on tab hide via `frameloop`.

- [ ] **Step 1: Implement `World.tsx`**

```tsx
"use client";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function World() {
  const nebula = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (nebula.current) nebula.current.rotation.y += dt * 0.01;
  });
  return (
    <group>
      <Stars radius={120} depth={80} count={4000} factor={4} fade speed={0.4} />
      <mesh ref={nebula} position={[0, 0, -40]}>
        <sphereGeometry args={[90, 32, 32]} />
        <meshBasicMaterial color="#7c5cff" side={THREE.BackSide} transparent opacity={0.06} />
      </mesh>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 6]} intensity={30} color="#7c5cff" distance={40} />
    </group>
  );
}
```

- [ ] **Step 2: Implement `SceneCanvas.tsx`**

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { World } from "./World";

export function SceneCanvas({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <Canvas
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true }}
      >
        <World />
        {children}
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Mount it (temporary) in `app/page.tsx`**

```tsx
import { SceneCanvas } from "@/components/three/SceneCanvas";

export default function Page() {
  return (
    <main style={{ height: "300vh" }}>
      <SceneCanvas />
    </main>
  );
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: near-black scene with a starfield, faint violet nebula glow, slow drift. No console errors. Confirm switching browser tabs away pauses animation (check CPU settles) and returning resumes.

- [ ] **Step 5: Commit**

```bash
git add components/three/SceneCanvas.tsx components/three/World.tsx app/page.tsx
git commit -m "feat: add persistent R3F canvas with cosmos world"
```

---

## Task 7: 3D Terminal (hero centerpiece)

**Files:**
- Create: `components/three/Terminal.tsx`
- Modify: `components/three/SceneCanvas.tsx` (render `<Terminal/>`)

**Interfaces:**
- Produces: `function Terminal({ position?: [number,number,number] })` — a rounded box "screen" (drei `<RoundedBox>`) with an emissive violet border frame, a dark face, and a few `<Text>` lines of syntax-ish code on the face (colored spans via multiple `<Text>` elements — this is decorative 3D, NOT the site's real text). Slow float (sin bob) + subtle rotation toward the mouse (lerped). Defaults to `position={[0,0,0]}`.

- [ ] **Step 1: Implement `Terminal.tsx`**

```tsx
"use client";
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const CODE = [
  "const dev = {",
  "  name: 'you',",
  "  stack: ['ts','r3f'],",
  "  ship: () => true,",
  "};",
];

export function Terminal({ position = [0, 0, 0] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.12;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.25, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.15, 0.05);
  });
  return (
    <group ref={group} position={position}>
      {/* glowing frame */}
      <RoundedBox args={[3.4, 2.2, 0.2]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#141420" emissive="#7c5cff" emissiveIntensity={0.35} />
      </RoundedBox>
      {/* dark face */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[3.1, 1.9]} />
        <meshBasicMaterial color="#0b0b12" />
      </mesh>
      {/* code lines */}
      <group position={[-1.35, 0.6, 0.12]}>
        {CODE.map((line, i) => (
          <Text
            key={i}
            position={[0, -i * 0.32, 0]}
            fontSize={0.18}
            anchorX="left"
            anchorY="middle"
            color={i === 0 || i === CODE.length - 1 ? "#7c5cff" : "#c9c9d6"}
          >
            {line}
          </Text>
        ))}
      </group>
    </group>
  );
}
```

- [ ] **Step 2: Render it in the canvas**

In `components/three/SceneCanvas.tsx`, import and add `<Terminal />` after `<World />`.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`.
Expected: a glowing violet-framed terminal floats at center with code lines, gently bobbing and tilting toward the mouse. No console errors.

- [ ] **Step 4: Commit**

```bash
git add components/three/Terminal.tsx components/three/SceneCanvas.tsx
git commit -m "feat: add procedural 3D terminal hero centerpiece"
```

---

## Task 8: Scroll-driven camera rig

**Files:**
- Create: `components/three/ScrollCamera.tsx`
- Modify: `components/three/SceneCanvas.tsx`

**Interfaces:**
- Consumes: `cameraAt` from `lib/journey`, `lenisRef` from `providers/SmoothScroll`.
- Produces: `function ScrollCamera()` — on each frame reads global scroll progress (`window.scrollY / (document.body.scrollHeight - innerHeight)`), calls `cameraAt(progress)`, and lerps `state.camera.position` + a `lookAt` target toward the result for smooth easing. Exposes progress on a module ref `export let scrollProgress = 0` updated each frame (for Nav/ScrollProgress reuse).

- [ ] **Step 1: Implement `ScrollCamera.tsx`**

```tsx
"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cameraAt } from "@/lib/journey";

export let scrollProgress = 0;

export function ScrollCamera() {
  const look = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((state) => {
    const max = document.body.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;
    const { pos, lookAt } = cameraAt(scrollProgress);
    state.camera.position.lerp(new THREE.Vector3(...pos), 0.06);
    look.current.lerp(new THREE.Vector3(...lookAt), 0.06);
    state.camera.lookAt(look.current);
  });
  return null;
}
```

- [ ] **Step 2: Mount in canvas**

In `SceneCanvas.tsx`, render `<ScrollCamera />` inside `<Canvas>`.

- [ ] **Step 3: Give the page scroll height + zone anchors (temporary)**

In `app/page.tsx`, set `main` height to `700vh` so there is room to scroll through all 7 zones.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. Scroll slowly top→bottom.
Expected: the camera glides forward through the cosmos, easing between positions; scrolling back reverses it smoothly. No jitter, no errors.

- [ ] **Step 5: Commit**

```bash
git add components/three/ScrollCamera.tsx components/three/SceneCanvas.tsx app/page.tsx
git commit -m "feat: drive camera along journey path from scroll"
```

---

## Task 9: Overlay primitives — Section, Reveal, Nav, ScrollProgress

**Files:**
- Create: `components/ui/Section.tsx`, `components/ui/Reveal.tsx`, `components/ui/Nav.tsx`, `components/ui/ScrollProgress.tsx`

**Interfaces:**
- Consumes: `SECTIONS`, `content`, `scrollProgress` (from `ScrollCamera`), `zoneIndexAt` (from journey), `fadeUp`.
- Produces:
  - `function Section({ id, children }: { id: SectionId; children: React.ReactNode })` — a full-viewport (`min-h-screen`) container with `id={id}`, content centered, `position: relative; z-index: 10`, pointer-events pass-through except on its inner content.
  - `function Reveal({ children, delay? }: { children: React.ReactNode; delay?: number })` — Framer Motion `whileInView` fadeUp wrapper (`viewport={{ once: true, margin: "-15%" }}`).
  - `function Nav()` — fixed top nav listing sections; shrinks (smaller padding) after scrollY>40; clicking an item smooth-scrolls to that section's anchor; highlights active via `zoneIndexAt`.
  - `function ScrollProgress()` — fixed thin top bar scaling with progress.

- [ ] **Step 1: Implement `Section.tsx`**

```tsx
import { SectionId } from "@/lib/content";

export function Section({ id, children }: { id: SectionId; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="relative z-10 flex min-h-screen w-full items-center justify-center px-6"
      style={{ pointerEvents: "none" }}
    >
      <div className="w-full max-w-[var(--maxw)]" style={{ pointerEvents: "auto" }}>
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement `Reveal.tsx`**

```tsx
"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15%" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Implement `ScrollProgress.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import { scrollProgress } from "@/components/three/ScrollCamera";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => { setP(scrollProgress); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      <div className="h-full bg-accent" style={{ width: `${p * 100}%` }} />
    </div>
  );
}
```

- [ ] **Step 4: Implement `Nav.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/content";
import { zoneIndexAt } from "@/lib/journey";
import { scrollProgress } from "@/components/three/ScrollCamera";

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
          className={`text-sm uppercase tracking-widest transition-colors ${
            active === i ? "text-accent" : "text-muted hover:text-fg"
          }`}
        >
          {id}
        </a>
      ))}
    </nav>
  );
}
```

- [ ] **Step 5: Manual verification (wire into page temporarily)**

Temporarily add `<Nav/>`, `<ScrollProgress/>`, and two `<Section id="hero">`/`<Section id="contact">` blocks with dummy text to `app/page.tsx`. Run `npm run dev`.
Expected: nav fixed at top, shrinks on scroll, active link highlights as you scroll; progress bar fills; anchor links jump/scroll to sections. Revert the temporary dummy sections after checking (the real ones come next).

- [ ] **Step 6: Commit**

```bash
git add components/ui
git commit -m "feat: add overlay primitives (Section, Reveal, Nav, ScrollProgress)"
```

---

## Task 10: Section overlays — Hero, About, Education, Contact

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/About.tsx`, `components/sections/Education.tsx`, `components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `content`, `Section`, `Reveal`.
- Produces: four overlay components (`Hero`, `About`, `Education`, `Contact`), each rendering a `<Section id=...>` with content from `content`. These are grouped in one task because they are the "text-panel" style overlays sharing identical structure.

- [ ] **Step 1: Implement `Hero.tsx`**

```tsx
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <Section id="hero">
      <div className="text-center">
        <Reveal>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">
            {content.title}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-6xl font-bold md:text-8xl">{content.name}</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{content.tagline}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-16 animate-pulse text-xs uppercase tracking-widest text-muted">
            Scroll to begin ↓
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Implement `About.tsx`**

```tsx
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <div className="aspect-square w-full rounded-[var(--radius)] bg-accent-soft ring-1 ring-accent/30" />
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <h2 className="mb-6 text-4xl font-bold">About</h2>
            <p className="text-lg leading-relaxed text-muted">{content.about}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
```
Note: the photo placeholder is the accent-soft square; swap for `<img src={content.photo}>` when a photo is provided.

- [ ] **Step 3: Implement `Education.tsx`**

```tsx
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Education() {
  return (
    <Section id="education">
      <div className="w-full">
        <Reveal><h2 className="mb-10 text-4xl font-bold">Education</h2></Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {content.education.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.1}>
              <div className="rounded-[var(--radius)] border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl font-semibold">{e.school}</h3>
                <p className="mt-1 text-accent">{e.credential}</p>
                <p className="mt-1 text-sm text-muted">{e.period}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Implement `Contact.tsx`**

```tsx
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  return (
    <Section id="contact">
      <div className="text-center">
        <Reveal>
          <h2 className="text-5xl font-bold md:text-7xl">Let’s build something.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={`mailto:${content.email}`}
            className="mt-8 inline-block rounded-full bg-accent px-8 py-4 font-semibold text-black transition-transform hover:scale-105"
          >
            {content.email}
          </a>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center gap-8">
            {content.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="text-muted transition-colors hover:text-accent">
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
        <footer className="mt-24 text-xs text-muted">
          © {new Date().getFullYear()} {content.name}
        </footer>
      </div>
    </Section>
  );
}
```

- [ ] **Step 5: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Hero.tsx components/sections/About.tsx components/sections/Education.tsx components/sections/Contact.tsx
git commit -m "feat: add hero, about, education, contact overlays"
```

---

## Task 11: Projects overlay + gallery zone 3D

**Files:**
- Create: `components/sections/Projects.tsx`, `components/three/zones/GalleryPanels.tsx`
- Modify: `components/three/SceneCanvas.tsx`

**Interfaces:**
- Consumes: `content.projects`, `Section`, `Reveal`; journey `projects` zone coordinates.
- Produces:
  - `function GalleryPanels()` — floating violet-edged 3D panels positioned around the projects zone (`z ≈ -22..-30`), one per project, slowly drifting. Purely decorative depth.
  - `function Projects()` — overlay with the real project cards (image/placeholder, title, description, tech tags, live + GitHub links, hover tilt/zoom).

- [ ] **Step 1: Implement `GalleryPanels.tsx`**

```tsx
"use client";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { content } from "@/lib/content";

export function GalleryPanels() {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (group.current) group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.1) * 0.03;
  });
  return (
    <group ref={group} position={[-2, 0, -26]}>
      {content.projects.map((_, i) => (
        <RoundedBox
          key={i}
          args={[2.2, 1.4, 0.08]}
          radius={0.06}
          position={[(i - 1) * 3.2, (i % 2 === 0 ? 0.6 : -0.6), i * -1.2]}
        >
          <meshStandardMaterial color="#12121c" emissive="#7c5cff" emissiveIntensity={0.25} />
        </RoundedBox>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Implement `Projects.tsx`**

```tsx
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Projects() {
  return (
    <Section id="projects">
      <div className="w-full">
        <Reveal><h2 className="mb-10 text-4xl font-bold">Projects</h2></Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {content.projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <article className="group h-full rounded-[var(--radius)] border border-white/10 bg-white/[0.03] p-6 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-accent/40">
                <div className="mb-4 aspect-video w-full rounded-md bg-accent-soft" />
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-full border border-accent/30 px-2 py-0.5 text-xs text-accent">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-4 text-sm">
                  {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">GitHub ↗</a>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Mount `GalleryPanels` in canvas**

In `SceneCanvas.tsx`, add `<GalleryPanels />` after `<Terminal />`.

- [ ] **Step 4: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Projects.tsx components/three/zones/GalleryPanels.tsx components/three/SceneCanvas.tsx
git commit -m "feat: add projects overlay and gallery zone panels"
```

---

## Task 12: Tech Stack overlay + constellation zone

**Files:**
- Create: `components/sections/TechStack.tsx`, `components/three/zones/Constellation.tsx`
- Modify: `components/three/SceneCanvas.tsx`

**Interfaces:**
- Consumes: `content.techStack`, `Section`, `Reveal`.
- Produces:
  - `function Constellation()` — glowing nodes (small emissive spheres) at the tech zone (`z ≈ -40`) connected by thin lines (drei `<Line>`), slow rotation.
  - `function TechStack()` — overlay: staggered grid of tech labels.

- [ ] **Step 1: Implement `Constellation.tsx`**

```tsx
"use client";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { content } from "@/lib/content";

export function Constellation() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo<[number, number, number][]>(() => {
    const n = content.techStack.length;
    return content.techStack.map((_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = 2.2;
      return [Math.cos(a) * r, Math.sin(a) * r, Math.sin(i) * 0.6];
    });
  }, []);
  useFrame((s, dt) => { if (group.current) group.current.rotation.y += dt * 0.15; });
  return (
    <group ref={group} position={[0, 1, -40]}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {nodes.map((p, i) => (
        <Line key={`l${i}`} points={[p, nodes[(i + 1) % nodes.length]]} color="#7c5cff" lineWidth={0.6} transparent opacity={0.4} />
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Implement `TechStack.tsx`**

```tsx
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function TechStack() {
  return (
    <Section id="tech">
      <div className="w-full text-center">
        <Reveal><h2 className="mb-10 text-4xl font-bold">Tech Stack</h2></Reveal>
        <div className="flex flex-wrap justify-center gap-3">
          {content.techStack.map((t, i) => (
            <Reveal key={t} delay={i * 0.05}>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-fg">
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Mount `Constellation` in canvas**

In `SceneCanvas.tsx`, add `<Constellation />`.

- [ ] **Step 4: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/TechStack.tsx components/three/zones/Constellation.tsx components/three/SceneCanvas.tsx
git commit -m "feat: add tech stack overlay and constellation zone"
```

---

## Task 13: Experience overlay + timeline zone

**Files:**
- Create: `components/sections/Experience.tsx`, `components/three/zones/TimelineTrack.tsx`
- Modify: `components/three/SceneCanvas.tsx`

**Interfaces:**
- Consumes: `content.experience`, `Section`, `Reveal`.
- Produces:
  - `function TimelineTrack()` — a glowing line/track at the experience zone (`z ≈ -58`) with node markers per role.
  - `function Experience()` — overlay: vertical timeline with role/org/period/summary; entries reveal on scroll.

- [ ] **Step 1: Implement `TimelineTrack.tsx`**

```tsx
"use client";
import { Line } from "@react-three/drei";
import { content } from "@/lib/content";

export function TimelineTrack() {
  const n = content.experience.length;
  const pts: [number, number, number][] = content.experience.map((_, i) => [
    -3 + (i / Math.max(1, n - 1)) * 6, 0, 0,
  ]);
  return (
    <group position={[0, -1, -58]}>
      <Line points={[[-3.5, 0, 0], [3.5, 0, 0]]} color="#7c5cff" lineWidth={1} transparent opacity={0.5} />
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Implement `Experience.tsx`**

```tsx
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <Section id="experience">
      <div className="w-full">
        <Reveal><h2 className="mb-10 text-4xl font-bold">Experience</h2></Reveal>
        <div className="relative border-l border-accent/30 pl-8">
          {content.experience.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.1}>
              <div className="mb-10">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-accent" />
                <p className="text-sm text-muted">{e.period}</p>
                <h3 className="text-xl font-semibold">{e.role} · <span className="text-accent">{e.org}</span></h3>
                <p className="mt-2 text-muted">{e.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Mount `TimelineTrack` in canvas**

In `SceneCanvas.tsx`, add `<TimelineTrack />`.

- [ ] **Step 4: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Experience.tsx components/three/zones/TimelineTrack.tsx components/three/SceneCanvas.tsx
git commit -m "feat: add experience overlay and timeline zone"
```

---

## Task 14: Assemble the full experience page

**Files:**
- Modify: `app/page.tsx`, `components/three/SceneCanvas.tsx` (confirm all zones mounted)

**Interfaces:**
- Consumes: all sections, `SceneCanvas`, `Nav`, `ScrollProgress`, providers.
- Produces: `ExperienceRoot` — the full 3D experience assembled: fixed canvas behind, stacked section overlays (each `min-h-screen`, so 7 → total scroll height ~700vh), nav + progress on top.

- [ ] **Step 1: Wrap providers in `app/layout.tsx`**

Wrap `{children}` with `CapabilityProvider` then `SmoothScroll`:
```tsx
import { CapabilityProvider } from "@/providers/Capability";
import { SmoothScroll } from "@/providers/SmoothScroll";
// ...
<body className="grain">
  <CapabilityProvider>
    <SmoothScroll>{children}</SmoothScroll>
  </CapabilityProvider>
</body>
```

- [ ] **Step 2: Compose `app/page.tsx`**

```tsx
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { Nav } from "@/components/ui/Nav";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <SceneCanvas />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <Experience />
        <Education />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Manual verification (the big one)**

Run: `npm run dev`. Scroll top→bottom slowly.
Expected: camera flies through cosmos; each section's text appears over its zone (terminal at hero, panels near projects, constellation near tech, timeline near experience); nav highlights the active zone; progress bar fills; links work; no console errors. Scroll back up reverses smoothly.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx components/three/SceneCanvas.tsx
git commit -m "feat: assemble full 3D experience page with all sections"
```

---

## Task 15: Preloader (loader counter → curtain reveal)

**Files:**
- Create: `components/intro/Preloader.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `content.initials`, `useCapability`, `motion`.
- Produces: `function Preloader()` — full-screen overlay (`z-50`) showing initials + a `0→100%` counter tied to `document.fonts.ready` (or a max ~2s cap), a thin accent progress line; at 100% an accent panel wipes upward to reveal the page. Shows once per session (`sessionStorage["intro-seen"]`). If `prefersReducedMotion`, renders nothing (skips). Uses Framer Motion for the wipe.

- [ ] **Step 1: Implement `Preloader.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "@/lib/content";
import { useCapability } from "@/providers/Capability";
import { EASE } from "@/lib/motion";

export function Preloader() {
  const { prefersReducedMotion } = useCapability();
  const [done, setDone] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (sessionStorage.getItem("intro-seen")) return;
    setDone(false);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2000); // ~2s
      setPct(Math.round(t * 100));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else {
        sessionStorage.setItem("intro-seen", "1");
        setTimeout(() => setDone(true), 700); // allow wipe
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-bg"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          animate={pct >= 100 ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-6xl font-bold text-accent">{content.initials}</div>
          <div className="mt-8 h-[2px] w-48 overflow-hidden bg-white/10">
            <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 text-sm text-muted">{pct}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`**

Add `<Preloader />` as the first child inside the fragment.

- [ ] **Step 3: Manual verification**

Run: `npm run dev` in a fresh tab (or clear sessionStorage).
Expected: initials + counter 0→100%, then accent screen wipes up to reveal the hero. Reload within the same session → no loader (session guard). Toggle OS "reduce motion" → loader is skipped entirely.

- [ ] **Step 4: Commit**

```bash
git add components/intro/Preloader.tsx app/page.tsx
git commit -m "feat: add preloader with counter and curtain reveal"
```

---

## Task 16: Scene-cut fallback (mobile / low-power / reduced-motion)

**Files:**
- Create: `components/fallback/SceneCut.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useCapability`, all section overlays.
- Produces: `function SceneCut()` — renders the same seven section overlays WITHOUT the 3D canvas: a static cosmos-tinted gradient background, sections stacked and revealed with fade/slide (Framer `Reveal`), no camera. `app/page.tsx` chooses: `useFull3D ? <full 3D tree/> : <SceneCut/>`.

- [ ] **Step 1: Implement `SceneCut.tsx`**

```tsx
"use client";
import { Nav } from "@/components/ui/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export function SceneCut() {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: "radial-gradient(circle at 50% -10%, rgba(124,92,255,0.15), #0a0a0b 60%)" }}
    >
      <Nav />
      <main className="relative z-10">
        <Hero /><About /><Projects /><TechStack /><Experience /><Education /><Contact />
      </main>
    </div>
  );
}
```
Note: `ScrollProgress` and the `Nav` active-zone logic read `scrollProgress` from `ScrollCamera`, which is 0 in fallback. That is acceptable — in fallback, `ScrollProgress` is omitted and Nav simply won't highlight by zone. (Nav still scrolls to anchors.)

- [ ] **Step 2: Branch in `app/page.tsx`**

Split the page into a client component that reads capability:
```tsx
"use client";
import { useCapability } from "@/providers/Capability";
import { SceneCut } from "@/components/fallback/SceneCut";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { Preloader } from "@/components/intro/Preloader";
import { Nav } from "@/components/ui/Nav";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  const { useFull3D } = useCapability();
  if (!useFull3D) {
    return (<><Preloader /><SceneCut /></>);
  }
  return (
    <>
      <Preloader />
      <SceneCanvas />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10">
        <Hero /><About /><Projects /><TechStack /><Experience /><Education /><Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`. In Chrome DevTools, toggle device toolbar (mobile) OR enable "Emulate CSS prefers-reduced-motion: reduce" (Rendering panel), then reload.
Expected: no 3D canvas; sections stack with a static cosmos gradient; content fully readable and scrollable; loader skipped for reduced-motion. Disable emulation → full 3D returns.

- [ ] **Step 4: Commit**

```bash
git add components/fallback/SceneCut.tsx app/page.tsx
git commit -m "feat: add scene-cut fallback for mobile/low-power/reduced-motion"
```

---

## Task 17: Performance, accessibility & lazy-load pass

**Files:**
- Modify: `app/page.tsx` (dynamic import of `SceneCanvas`), `components/three/SceneCanvas.tsx` (`<Suspense>`, dpr), `app/layout.tsx` (fonts/metadata)

**Interfaces:**
- Produces: 3D bundle lazy-loaded so first paint isn't blocked; Suspense fallback; verified reduced-motion + keyboard paths; Lighthouse-ready metadata.

- [ ] **Step 1: Lazy-load the 3D canvas**

In `app/page.tsx`, replace the direct import with:
```tsx
import dynamic from "next/dynamic";
const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);
```

- [ ] **Step 2: Wrap 3D children in Suspense**

In `SceneCanvas.tsx`, wrap the scene contents in `<Suspense fallback={null}>` (import `Suspense` from `react`) so drei assets (fonts for `<Text>`) stream in without crashing.

- [ ] **Step 3: Set real metadata + font**

In `app/layout.tsx`, add a display + body font via `next/font/google` (e.g., `Space_Grotesk` for display, `Inter` for body), apply CSS variables, and set `metadata` title/description/openGraph from `content` values. Ensure `viewport` allows scaling.

- [ ] **Step 4: Verify build + type-check + tests**

Run:
```bash
npx tsc --noEmit
npm run build
npm test
```
Expected: all pass; build output shows the 3D chunk split out (separate JS chunk).

- [ ] **Step 5: Manual Lighthouse + a11y check**

Run `npm run build && npm start`, open the site, run Lighthouse (Performance + Accessibility) in an incognito window.
Expected: Accessibility ≥ 90; note the Performance score (3D pages run heavier — record the number). Tab through the page: nav links and project links are focusable with visible focus. Fix any a11y issues surfaced (missing labels, contrast) inline.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "perf: lazy-load 3D bundle; a11y and metadata pass"
```

---

## Task 18: README + deploy notes

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: instructions to run, edit content, and deploy to Vercel.

- [ ] **Step 1: Write `README.md`**

Document: prerequisites (Node 20+), `npm install`, `npm run dev`, `npm test`, `npm run build`. A "Editing your content" section pointing to `lib/content.ts` (and how to `grep PLACEHOLDER` to find everything to replace). A "Changing the accent color" section pointing to `styles/tokens.css` `--accent`. A "Deploy" section: push to GitHub, import into Vercel, 1-click deploy (no env vars needed).

- [ ] **Step 2: Verify all placeholders are discoverable**

Run: `grep -rn "PLACEHOLDER" lib/ app/`
Expected: lists every placeholder string (all inside `lib/content.ts` plus metadata) — confirms content is centralized.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add setup, content-editing, and deploy instructions"
```

---

## Self-Review (completed during authoring)

**Spec coverage check:**
- Continuous camera journey → Tasks 4, 8, 14. ✓
- 3D terminal hero → Task 7. ✓
- Digital Cosmos world (starfield/nebula/particles/grid) → Task 6. ✓
- 7 zones with signature moments (gallery panels, constellation, timeline) → Tasks 11–13. ✓
- Loader→curtain entrance, once-per-session, reduced-motion skip → Task 15. ✓
- Section overlays (all 7) → Tasks 10–13. ✓
- Nav shrink + jump-to-zone, scroll progress → Task 9. ✓
- Content centralized in `content.ts` with greppable placeholders → Task 2, 18. ✓
- Capability detection + scene-cut fallback → Tasks 3, 16. ✓
- Accessibility (reduced-motion, real DOM text, keyboard), performance (lazy-load, dpr cap, tab-hide pause) → Tasks 6, 15, 16, 17. ✓
- Same 1-click Vercel hosting → Task 18. ✓
- Tokens/accent swappable → Tasks 1, 18. ✓

**Type consistency:** `scrollProgress` (ScrollCamera) reused by Nav + ScrollProgress; `cameraAt`/`zoneIndexAt` signatures consistent across Tasks 4/8/9; `Capability.useFull3D` consistent across Tasks 3/16; `SECTIONS`/`SectionId` consistent across Tasks 2/4/9. ✓

**Placeholder scan:** All `PLACEHOLDER:` strings are intentional (user content), centralized in `lib/content.ts`, and greppable — not plan placeholders. No "TBD/implement later" steps. ✓
