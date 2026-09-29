"use client";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { introState } from "@/lib/introState";

const BEIGE = "#cfc4a8";
const BEIGE_DARK = "#b3a888";

// A stylized 1980s IBM-PC-style computer: CRT monitor (screen centered at the
// world origin so the HTML hero content can align to it), system unit with two
// floppy drives, and a tilted keyboard. The screen powers on with the intro.
export function RetroComputer() {
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);

  const screenTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 384;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#050d0a"; // dark phosphor
    ctx.fillRect(0, 0, 512, 384);
    // scanlines
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    for (let y = 0; y < 384; y += 3) ctx.fillRect(0, y, 512, 1);
    // center glow
    const g = ctx.createRadialGradient(256, 192, 30, 256, 192, 300);
    g.addColorStop(0, "rgba(124,92,255,0.14)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 384);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame(() => {
    const active = introState.isActive();
    const p = introState.getProgress();
    if (screenMat.current) {
      const target = active ? Math.max(0.02, (p - 0.7) / 0.3) : 1;
      screenMat.current.emissiveIntensity = THREE.MathUtils.lerp(
        screenMat.current.emissiveIntensity,
        Math.min(1, Math.max(0.02, target)) * 0.8,
        0.08,
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* monitor case */}
      <RoundedBox args={[3.0, 2.5, 2.0]} radius={0.12} smoothness={4} position={[0, 0, -0.85]}>
        <meshStandardMaterial color={BEIGE} roughness={0.85} metalness={0} />
      </RoundedBox>
      {/* recessed screen frame */}
      <RoundedBox args={[2.5, 1.9, 0.12]} radius={0.06} smoothness={3} position={[0, 0, 0.16]}>
        <meshStandardMaterial color={BEIGE_DARK} roughness={0.9} />
      </RoundedBox>
      {/* CRT screen (subtly bulged) */}
      <mesh position={[0, 0, 0.23]}>
        <planeGeometry args={[2.2, 1.6, 24, 18]} />
        <meshStandardMaterial
          ref={screenMat}
          map={screenTex}
          emissiveMap={screenTex}
          emissive="#7c5cff"
          emissiveIntensity={0.02}
          color="#08120d"
          toneMapped={false}
        />
      </mesh>

      {/* system unit */}
      <RoundedBox args={[3.9, 0.95, 2.4]} radius={0.08} smoothness={3} position={[0, -1.85, -0.5]}>
        <meshStandardMaterial color={BEIGE} roughness={0.85} />
      </RoundedBox>
      {/* floppy drives */}
      {[0.7, -0.7].map((x) => (
        <group key={x} position={[x, -1.75, 0.72]}>
          <mesh>
            <boxGeometry args={[1.1, 0.5, 0.06]} />
            <meshStandardMaterial color="#2b2b2b" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.02, 0.04]}>
            <boxGeometry args={[0.8, 0.06, 0.03]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* keyboard */}
      <group position={[0, -2.4, 0.95]} rotation={[-0.16, 0, 0]}>
        <RoundedBox args={[3.2, 0.18, 1.15]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color={BEIGE} roughness={0.9} />
        </RoundedBox>
      </group>

      {/* warm key light for the beige plastics */}
      <pointLight position={[2.5, 2.5, 4]} intensity={12} color="#fff2da" distance={18} />
      <pointLight position={[-3, -1, 3]} intensity={5} color="#7c5cff" distance={16} />
    </group>
  );
}
