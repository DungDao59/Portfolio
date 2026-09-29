"use client";
import { Nav } from "@/components/ui/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export function SceneCut() {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: "radial-gradient(circle at 50% -10%, rgba(124,92,255,0.15), #0a0a0b 60%)" }}
    >
      <Nav />
      <main className="relative z-10">
        <Hero immediate /><About /><Projects /><TechStack /><Experience /><Education /><Contact />
      </main>
    </div>
  );
}
