"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { getDive } from "@/lib/scroll";
import { introState } from "@/lib/introState";

// Zooms the camera from the hero framing into the monitor screen as you dive in.
export function ScrollCamera() {
  const target = useRef(new THREE.Vector3(0, 0, 3.8));
  useFrame((state) => {
    if (introState.isActive()) return;
    const d = getDive();
    target.current.set(0, 0, 3.8 + (0.4 - 3.8) * d); // 3.8 -> 0.4 (into the screen)
    state.camera.position.lerp(target.current, 0.1);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}
