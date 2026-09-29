"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cameraAt } from "@/lib/journey";
import { introState } from "@/lib/introState";

export let scrollProgress = 0;

export function ScrollCamera() {
  // Persistent vectors to avoid per-frame allocations
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const posTarget = useRef(new THREE.Vector3(0, 0, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((state) => {
    // The intro sequence owns the camera until it hands off.
    if (introState.isActive()) return;
    const max = document.body.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;
    const { pos, lookAt } = cameraAt(scrollProgress);
    posTarget.current.set(...pos);
    lookTarget.current.set(...lookAt);
    state.camera.position.lerp(posTarget.current, 0.06);
    look.current.lerp(lookTarget.current, 0.06);
    state.camera.lookAt(look.current);
  });
  return null;
}
