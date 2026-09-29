import type { Metadata } from "next";
import "@/styles/globals.css";
import { CapabilityProvider } from "@/providers/Capability";
import { SmoothScroll } from "@/providers/SmoothScroll";

export const metadata: Metadata = {
  title: "PLACEHOLDER: Your Name — Developer",
  description: "PLACEHOLDER: Immersive developer portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <CapabilityProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </CapabilityProvider>
      </body>
    </html>
  );
}
