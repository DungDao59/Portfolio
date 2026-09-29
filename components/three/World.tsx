"use client";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function World() {
  const nebula = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (nebula.current) nebula.current.rotation.y += dt * 0.01;
  });
  return (
    <group>
      <Stars radius={120} depth={80} count={4000} factor={4} fade speed={0.4} />
      <mesh ref={nebula} position={[0, 0, -40]}>
        <sphereGeometry args={[90, 32, 32]} />
        <meshBasicMaterial color="#7c5cff" side={THREE.BackSide} transparent opacity={0.06} />
      </mesh>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 6]} intensity={30} color="#7c5cff" distance={40} />
    </group>
  );
}
