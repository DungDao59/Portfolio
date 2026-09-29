import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "@/styles/globals.css";
import { CapabilityProvider } from "@/providers/Capability";
import { SmoothScroll } from "@/providers/SmoothScroll";
import { content } from "@/lib/content";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${content.name} — ${content.title}`,
  description: content.tagline,
  openGraph: {
    title: `${content.name} — ${content.title}`,
    description: content.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="grain">
        <CapabilityProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </CapabilityProvider>
      </body>
    </html>
  );
}
