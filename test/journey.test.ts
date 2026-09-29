import { describe, it, expect } from "vitest";
import { ZONES, cameraAt, zoneIndexAt } from "@/lib/journey";
import { SECTIONS } from "@/lib/content";

describe("journey", () => {
  it("defines one zone per section, in order", () => {
    expect(ZONES.map((z) => z.id)).toEqual([...SECTIONS]);
  });
  it("returns the first zone at progress 0", () => {
    expect(cameraAt(0).pos).toEqual(ZONES[0].cameraPos);
  });
  it("returns the last zone at progress 1", () => {
    expect(cameraAt(1).pos).toEqual(ZONES[ZONES.length - 1].cameraPos);
  });
  it("clamps progress below 0 and above 1", () => {
    expect(cameraAt(-0.5).pos).toEqual(ZONES[0].cameraPos);
    expect(cameraAt(2).pos).toEqual(ZONES[ZONES.length - 1].cameraPos);
  });
  it("interpolates between zones at the midpoint", () => {
    const mid = cameraAt(0.5 / (ZONES.length - 1)); // halfway into first segment
    const a = ZONES[0].cameraPos, b = ZONES[1].cameraPos;
    expect(mid.pos[2]).toBeCloseTo((a[2] + b[2]) / 2, 5);
  });
  it("maps progress to nearest zone index", () => {
    expect(zoneIndexAt(0)).toBe(0);
    expect(zoneIndexAt(1)).toBe(ZONES.length - 1);
  });
});
