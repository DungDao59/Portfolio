"use client";
import { Line } from "@react-three/drei";
import { content } from "@/lib/content";

export function TimelineTrack() {
  const n = content.experience.length;
  const pts: [number, number, number][] = content.experience.map((_, i) => [
    -3 + (i / Math.max(1, n - 1)) * 6, 0, 0,
  ]);
  return (
    <group position={[0, -1, -58]}>
      <Line points={[[-3.5, 0, 0], [3.5, 0, 0]]} color="#7c5cff" lineWidth={1} transparent opacity={0.5} />
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
}
