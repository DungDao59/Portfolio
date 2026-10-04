# Projects Section → Accordion Gallery Design

**Date:** 2026-10-03
**Goal:** Replace the 3-card Projects grid with a React Bits–style horizontal image accordion that matches the portfolio's violet theme, shows real project screenshots, and reveals rich project info on the expanded panel.

## Projects (4)

| id | name | tagline (one-liner) | image | live | github |
|----|------|---------------------|-------|------|--------|
| aff | AFF | Food Donation website | /projects/aff.png | https://team3-v4u6.onrender.com/ | — |
| nct-hub | NCT Hub | RMIT Neo Culture Tech website | /projects/nct-hub.png | https://rmitnct.club/ | https://github.com/rmit-nct/hub |
| motul-epr | Motul EPR | EPR Platform | /projects/motul.png | — | — |
| neo-weather | Neo What Weather | Weather forecasting website | /projects/neo-weather.png | — | https://github.com/rmit-nct/neo-what-weather |

The neo-weather screenshot was captured by running the repo locally against a live OpenWeather key (Florida dashboard view).

## Behavior

- Single horizontal accordion row. Collapsed panels: narrow, grayscaled, slightly tilted. Active panel: expands, full color, reveals content. GSAP `power3.out`, subtle parallax.
- **Shorter, wider panels** (`height` ≈ 360, `expandRatio` ≈ 0.6) to flatter landscape screenshots.
- **Trigger: hover** on desktop; tap/focus on mobile. Default-expanded = **NCT Hub**.
- Mobile (<520px): component's built-in vertical stacking.

## Rich expanded panel content (overlaid bottom-left, fades in)

- Project **name** (large)
- **tagline** one-liner
- **tech** pills
- **Live ↗ / GitHub ↗** buttons — only rendered when the project has that link.

## Theming

Wire the gallery to the portfolio theme, not React Bits defaults:
- `accentColor` = `#7c5cff` (violet)
- `overlayColor` = dark indigo base (`#0d0b1c`)
- `textColor` = off-white (`#ededed`)

Heading stays `FlapHeading text="PROJECTS"` (split-flap).

## Code changes

- `npm install gsap --legacy-peer-deps`
- New `components/ui/AccordionGallery.tsx` — TypeScript port of the React Bits component (typed props, same GSAP engine). Supports a `renderContent(item)` render-prop so the rich overlay lives in `Projects.tsx`, keeping the gallery generic.
- New `components/ui/AccordionGallery.css` — copied from React Bits.
- Extend `Project` type in `lib/content.ts` with `name: string` and `tagline: string`; set `image` on all four; add the `neo-weather` entry.
- Rewrite `components/sections/Projects.tsx` to build items from `content.projects` and render `AccordionGallery` inside the existing `<Section id="projects">` (scroll-snap preserved).

## Out of scope

Full project case-study pages, animations beyond the gallery's own, changes to other sections.
