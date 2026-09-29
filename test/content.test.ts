import { describe, it, expect } from "vitest";
import { content, SECTIONS } from "@/lib/content";

describe("content", () => {
  it("has the seven ordered sections", () => {
    expect(SECTIONS).toEqual([
      "hero", "about", "projects", "tech", "experience", "education", "contact",
    ]);
  });
  it("provides identity fields", () => {
    expect(content.name).toBeTruthy();
    expect(content.initials).toMatch(/^[A-Z]{1,3}$/);
    expect(content.email).toContain("@");
  });
  it("every project has a stable id and at least one tech tag", () => {
    for (const p of content.projects) {
      expect(p.id).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });
});
