"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { World } from "./World";
import { RetroComputer } from "./RetroComputer";
import { ScrollCamera } from "./ScrollCamera";
import { getDive } from "@/lib/scroll";

// The 3D scene (universe + monitor) lives only in the hero. As you dive in it fades
// out, leaving the flat themed world for the content sections.
export function SceneCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const d = getDive();
      const opacity = Math.max(0, 1 - Math.max(0, d - 0.35) / 0.65);
      if (wrapRef.current) wrapRef.current.style.opacity = String(opacity);
      const shouldRender = opacity > 0.01 && !document.hidden;
      setActive((prev) => (prev === shouldRender ? prev : shouldRender));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 3.8], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <World />
          <RetroComputer />
          <ScrollCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}
