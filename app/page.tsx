"use client";
import dynamic from "next/dynamic";
import { useCapability } from "@/providers/Capability";
import { SceneCut } from "@/components/fallback/SceneCut";
import { Preloader } from "@/components/intro/Preloader";

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);
import { Nav } from "@/components/ui/Nav";
import { WorldBackdrop } from "@/components/ui/WorldBackdrop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  const { useFull3D } = useCapability();
  if (!useFull3D) {
    return (<><Preloader /><SceneCut /></>);
  }
  return (
    <>
      <Preloader />
      <WorldBackdrop />
      <SceneCanvas />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10">
        <Hero /><About /><Projects /><TechStack /><Experience /><Contact />
      </main>
    </>
  );
}
