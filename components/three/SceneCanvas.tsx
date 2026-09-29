"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { World } from "./World";
import { Terminal } from "./Terminal";
import { ScrollCamera } from "./ScrollCamera";
import { GalleryPanels } from "./zones/GalleryPanels";

export function SceneCanvas({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <Canvas
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true }}
      >
        <World />
        <Terminal />
        <GalleryPanels />
        <ScrollCamera />
        {children}
      </Canvas>
    </div>
  );
}
