import { SceneCanvas } from "@/components/three/SceneCanvas";
import { Nav } from "@/components/ui/Nav";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Preloader } from "@/components/intro/Preloader";

export default function Page() {
  return (
    <>
      <Preloader />
      <SceneCanvas />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <Experience />
        <Education />
        <Contact />
      </main>
    </>
  );
}
