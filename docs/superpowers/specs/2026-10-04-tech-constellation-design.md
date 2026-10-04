# Tech Stack → Interactive Constellation Design

**Date:** 2026-10-04
**Goal:** Replace the flat wall of 23 text pills with an interactive "tech constellation" — real brand logos as floating star-nodes, grouped by CV category via color + constellation lines, with hover/focus focus-and-recede interaction.

## Groups (from CV) + hues

| group id | label | hue |
|----------|-------|-----|
| lang | Languages & Databases | violet `#7c5cff` |
| framework | Frameworks & Libraries | sky `#38bdf8` |
| tool | Tools & Services | pink `#f472b6` |

**Members**
- lang: TypeScript, JavaScript, Python, Java, C++, PostgreSQL, MongoDB
- framework: Node.js, Express.js, React.js, Next.js, Prisma, Zod
- tool: Git, GitHub, Docker, Postman, Stripe, Cloudinary, Resend, Render, Vercel, Supabase

## Nodes

- Round glassy tile (~60px) with the brand logo (colored where available), a thin glow ring in the group hue, and an always-on small label beneath (dim by default, brightens on hover).
- Logos downloaded to `public/tech/*.svg` (Devicon colored first; Simple Icons for the rest; black-brand logos like GitHub/Vercel/Next/Resend rendered light). Any tech with no official icon (e.g. Zod if unavailable) gets a monogram tile in the group hue.
- Positioned via hand-authored %-coordinates (`x`, `y`) so same-group nodes loosely cluster while the whole reads as one constellation; tuned to avoid overlap.

## Constellation lines

- SVG layer (behind nodes) drawing faint lines between same-group nodes, in the group hue at low opacity. Endpoints = each node's fixed center (%-coords), so the floating tiles don't detach the lines. Lines for the hovered node's group brighten.

## Motion & interaction

- Each node gently drifts/bobs (Framer Motion, slow, small amplitude, staggered unique offsets).
- Hover/focus a node → scales up, full brightness, label pops, its group's lines brighten; every other node recedes (dim + slight shrink + desaturate).
- Staggered fade-in on scroll into view.
- Respects `prefers-reduced-motion` (no drift; hover/focus still works).

## Mobile (<640px)

- Constellation is too dense on phones → fall back to a grouped layout: the three labeled categories, each a flex-wrap of logo+name chips with the group-hue ring. Same data and logos.

## Data changes (`lib/content.ts`)

- Replace the flat `techStack: string[]` with:
  - `techGroups: { id, label, hue }[]`
  - `techStack: { name, icon, group, x, y }[]` (icon = `/tech/<file>.svg` or a `mono` flag for monogram; x/y = constellation %-position)
- Keep it one source of truth; the mobile fallback reads the same array grouped by `group`.

## Files

- Rewrite `components/sections/TechStack.tsx`
- New `components/ui/TechConstellation.tsx` + `TechConstellation.css`
- New `public/tech/*.svg`

## Out of scope

Per-tech proficiency levels, 3D/R3F rendering, changes to other sections.
