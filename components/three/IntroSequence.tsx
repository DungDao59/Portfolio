"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { introState } from "@/lib/introState";

const COUNT = 1400;
const START_Z = 34; // camera starts deep in space
const END_Z = 3.1; // hero framing — matches journey.ts hero cameraPos.z

// smootherstep for cinematic easing
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

// Particles begin scattered across a spherical shell and converge onto the
// terminal's silhouette as the timeline advances, then fade as it powers on.
export function IntroSequence() {
  const { camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, scattered, targets } = useMemo(() => {
    const scattered = new Float32Array(COUNT * 3);
    const targets = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 12 + Math.random() * 22;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      scattered[i * 3] = r * Math.sin(ph) * Math.cos(th);
      scattered[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      scattered[i * 3 + 2] = r * Math.cos(ph);
      // target: spread across the terminal face (~4.6 x 2.6, thin depth)
      targets[i * 3] = (Math.random() - 0.5) * 4.6;
      targets[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return { positions: scattered.slice(), scattered, targets };
  }, []);

  useFrame(() => {
    const active = introState.isActive();
    const p = introState.getProgress();

    if (active) {
      const e = smooth(p);
      camera.position.set(0, 0, START_Z + (END_Z - START_Z) * e);
      camera.lookAt(0, 0, 0);
    }

    const pts = pointsRef.current;
    if (pts) {
      const arr = pts.geometry.attributes.position.array as Float32Array;
      const conv = smooth(Math.min(1, p / 0.85)); // gather over first 85%
      const swirl = (1 - conv) * 2.6;
      for (let i = 0; i < COUNT; i++) {
        const sx = scattered[i * 3];
        const sy = scattered[i * 3 + 1];
        const sz = scattered[i * 3 + 2];
        const ang = swirl + i * 0.0015;
        const cs = Math.cos(ang);
        const sn = Math.sin(ang);
        const rx = sx * cs - sz * sn;
        const rz = sx * sn + sz * cs;
        arr[i * 3] = rx + (targets[i * 3] - rx) * conv;
        arr[i * 3 + 1] = sy + (targets[i * 3 + 1] - sy) * conv;
        arr[i * 3 + 2] = rz + (targets[i * 3 + 2] - rz) * conv;
      }
      pts.geometry.attributes.position.needsUpdate = true;
    }

    if (matRef.current) {
      const fade = p < 0.8 ? 1 : Math.max(0, 1 - (p - 0.8) / 0.2);
      matRef.current.opacity = active ? fade : 0;
    }
  });

  // Session-seen / skipped path: intro already resolved before mount.
  if (!introState.isActive()) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#9d86ff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
