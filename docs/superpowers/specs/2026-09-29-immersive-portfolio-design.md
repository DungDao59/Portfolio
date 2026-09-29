# Immersive Developer Portfolio — Design Spec

**Date:** 2026-09-29
**Status:** Approved (pending spec review)

## Overview

A single-page, immersive/cinematic personal portfolio for a software/web developer.
The site itself is a demonstration of front-end skill: scroll-driven storytelling,
parallax, subtle 3D accents, and a memorable "grand entrance." Dark theme with a
single electric-violet accent.

## Goals

- Impress visitors within the first 2–3 seconds (grand entrance / wow factor).
- Showcase projects, background, and skills in a cinematic, scroll-driven flow.
- Serve as living proof of the owner's front-end/animation ability.
- Stay performant and accessible (respects `prefers-reduced-motion`, mobile-friendly).

## Non-Goals (YAGNI)

- No CMS/backend. Content lives in a typed data file.
- No blog, no auth, no i18n for v1.
- No custom 3D model files for v1 (3D is code-generated/procedural).

## Tech Stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + a small design-token layer (CSS variables for color,
  spacing, type scale)
- **Animation:**
  - Framer Motion — component entrance/exit, hover, layout transitions
  - GSAP + ScrollTrigger — scroll-driven reveals, pinned sections, parallax
  - Lenis — smooth momentum scrolling
  - React Three Fiber (`@react-three/fiber`, `@react-three/drei`) — subtle 3D accents
- **Deploy target:** Vercel

## Architecture

- Single page composed of section components.
- All user content (bio, projects, tech, experience, education, contact) lives in a
  single typed `content.ts` file so real content can be pasted in one place without
  touching layout/animation code.
- Section components are self-contained: each owns its layout + its scroll animation,
  reads from `content.ts`, and can be understood/tested in isolation.
- Shared primitives: a `Reveal` wrapper (scroll-triggered fade/slide), a `Section`
  layout shell, animation config constants (durations, easings) in one place.
- Global providers: smooth-scroll (Lenis), reduced-motion context.

### Proposed file layout (indicative)

```
app/
  layout.tsx            # fonts, providers, global styles
  page.tsx              # assembles sections in order
components/
  intro/Preloader.tsx   # loader + curtain reveal
  sections/Hero.tsx
  sections/About.tsx
  sections/Projects.tsx
  sections/TechStack.tsx
  sections/Experience.tsx
  sections/Education.tsx
  sections/Contact.tsx
  three/HeroObject.tsx  # R3F procedural 3D accent
  ui/Reveal.tsx
  ui/Section.tsx
  ui/Nav.tsx
  ui/ScrollProgress.tsx
lib/
  content.ts            # ALL editable content
  motion.ts            # shared durations/easings/variants
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
- At 100%: accent-colored panel(s) wipe away to unveil the hero.
- Hero 3D object + staggered name reveal fire immediately after the curtain.
- **Behavior:** shows once per session (sessionStorage guard); auto-skips for
  `prefers-reduced-motion` (jumps straight to hero content).
- Target duration: ~2–2.5s.

## Sections & Signature Animations

1. **Hero** — full-screen. Staggered character reveal of name/title; floating
   procedural 3D object (accent-colored, reacts subtly to mouse); scroll cue.
2. **About** — text + photo; scroll reveal with parallax offset between text & image.
3. **Projects** — centerpiece. Pinned/horizontal card sequence; each project reveals
   image, description, tech tags, live + GitHub links; hover tilt/zoom.
4. **Tech Stack** — animated grid of tools/logos, staggered reveal on scroll.
5. **Experience** — vertical timeline; entries draw/reveal as they enter viewport.
6. **Education** — compact cards, same reveal language.
7. **Contact** — bold CTA, email + social links, subtle animated background; footer.

### Global UI

- Fixed nav that shrinks on scroll.
- Scroll-progress indicator.
- Global `prefers-reduced-motion` handling (disables heavy motion, keeps content).

## 3D Accent Details

- Code-generated (procedural) geometry via R3F/drei — no asset files for v1.
- Candidate forms: faceted crystal, distorted/animated sphere ("blob"), or wireframe
  torus, with accent glow. Final pick chosen during build; owner can swap later.
- Mouse-parallax / slow auto-rotation. Degrades gracefully (or hides) on small
  screens / low power.

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
- 3D form: chosen at build time.
- Owner name/initials, real project/bio/contact content: provided during build.
