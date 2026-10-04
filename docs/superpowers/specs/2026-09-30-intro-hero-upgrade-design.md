# Intro + Hero Upgrade — Design Spec

**Date:** 2026-09-30
**Status:** Approved (implementing with placeholders)

## Goal
Replace the basic preloader (initials + flat counter + curtain wipe) and the plain
staggered-text hero with a high-wow **3D particle-convergence intro** and an
**alive hero** (live-typing terminal, animated gradient name, rotating role line).

## Intro — "Particle Convergence Fly-In"
- Opens on near-black deep space; a cloud of scattered violet particles drifts far
  from the camera.
- Camera flies inward from deep space while a real load counter runs (tied to
  font/asset readiness). The counter is subtle (small, corner) so the 3D leads.
- Near 100%, scattered particles swirl and converge into the 3D terminal's form;
  the terminal "powers on" (screen glow + emissive border light up).
- Camera settles into hero framing; forming particles dissolve into the ambient
  cosmos drift. Control then hands over to the scroll-driven camera.
- Once per session (sessionStorage). `prefers-reduced-motion` / mobile → skip the
  fly-in and particle intro, go straight to the settled hero (scene-cut). A small
  "skip" control is available.

## Hero — after settle
- **Live-typing terminal:** code types onto the terminal face — a `const dev = { name,
  role, stack }` object — with a blinking cursor. Types once, then holds (loop optional).
- **Animated name:** large display type with an animated violet gradient shimmer;
  per-letter hover nudge/settle on mouse.
- **Rotating role line:** `I build ___` cycles through phrases with a smooth
  fade/slide swap.
- Scroll cue retained.

## Technical
- Particles: one instanced/points system (GPU-friendly). Convergence animates point
  positions scattered → target-on-terminal with eased interpolation over the intro
  timeline.
- Reuses the existing R3F canvas + camera. Intro is a timeline phase that runs before
  `ScrollCamera` takes over scroll control (a shared "intro complete" state gates the
  handoff so scroll and intro don't fight for the camera).
- Content comes from `lib/content.ts`: add `roles: string[]` (rotating line) and a
  `terminalLines`/derived code snippet; reuse `name`, `title`, `initials`.
- Accessibility/perf: reduced-motion + mobile skip the particle intro and fly-in;
  live-typing respects reduced-motion (renders final text immediately); name shimmer
  pauses under reduced-motion.

## Content needed (placeholders until provided)
name, initials, title/role, 3–5 rotating phrases, terminal code values (name/role/stack).

## Out of scope (YAGNI)
- Heavy mouse-reactive particle repulsion (kept: existing subtle terminal mouse-tilt).
- Sound. Multiple intro variants.
