import { SECTIONS, SectionId } from "@/lib/content";

export type Vec3 = [number, number, number];
export type Zone = { id: SectionId; cameraPos: Vec3; lookAt: Vec3 };

// A path that flies forward (−z) and gently weaves x/y between zones.
const RAW: Record<SectionId, { cameraPos: Vec3; lookAt: Vec3 }> = {
  // Hero: centered on the retro computer (CRT screen at world origin).
  hero:       { cameraPos: [0, 0, 3.8],    lookAt: [0, 0, 0] },
  // About: straight dive through the CRT screen (origin) into the section.
  about:      { cameraPos: [0, 0, -6],     lookAt: [0, 0, -10] },
  projects:   { cameraPos: [-4, 0, -22],  lookAt: [-2, 0, -28] },
  tech:       { cameraPos: [2, 2, -40],   lookAt: [0, 1, -46] },
  experience: { cameraPos: [-2, -1, -58], lookAt: [0, 0, -66] },
  education:  { cameraPos: [3, 1, -76],   lookAt: [1, 0, -82] },
  contact:    { cameraPos: [0, 0, -92],   lookAt: [0, 0, -100] },
};

export const ZONES: Zone[] = SECTIONS.map((id) => ({ id, ...RAW[id] }));

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 =>
  [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

export function cameraAt(progress: number): { pos: Vec3; lookAt: Vec3 } {
  const p = clamp01(progress);
  const segments = ZONES.length - 1;
  const scaled = p * segments;
  const i = Math.min(segments - 1, Math.floor(scaled));
  const t = scaled - i;
  return {
    pos: lerp3(ZONES[i].cameraPos, ZONES[i + 1].cameraPos, t),
    lookAt: lerp3(ZONES[i].lookAt, ZONES[i + 1].lookAt, t),
  };
}

export function zoneIndexAt(progress: number): number {
  const p = clamp01(progress);
  return Math.round(p * (ZONES.length - 1));
}
