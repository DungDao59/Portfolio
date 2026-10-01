"use client";
import { Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A soft radial "blob" texture reused for the nebula clouds.
function useNebulaTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.35, "rgba(255,255,255,0.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

// Fewer clouds → a darker, cleaner base. They stay rich in the hero and fade as
// you dive into the "computer world".
const CLOUDS: { pos: [number, number, number]; scale: number; color: string; opacity: number }[] = [
  { pos: [-15, 7, -30], scale: 32, color: "#7c5cff", opacity: 0.3 },
  { pos: [17, -8, -40], scale: 42, color: "#4f6bff", opacity: 0.24 },
  { pos: [-10, -10, -56], scale: 40, color: "#c05cff", opacity: 0.2 },
];

export function World() {
  const tex = useNebulaTexture();
  const clouds = useRef<THREE.Group>(null);
  const stars = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (stars.current) stars.current.rotation.y += dt * 0.005;
    if (clouds.current) clouds.current.rotation.z += dt * 0.008;
  });

  return (
    <group>
      {/* layered starfield for depth */}
      <group ref={stars}>
        <Stars radius={140} depth={90} count={9000} factor={5} fade speed={0.3} />
        <Stars radius={70} depth={40} count={2600} factor={7} fade speed={0.6} />
      </group>

      {/* drifting nebula clouds (fade on dive) */}
      <group ref={clouds}>
        {CLOUDS.map((c, i) => (
          <mesh key={i} position={c.pos} scale={c.scale} userData={{ base: c.opacity }}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={tex}
              color={c.color}
              transparent
              opacity={c.opacity}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 6]} intensity={30} color="#7c5cff" distance={40} />
    </group>
  );
}
