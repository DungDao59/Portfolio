# Contact Section → Working Contact Form Design

**Date:** 2026-10-04
**Goal:** Replace the mailto-only Contact section with a real contact form that emails the owner via Resend, plus an info column and footer.

## Layout (split, one viewport)

- `FlapHeading "CONTACT"`.
- Two columns (`md:grid-cols-2`):
  - **Left (info):** "Let's build something." headline + short subline; direct email (mailto link); socials row (GitHub, LinkedIn, Facebook, Instagram).
  - **Right (form):** Name, Email, Message fields + Send button. States: idle → submitting (disabled + spinner) → success (confirmation) / error (message).
- **Footer** strip at the bottom of the section: `© <year> Dao Tien Dung · Built with Next.js & React Three Fiber`.
- No availability badge (not selected).

## Form behaviour

- Client component posts JSON to `POST /api/contact`.
- Fields: `name` (required), `email` (required, valid), `message` (required, min length). Hidden `company` honeypot (bots fill it → silently accepted, not sent).
- Client-side validation for instant feedback; server re-validates with Zod (source of truth).
- Success: show "Thanks — I'll get back to you soon." and reset. Error: inline message, keep input.

## API route — `app/api/contact/route.ts`

- `POST` handler (Node runtime). Parse JSON → validate with Zod.
- Honeypot filled → return `{ ok: true }` without sending.
- Send via Resend:
  - `to` = `CONTACT_TO` env (default `dungdao.work@gmail.com`)
  - `from` = `CONTACT_FROM` env (default `onboarding@resend.dev` for keyless-domain testing)
  - `reply_to` = visitor's email (so owner can reply directly)
  - subject = `New portfolio message from <name>`; body = name/email/message (text + simple HTML).
- If `RESEND_API_KEY` is missing → return `503 { error: "Email isn't configured yet." }` so the UI degrades gracefully.
- Basic hardening: honeypot + length caps on fields.

## Env

- `RESEND_API_KEY` (secret) — set in Vercel + local `.env.local`.
- `CONTACT_TO`, `CONTACT_FROM` (optional overrides).
- `.env.example` documents these (force-added since `.env*` is gitignored).

### Owner setup (post-build)
1. Create a free Resend account, generate an API key.
2. Add `RESEND_API_KEY` to `.env.local` (local) and Vercel project env.
3. Works immediately sending to your own account email via `onboarding@resend.dev`.
4. After the domain is live: verify it in Resend, set `CONTACT_FROM=contact@<domain>`.

## Dependencies

- `resend`, `zod` (installed with `--legacy-peer-deps`).

## Files

- New: `app/api/contact/route.ts`, `.env.example`
- Rewrite: `components/sections/Contact.tsx` (client form + info + footer)

## Out of scope

Rate limiting beyond honeypot, attachments, auto-reply to visitor, captcha.
