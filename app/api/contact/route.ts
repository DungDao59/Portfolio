import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Invalid email address"),
  message: z.string().trim().min(1).max(5000),
  company: z.string().optional(), // honeypot — real users never fill this
});

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your inputs." }, { status: 400 });
  }
  const { name, email, message, company } = parsed.data;

  // honeypot tripped → pretend success, send nothing
  if (company && company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email isn't configured yet." }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO || "dungdao.work@gmail.com";
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html:
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });

    if (error) {
      return NextResponse.json({ error: "Could not send right now. Try again later." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send right now. Try again later." }, { status: 502 });
  }
}
