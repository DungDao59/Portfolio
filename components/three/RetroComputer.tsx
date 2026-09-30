"use client";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

// "Simple computer" by Robert Schlyter — CC BY 3.0 (via poly.pizza). See README credits.
const MODEL = "/models/retro-computer.glb";

// --- tuning knobs (adjust after viewing in the browser) ---
const TARGET_HEIGHT = 3.6; // world-space height of the whole model
const SCREEN_Y = 0.246; // model-space Y of the CRT screen center (aligns screen to world origin)
const ROT_Y = Math.PI - 0.32; // computer faces the camera
const OFFSET: [number, number, number] = [0.07, 0, 0]; // world nudge to center the screen on the text
// ----------------------------------------------------------

// Loads the real retro-computer GLB and positions it so the CRT screen sits at the
// world origin — keeping the hero content overlay and the scroll dive-through aligned.
export function RetroComputer() {
  const { scene } = useGLTF(MODEL);

  const object = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = TARGET_HEIGHT / size.y;
    // center on x/z, and lift so the screen (model y = SCREEN_Y) lands on the origin
    s.position.set(-center.x, -SCREEN_Y, -center.z);
    const g = new THREE.Group();
    g.add(s);
    g.scale.setScalar(scale);
    g.rotation.y = ROT_Y;
    return g;
  }, [scene]);

  return (
    <group>
      <group position={OFFSET}>
        <primitive object={object} />
      </group>
      {/* faint CRT glow behind the hero text so the screen reads as "on" */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.6, 1.1]} />
        <meshBasicMaterial color="#7c5cff" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      {/* lighting so the beige plastics read with some spec */}
      <pointLight position={[3, 3, 4]} intensity={14} color="#fff2da" distance={20} />
      <pointLight position={[-3, -1, 3]} intensity={6} color="#7c5cff" distance={18} />
      <pointLight position={[0, 0, 3]} intensity={5} color="#ffffff" distance={12} />
    </group>
  );
}

useGLTF.preload(MODEL);
