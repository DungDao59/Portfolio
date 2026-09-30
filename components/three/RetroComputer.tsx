"use client";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

// "Simple computer" by Robert Schlyter — CC BY 3.0 (via poly.pizza). See README credits.
const MODEL = "/models/computer-screen.glb";

// --- tuning knobs (adjust after viewing in the browser) ---
const TARGET_HEIGHT = 3; // world-space height of the whole model
const SCREEN_Y = 0.17; // model-space Y of the CRT screen center (aligns screen to world origin)
const ROT_Y = Math.PI; // computer faces the camera
const OFFSET: [number, number, number] = [0, 0, 0]; // world nudge to center the screen on the text
// ----------------------------------------------------------

// Loads the real retro-computer GLB and positions it so the CRT screen sits at the
// world origin — keeping the hero content overlay and the scroll dive-through aligned.
export function RetroComputer() {
  const { scene } = useGLTF(MODEL);

  const object = useMemo(() => {
    const s = scene.clone(true);
    // Recolor to match the site theme: near-black screen, neutral dark bezel.
    s.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat || !("name" in mat)) return;
      if (mat.name === "metalDark") {
        // screen → deep indigo-violet with a soft "powered-on" glow (matches theme)
        mat.color.set("#1b1836");
        mat.emissive.set("#2a2350");
        mat.emissiveIntensity = 0.35;
      } else if (mat.name === "metal") {
        mat.color.set("#2a2a33"); // bezel/body → dark neutral
        mat.metalness = 0.6;
        mat.roughness = 0.5;
      }
    });
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
      {/* soft, neutral lighting to match the dark theme */}
      <pointLight position={[3, 3, 4]} intensity={10} color="#ffffff" distance={20} />
      <pointLight position={[-3, -1, 3]} intensity={5} color="#7c5cff" distance={18} />
    </group>
  );
}

useGLTF.preload(MODEL);
