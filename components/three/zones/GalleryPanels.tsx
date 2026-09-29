"use client";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { content } from "@/lib/content";

export function GalleryPanels() {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (group.current) group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.1) * 0.03;
  });
  return (
    <group ref={group} position={[-2, 0, -26]}>
      {content.projects.map((_, i) => (
        <RoundedBox
          key={i}
          args={[2.2, 1.4, 0.08]}
          radius={0.06}
          position={[(i - 1) * 3.2, (i % 2 === 0 ? 0.6 : -0.6), i * -1.2]}
        >
          <meshStandardMaterial color="#12121c" emissive="#7c5cff" emissiveIntensity={0.25} />
        </RoundedBox>
      ))}
    </group>
  );
}
