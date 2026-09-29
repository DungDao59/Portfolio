"use client";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { content } from "@/lib/content";

export function Constellation() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo<[number, number, number][]>(() => {
    const n = content.techStack.length;
    return content.techStack.map((_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = 2.2;
      return [Math.cos(a) * r, Math.sin(a) * r, Math.sin(i) * 0.6];
    });
  }, []);
  useFrame((s, dt) => { if (group.current) group.current.rotation.y += dt * 0.15; });
  return (
    <group ref={group} position={[0, 1, -40]}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {nodes.map((p, i) => (
        <Line key={`l${i}`} points={[p, nodes[(i + 1) % nodes.length]]} color="#7c5cff" lineWidth={0.6} transparent opacity={0.4} />
      ))}
    </group>
  );
}
