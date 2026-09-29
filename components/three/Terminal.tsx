"use client";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { content } from "@/lib/content";
import { introState } from "@/lib/introState";

const FULL = content.codeLines.join("\n");
const CPS = 26; // characters per second
const CANVAS_W = 1024;
const CANVAS_H = 640;
const KEYWORDS = new Set([
  "const", "let", "var", "return", "true", "false", "function", "=>",
]);

type Token = { text: string; color: string };

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const re = /('[^']*')|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|([^\sA-Za-z0-9_$']+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) tokens.push({ text: m[1], color: "#9ae86b" }); // string
    else if (m[2]) tokens.push({ text: m[2], color: KEYWORDS.has(m[2]) ? "#c792ea" : "#d6d6e2" });
    else if (m[3]) tokens.push({ text: m[3], color: "#d6d6e2" }); // whitespace
    else tokens.push({ text: m[4], color: "#8b8ba3" }); // punctuation
  }
  return tokens;
}

// A realistic code-editor window rendered onto a canvas texture: title bar with
// traffic-light buttons, line-number gutter, syntax-highlighted typing, and a
// glass sheen — mounted on a metallic bezel.
export function Terminal({ position = [0, 0, 0] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const bezelMat = useRef<THREE.MeshStandardMaterial>(null);
  const typeStart = useRef<number | null>(null);
  const lastBlink = useRef(0);
  const cursorOn = useRef(true);
  const drawnCount = useRef(-1);

  const { texture, ctx } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const c = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return { texture: tex, ctx: c };
  }, []);

  const draw = useMemo(() => {
    return (visibleText: string, typing: boolean) => {
      // screen
      ctx.fillStyle = "#0b0b12";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      // title bar
      ctx.fillStyle = "#16161f";
      ctx.fillRect(0, 0, CANVAS_W, 52);
      ["#ff5f56", "#ffbd2e", "#27c93f"].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(30 + i * 28, 26, 7, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#8a8a99";
      ctx.font = "20px monospace";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("dev.ts", CANVAS_W / 2, 26);
      ctx.textAlign = "left";

      // code
      const lines = visibleText.split("\n");
      const lineH = 34;
      const top = 96;
      const codeX = 88;
      ctx.font = "22px 'Courier New', monospace";
      for (let i = 0; i < lines.length; i++) {
        const y = top + i * lineH;
        ctx.fillStyle = "#3a3a4d";
        ctx.textAlign = "right";
        ctx.fillText(String(i + 1), 58, y);
        ctx.textAlign = "left";
        let x = codeX;
        for (const tk of tokenize(lines[i])) {
          ctx.fillStyle = tk.color;
          ctx.fillText(tk.text, x, y);
          x += ctx.measureText(tk.text).width;
        }
        if (typing && i === lines.length - 1 && cursorOn.current) {
          ctx.fillStyle = "#7c5cff";
          ctx.fillRect(x + 2, y - 13, 11, 26);
        }
      }

      // glass sheen
      const g = ctx.createLinearGradient(0, 52, CANVAS_W, CANVAS_H);
      g.addColorStop(0, "rgba(255,255,255,0.06)");
      g.addColorStop(0.25, "rgba(255,255,255,0.015)");
      g.addColorStop(0.5, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 52, CANVAS_W, CANVAS_H - 52);

      texture.needsUpdate = true;
    };
  }, [ctx, texture]);

  // initial paint: editor chrome visible immediately (screen "on")
  useMemo(() => draw("", true), [draw]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.14, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.09, 0.05);

    const active = introState.isActive();
    const p = introState.getProgress();
    if (bezelMat.current) {
      const target = active ? Math.max(0.04, ((p - 0.75) / 0.25) * 0.3) : 0.3;
      bezelMat.current.emissiveIntensity = THREE.MathUtils.lerp(
        bezelMat.current.emissiveIntensity,
        Math.min(0.3, Math.max(0.04, target)),
        0.1,
      );
    }

    if (!active) {
      if (typeStart.current === null) typeStart.current = t;
      const n = Math.min(FULL.length, Math.floor((t - typeStart.current) * CPS));
      const typing = n < FULL.length;
      let needDraw = false;
      if (n !== drawnCount.current) {
        drawnCount.current = n;
        needDraw = true;
      }
      if (t - lastBlink.current > 0.5) {
        lastBlink.current = t;
        cursorOn.current = !cursorOn.current;
        needDraw = true;
      }
      if (needDraw) draw(FULL.slice(0, n), typing);
    }
  });

  return (
    <group ref={group} position={position}>
      {/* metallic bezel */}
      <RoundedBox args={[4.0, 2.55, 0.18]} radius={0.09} smoothness={5}>
        <meshStandardMaterial
          ref={bezelMat}
          color="#1b1b24"
          metalness={0.85}
          roughness={0.35}
          emissive="#7c5cff"
          emissiveIntensity={0.04}
        />
      </RoundedBox>
      {/* screen */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[3.8, 2.375]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* spec highlight for the bezel */}
      <pointLight position={[2.5, 2, 3]} intensity={8} color="#ffffff" distance={14} />
    </group>
  );
}
