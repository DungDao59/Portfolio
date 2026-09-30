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

const CLOUDS: { pos: [number, number, number]; scale: number; color: string; opacity: number }[] = [
  { pos: [0, 0, -14], scale: 22, color: "#7c5cff", opacity: 0.22 }, // halo behind the monitor
  { pos: [-13, 6, -26], scale: 30, color: "#7c5cff", opacity: 0.28 },
  { pos: [15, -7, -34], scale: 38, color: "#4f6bff", opacity: 0.24 },
  { pos: [-9, -9, -46], scale: 36, color: "#c05cff", opacity: 0.2 },
  { pos: [18, 9, -54], scale: 44, color: "#5a3cff", opacity: 0.22 },
  { pos: [0, 2, -70], scale: 60, color: "#3a2f7a", opacity: 0.22 },
];

export function World() {
  const tex = useNebulaTexture();
  const clouds = useRef<THREE.Group>(null);
  const stars = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (clouds.current) clouds.current.rotation.z += dt * 0.008;
    if (stars.current) stars.current.rotation.y += dt * 0.005;
  });

  return (
    <group>
      {/* layered starfield for depth */}
      <group ref={stars}>
        <Stars radius={140} depth={90} count={6000} factor={4} fade speed={0.3} />
        <Stars radius={70} depth={40} count={1800} factor={6} fade speed={0.6} />
      </group>

      {/* drifting nebula clouds */}
      <group ref={clouds}>
        {CLOUDS.map((c, i) => (
          <mesh key={i} position={c.pos} scale={c.scale}>
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
