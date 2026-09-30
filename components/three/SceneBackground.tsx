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
// not the raw #2a2a33 material — that's why the grey looked wrong.
const SCREEN = new THREE.Color("#0d0c1e");

// The dive happens across the first journey segment (hero -> about) = 1/6 of scroll.
const SEGMENT = 1 / 6;

export function SceneBackground() {
  const { scene } = useThree();
  const col = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const t = Math.min(1, Math.max(0, scrollProgress / SEGMENT));
    col.copy(COSMOS).lerp(SCREEN, t);
    scene.background = col;
  });
  return null;
}
