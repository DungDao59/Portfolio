"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlapHeading } from "@/components/ui/FlapHeading";

type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "w-full rounded-lg border border-white/12 bg-white/[0.03] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-accent/60 focus:ring-1 focus:ring-accent/40";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      company: String(fd.get("company") || ""), // honeypot
    };

    if (!data.name || !data.email || !data.message) {
      setStatus("error");
      setError("Please fill in all fields.");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <Section id="contact">
      <div className="w-full">
        <FlapHeading text="CONTACT" className="mb-8" />

        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          {/* left: info */}
          <Reveal>
            <div className="flex h-full flex-col">
              <h2 className="font-display text-4xl font-bold leading-[1.05] md:text-5xl">
                Let&apos;s build
                <br />
                something.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Have a role, a project, or just want to say hi? Drop a message and I&apos;ll get
                back to you.
              </p>

              <a
                href={`mailto:${content.email}`}
                className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-accent transition hover:brightness-125"
              >
                <span aria-hidden="true">✉</span>
                {content.email}
              </a>

              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-8 text-sm">
                {content.socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* right: form */}
          <Reveal delay={0.1}>
            {status === "success" ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-xl border border-accent/30 bg-accent/[0.06] p-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-2xl text-accent">
                  ✓
                </div>
                <p className="text-lg font-semibold">Message sent!</p>
                <p className="mt-1 text-sm text-muted">Thanks — I&apos;ll get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-5 text-sm font-medium text-accent hover:underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
                {/* honeypot (hidden from users) */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <div>
                  <label htmlFor="c-name" className="mb-1 block text-xs font-medium text-muted">
                    Name
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Your name"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="c-email" className="mb-1 block text-xs font-medium text-muted">
                    Email
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    placeholder="you@example.com"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="c-message" className="mb-1 block text-xs font-medium text-muted">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    maxLength={5000}
                    rows={4}
                    placeholder="What's on your mind?"
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-[#ff7a7a]" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,92,255,0.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Send message →"}
                </button>
              </form>
            )}
          </Reveal>
        </div>

        {/* footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-xs text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {content.name}
          </span>
          <span>Built with Next.js &amp; React Three Fiber</span>
        </footer>
      </div>
    </Section>
  );
}
