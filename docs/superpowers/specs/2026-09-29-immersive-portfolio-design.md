# Immersive Developer Portfolio — Design Spec

**Date:** 2026-09-29
**Status:** Approved (pending spec review)

## Overview

A single-page, immersive/cinematic personal portfolio for a software/web developer.
The site itself is a demonstration of front-end skill. Its defining feature is a
**continuous 3D camera journey**: as the visitor scrolls, the camera flies through
one connected "Digital Cosmos" world, arriving at a distinct zone for each section —
like a movie moving from scene to scene. Dark theme with a single electric-violet
accent, a code-generated **3D terminal** as the hero centerpiece, and a memorable
"grand entrance."

## Goals

- Impress visitors within the first 2–3 seconds (grand entrance / wow factor).
- Deliver a movie-like, scroll-driven camera journey through a single 3D world.
- Showcase projects, background, and skills as scenes within that journey.
- Serve as living proof of the owner's front-end/animation ability.
- Stay performant and accessible (respects `prefers-reduced-motion`, mobile-friendly).

## Non-Goals (YAGNI)

- No CMS/backend. Content lives in a typed data file.
- No blog, no auth, no i18n for v1.
- No downloaded/custom 3D model files for v1 — all 3D (terminal, world, particles)
  is code-generated/procedural.

## Hosting note

The continuous 3D journey runs entirely client-side (Three.js in the browser). It
does **not** change deployment: still a standard 1-click Vercel deploy of a static
Next.js build — no extra server, config, or cost versus a "regular" site. The added
cost of option-2 is build effort and runtime performance tuning, not hosting.

## Tech Stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + a small design-token layer (CSS variables for color,
  spacing, type scale)
- **Animation:**
  - React Three Fiber (`@react-three/fiber`, `@react-three/drei`) — the core 3D
    world, terminal, particles, and camera
  - GSAP + ScrollTrigger — drives the camera along the scroll (maps scroll progress
    to the camera path / zone transitions); also 2D scroll reveals
  - Lenis — smooth momentum scrolling (the eased, cinematic feel)
  - Framer Motion — 2D/HTML overlay UI (nav, text, cards) entrance/hover transitions
- **Deploy target:** Vercel (standard 1-click; see Hosting note)

## Architecture

- A **single persistent 3D canvas** (R3F) sits fixed behind the page and holds the
  whole "Digital Cosmos" world + camera. It is NOT re-created per section.
- The page has a tall scroll container; scroll progress (via Lenis + GSAP
  ScrollTrigger) drives the **camera** along a predefined path through the world.
  Each section maps to a camera "zone" / keyframe range along that path.
- On top of the canvas, each section renders its **HTML overlay** (headings, text,
  project cards, links) positioned to appear when the camera reaches its zone. HTML
  overlays keep text crisp, accessible, and SEO-readable (real DOM, not 3D text).
- All user content (bio, projects, tech, experience, education, contact) lives in a
  single typed `content.ts` file so real content can be pasted in one place without
  touching layout/animation/3D code.
- Section overlays are self-contained: each owns its layout + reveal, reads from
  `content.ts`, and can be understood/tested in isolation.
- The camera path / zone definitions live in one place (`lib/journey.ts`) so scene
  order, distances, and easings are tunable without touching component code.
- Shared primitives: a `Reveal` wrapper (scroll-triggered fade/slide), a `Section`
  overlay shell, animation config constants (durations, easings) in one place.
- Global providers: smooth-scroll (Lenis), reduced-motion + capability context
  (detects mobile / low power / reduced-motion to pick full-3D vs. fallback).

### Proposed file layout (indicative)

```
app/
  layout.tsx            # fonts, providers, global styles
  page.tsx              # persistent 3D canvas + stacked section overlays
components/
  intro/Preloader.tsx   # loader + curtain reveal
  three/
    Experience.tsx      # the persistent R3F canvas + scene graph
    World.tsx           # cosmos: starfield, nebula, particles, grid
    Terminal.tsx        # procedural 3D terminal (hero centerpiece)
    ScrollCamera.tsx    # camera rig driven by scroll progress
    zones/              # per-zone 3D props (gallery panels, constellation, timeline)
  sections/             # HTML overlays, one per zone
    Hero.tsx  About.tsx  Projects.tsx  TechStack.tsx
    Experience.tsx  Education.tsx  Contact.tsx
  ui/Reveal.tsx  ui/Section.tsx  ui/Nav.tsx  ui/ScrollProgress.tsx
  fallback/SceneCut.tsx # non-3D scene-cut experience for mobile/low-power/RM
lib/
  content.ts            # ALL editable content
  journey.ts            # camera path + zone keyframes/easings
  motion.ts             # shared durations/easings/variants
  capability.ts         # detect mobile / low power / reduced-motion
  smooth-scroll.tsx     # Lenis provider
styles/
  tokens.css            # CSS variables (colors, spacing, type)
```

## Visual Direction

- **Background:** near-black `#0a0a0b`
- **Text:** off-white
- **Accent:** electric violet `~#7c5cff` (single accent; easily swappable via token)
- **Type:** strong display font for headings (large, cinematic) + clean sans body
- **Texture:** subtle grain/noise overlay; soft accent-colored glows behind key
  elements for depth

## Grand Entrance (Preloader → Curtain Reveal)

- Dark screen; owner initials centered; a real `0 → 100%` counter tied to
  font/asset loading; thin accent progress line.
- At 100%: accent-colored panel(s) wipe away to unveil the hero zone of the cosmos.
- The 3D terminal + staggered name reveal fire immediately after the curtain, with
  the camera settled at its opening position.
- **Behavior:** shows once per session (sessionStorage guard); auto-skips for
  `prefers-reduced-motion` (jumps straight to hero content).
- Target duration: ~2–2.5s.

## The Camera Journey — Zones & Signature Moments

One continuous camera flythrough of the "Digital Cosmos." Each section is a **zone**
the camera arrives at, in order. Movement eases between zones (never jerky), with
depth-of-field haze and drifting violet particles throughout for a filmic feel.

1. **Hero** — Camera opens on the floating **3D terminal** glowing with code,
   suspended in the violet cosmos. Staggered name/title reveal; scroll cue.
2. **→ About** — Camera pushes past the terminal through a soft particle drift;
   arrives at a calm zone where photo + bio panel float in, parallaxing on the stars.
3. **→ Projects** — Camera banks into a "gallery corridor": project cards are large
   floating panels the camera glides past one by one (image, tags, live + GitHub
   links; hover tilt/zoom on the overlay).
4. **→ Tech Stack** — Camera enters a slowly rotating **constellation** of glowing
   tech-logo nodes connected by lines.
5. **→ Experience** — Camera travels along a glowing **timeline track**; each role
   lights up as it is passed.
6. **→ Education** — A tighter cluster of cards in the same visual language.
7. **→ Contact** — Camera pulls back to a wide, calm cosmos vista; bold CTA + email
   and social links settle center. End of journey. Footer.

### Global UI

- Fixed nav that shrinks on scroll; clicking a nav item scrolls (flies) to that zone.
- Scroll-progress indicator (doubles as journey progress).
- Global `prefers-reduced-motion` handling (disables heavy motion, keeps content).

## 3D World & Terminal

- Everything is **code-generated (procedural)** via R3F/drei — no downloaded assets
  for v1.
- **Terminal:** a 3D panel (rounded box + emissive violet border) with animated
  syntax-highlighted code lines on its face; slow float + subtle mouse parallax.
- **World:** instanced starfield/particles, soft nebula glow (shader/gradient),
  faint grid + data-stream lines; depth-of-field for cinematic focus.
- **Zone props:** gallery panels, constellation nodes+lines, timeline track — all
  simple procedural geometry, reused/instanced for performance.

## Performance & Fallback (option-2 specific)

- Detect capability at load (`lib/capability.ts`): mobile, low power/GPU, or
  `prefers-reduced-motion`.
- **Full experience** (capable desktop): the continuous 3D camera journey.
- **Fallback** (mobile / low-power / reduced-motion): the non-3D **scene-cut**
  experience — same content and zone order, sections cut/fade between full-screen
  scenes instead of flying the camera. Keeps it fast and accessible everywhere.
- Lazy-load the 3D bundle; cap pixel ratio & particle counts; pause rendering when
  the tab is hidden.

## Content Strategy

- Owner will paste content per section during the build ("as we go").
- Until provided, sections use tasteful placeholder copy/images clearly marked so
  they are easy to find and replace in `content.ts`.

## Accessibility & Performance

- Respect `prefers-reduced-motion` everywhere (entrance, scroll effects, 3D).
- Mobile responsive; heavy effects/3D degrade gracefully on small screens.
- Lighthouse pass targeted for performance & accessibility.
- Lazy-load 3D and below-the-fold assets.

## Testing & Quality

- Component-level checks for each section.
- Reduced-motion path verified (entrance skips, animations off).
- Responsive/mobile verification.
- Lighthouse audit before considering done.

## Open Items (resolved defaults; owner may override later)

- Accent color: electric violet for v1.
- Hero 3D object: **3D terminal / code editor** (confirmed).
- Section transitions: **continuous 3D camera journey** through "Digital Cosmos"
  (confirmed), with scene-cut fallback on mobile/low-power/reduced-motion.
- Owner name/initials, real project/bio/contact content: provided during build.
