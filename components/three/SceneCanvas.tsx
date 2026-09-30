"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { World } from "./World";
import { RetroComputer } from "./RetroComputer";
import { ScrollCamera } from "./ScrollCamera";
import { GalleryPanels } from "./zones/GalleryPanels";
import { Constellation } from "./zones/Constellation";
import { TimelineTrack } from "./zones/TimelineTrack";

export function SceneCanvas({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1 }}>
      <Canvas
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 3.8], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <World />
          <RetroComputer />
          <GalleryPanels />
          <Constellation />
          <TimelineTrack />
          <ScrollCamera />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
