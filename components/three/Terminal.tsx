"use client";
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { content } from "@/lib/content";
import { introState } from "@/lib/introState";

const FULL = content.codeLines.join("\n");
const CPS = 26; // characters typed per second

export function Terminal({ position = [0, 0, 0] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const typeStart = useRef<number | null>(null);
  const lastBlink = useRef(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // idle float + subtle mouse tilt
    group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.12;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.25, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.15, 0.05);

    const active = introState.isActive();
    const p = introState.getProgress();

    // power-on: emissive ramps up over the last quarter of the intro, holds after
    const target = active ? Math.max(0.05, ((p - 0.75) / 0.25) * 0.4) : 0.4;
    if (mat.current) {
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity,
        Math.min(0.4, Math.max(0.05, target)),
        0.1,
      );
    }

    // typing begins once the intro hands off
    if (!active) {
      if (typeStart.current === null) typeStart.current = t;
      const n = Math.min(FULL.length, Math.floor((t - typeStart.current) * CPS));
      if (n !== visibleCount) setVisibleCount(n);
      if (t - lastBlink.current > 0.5) {
        lastBlink.current = t;
        setCursorOn((c) => !c);
      }
    }
  });

  const lines = FULL.slice(0, visibleCount).split("\n");
  const typing = visibleCount < FULL.length;

  return (
    <group ref={group} position={position}>
      {/* glowing frame — wide, screen-like aspect so it fills the hero */}
      <RoundedBox args={[4.6, 2.6, 0.2]} radius={0.1} smoothness={4}>
        <meshStandardMaterial ref={mat} color="#141420" emissive="#7c5cff" emissiveIntensity={0.05} />
      </RoundedBox>
      {/* dark face */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[4.2, 2.3]} />
        <meshBasicMaterial color="#0b0b12" />
      </mesh>
      {/* typed code lines */}
      <group position={[-1.9, 0.9, 0.12]}>
        {lines.map((line, i) => {
          const isLast = i === lines.length - 1;
          const text = line + (isLast && typing && cursorOn ? "_" : "");
          const accent = line.includes("const") || line.includes("};");
          return (
            <Text
              key={i}
              position={[0, -i * 0.34, 0]}
              fontSize={0.18}
              anchorX="left"
              anchorY="middle"
              color={accent ? "#7c5cff" : "#c9c9d6"}
            >
              {text}
            </Text>
          );
        })}
      </group>
    </group>
  );
}
