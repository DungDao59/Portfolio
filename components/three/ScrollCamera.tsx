"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cameraAt } from "@/lib/journey";

export let scrollProgress = 0;

export function ScrollCamera() {
  const look = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((state) => {
    const max = document.body.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;
    const { pos, lookAt } = cameraAt(scrollProgress);
    state.camera.position.lerp(new THREE.Vector3(...pos), 0.06);
    look.current.lerp(new THREE.Vector3(...lookAt), 0.06);
    state.camera.lookAt(look.current);
  });
  return null;
}
