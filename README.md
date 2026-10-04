# Developer Portfolio

An immersive Next.js developer portfolio: a 3D retro-computer hero in a "Digital Cosmos", a scroll "dive" into the screen, then six themed, snap-scrolling content sections (Hero, About, Projects, Tech Stack, Experience, Contact) — built with React Three Fiber. On mobile, low-power devices, and when `prefers-reduced-motion` is set, the 3D scene is replaced with a scene-cut (section-snap) fallback; this is intentional.

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

**All personal content lives in one file: `lib/content.ts`.** Edit the values there and save — hot-reload picks up changes immediately in dev.

| Field | What it holds |
|---|---|
| `name`, `heroName`, `title` | Identity shown in the hero and nav |
| `tagline`, `headline` | One-line pitch and hero subhead |
| `about` | About-section bio |
| `projects[*]` | Project cards (title, role, description, tech, links, image) |
| `techStack` / `techGroups` | Tech-constellation nodes and their groups |
| `experience[*]` | Experience-timeline entries (role, org, period, bullets, tags, logo) |
| `email`, `socials` | Contact details |

---

## Changing the accent color

Open `styles/tokens.css` and update the CSS custom properties:

```css
--accent: 124 92 255;                   /* space-separated RGB channels */
--accent-soft: rgba(124, 92, 255, 0.15);
```

`--accent` is stored as raw RGB channels so Tailwind can apply opacity (e.g. `text-accent/60`). Both the 3D world and all UI overlays read from these tokens, so a single edit repaints the entire site.

---

## Deploy to Vercel

The site deploys as a standard Next.js app. The only setup is the contact-form email service ([Resend](https://resend.com)); everything else works out of the box.

1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Under **Environment Variables**, add the values below (see `.env.example`), then click **Deploy**.

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | **Yes** (for the form) | Resend API key used to send contact-form email. |
| `CONTACT_TO` | No | Where messages are delivered (defaults to the owner's email). |
| `CONTACT_FROM` | No | Verified sender. Use `onboarding@resend.dev` until your domain is verified in Resend, then `Portfolio <contact@yourdomain.com>`. |

Without `RESEND_API_KEY` the whole site still works — the form just returns a friendly "not configured yet" message.

> **Note:** `npm install` requires `--legacy-peer-deps` (Vitest ↔ `@testing-library` peer conflict). A project-level `.npmrc` with `legacy-peer-deps=true` is already present, so Vercel installs cleanly with no extra config.

That's it — the site will be live in under a minute.

---

## Architecture notes

| Concern | Location |
|---|---|
| All content | `lib/content.ts` |
| Design tokens / accent color | `styles/tokens.css` |
| 3D hero scene + camera | `components/three/` |
| Capability detection + fallback | `lib/capability.ts`, `components/fallback/SceneCut.tsx` |
| Content sections (6) | `components/sections/` |
| World-building preloader (intro) | `components/intro/Preloader.tsx` |
| Navigation + scroll progress | `components/ui/Nav.tsx`, `components/ui/ScrollProgress.tsx` |
| Contact form API (Resend) | `app/api/contact/route.ts` |

The scene-cut fallback is shown automatically whenever `useFull3D` is `false` — reduced-motion users, mobile/low-power devices, and browsers without WebGL all get a smooth, accessible experience without the 3D overhead.

## Credits

- 3D hero model: **"Simple computer"** by **Robert Schlyter** — licensed **CC BY 3.0**, via [poly.pizza](https://poly.pizza/m/doMMnviJrGi). File: `public/models/computer-screen.glb`.
