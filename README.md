# Developer Portfolio

An immersive Next.js developer portfolio featuring a continuous 3D camera journey through a "Digital Cosmos" world — seven content zones (Hero, About, Projects, Skills, Experience, Education, Contact) rendered with React Three Fiber. On mobile, low-power devices, and when `prefers-reduced-motion` is set, the 3D scene is replaced with a scene-cut (section-snap) fallback; this is intentional.

---

## Prerequisites

- **Node 20+** (development was done on Node 26)
- **npm** (Yarn/pnpm not tested)

---

## Install

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer-dependency conflict between Vitest and `@testing-library`. Without it, npm will refuse to install.

---

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Testing

```bash
npm test
```

Runs the Vitest test suite.

---

## Production build

```bash
npm run build
npm start
```

---

## Editing your content

**All personal content lives in one file: `lib/content.ts`.**

Every value you need to replace is prefixed with `PLACEHOLDER:`. Find them all at once:

```bash
grep -rn "PLACEHOLDER" lib/ app/
```

This currently returns **18 occurrences**, all inside `lib/content.ts`:

| Field | What to replace |
|---|---|
| `name` | Your full name |
| `title` | Your job title |
| `tagline` | One-line personal tagline |
| `bio` | 2–3 sentence about section bio |
| `projects[*].title` | Project names (×3) |
| `projects[*].description` | Project descriptions (×3) |
| `experience[*].role` | Job titles (×2) |
| `experience[*].org` | Company names (×2) |
| `experience[*].summary` | Role summaries (×2) |
| `education[0].school` | University name |
| `education[0].credential` | Degree/credential |

Edit the file and save — hot-reload picks up the changes immediately in dev.

---

## Changing the accent color

Open `styles/tokens.css` and update the CSS custom properties:

```css
--accent: /* your hue, e.g. oklch(0.7 0.2 260) */;
--accent-soft: /* a softer/lighter variant */;
```

Both the 3D world and all UI overlays read from these tokens, so a single edit repaints the entire site.

---

## Deploy to Vercel

No environment variables are required. The 3D scene runs entirely client-side, so deployment is standard static Next.js.

1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — click **Deploy**.

> **Note:** Because `npm install` requires `--legacy-peer-deps`, add a project-level `.npmrc` (already present in this repo) or set the Vercel install command to `npm install --legacy-peer-deps` under **Project Settings → Build & Development Settings → Install Command**.

That's it — the site will be live in under a minute.

---

## Architecture notes

| Concern | Location |
|---|---|
| All content | `lib/content.ts` |
| Design tokens / accent color | `styles/tokens.css` |
| 3D world + camera path | `components/scene/` |
| Capability detection + fallback | `lib/capability.ts`, `components/SceneCutFallback` |
| Section overlays (7 zones) | `components/sections/` |
| Preloader + curtain entrance | `components/Preloader` |
| Navigation + scroll progress | `components/Nav` |

The scene-cut fallback is shown automatically whenever `useFull3D` is `false` — reduced-motion users, mobile/low-power devices, and browsers without WebGL all get a smooth, accessible experience without the 3D overhead.

## Credits

- 3D hero model: **"Simple computer"** by **Robert Schlyter** — licensed **CC BY 3.0**, via [poly.pizza](https://poly.pizza/m/doMMnviJrGi). File: `public/models/computer-screen.glb`.
