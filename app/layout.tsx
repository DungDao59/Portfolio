import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Caveat } from "next/font/google";
import "@/styles/globals.css";
import { CapabilityProvider } from "@/providers/Capability";
import { MotionProvider } from "@/providers/Motion";
import ClickSpark from "@/components/ui/ClickSpark";
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

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="grain">
        <CapabilityProvider>
          <MotionProvider>
            <ClickSpark sparkColor="#7c5cff" sparkCount={8} sparkRadius={18} sparkSize={11} duration={450}>
              {children}
            </ClickSpark>
          </MotionProvider>
        </CapabilityProvider>
      </body>
    </html>
  );
}
