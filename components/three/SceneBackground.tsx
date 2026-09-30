"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { scrollProgress } from "./ScrollCamera";

// Blend the universe background from cosmos-black (hero) into the monitor's
// display color as the camera dives through the screen — so entering About feels
// like entering the monitor's world. Stars and nebula clouds are unaffected.
const COSMOS = new THREE.Color("#0a0a0b");
// The display's actual on-screen color is a dark indigo (sampled from the render),
// not the raw #2a2a33 material. Tuned to the screen's darker edges.
const SCREEN = new THREE.Color("#060516");

// Blend fast — finish before reaching the About zone so the world is fully "inside
// the screen" by then (matches the WorldGrid fade).
const BLEND_END = 0.1;

export function SceneBackground() {
  const { scene } = useThree();
  const col = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const t = Math.min(1, Math.max(0, scrollProgress / BLEND_END));
    col.copy(COSMOS).lerp(SCREEN, t);
    scene.background = col;
  });
  return null;
}
