"use client";
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const CODE = [
  "const dev = {",
  "  name: 'you',",
  "  stack: ['ts','r3f'],",
  "  ship: () => true,",
  "};",
];

export function Terminal({ position = [0, 0, 0] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.12;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.25, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.15, 0.05);
  });
  return (
    <group ref={group} position={position}>
      {/* glowing frame */}
      <RoundedBox args={[3.4, 2.2, 0.2]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#141420" emissive="#7c5cff" emissiveIntensity={0.35} />
      </RoundedBox>
      {/* dark face */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[3.1, 1.9]} />
        <meshBasicMaterial color="#0b0b12" />
      </mesh>
      {/* code lines */}
      <group position={[-1.35, 0.6, 0.12]}>
        {CODE.map((line, i) => (
          <Text
            key={i}
            position={[0, -i * 0.32, 0]}
            fontSize={0.18}
            anchorX="left"
            anchorY="middle"
            color={i === 0 || i === CODE.length - 1 ? "#7c5cff" : "#c9c9d6"}
          >
            {line}
          </Text>
        ))}
      </group>
    </group>
  );
}
