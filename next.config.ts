import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // serve AVIF first (smaller), then WebP, before falling back to the source
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
