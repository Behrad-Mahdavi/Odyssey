import { describe, expect, it } from "vitest";
import {
  ODYSSEY_COLORS,
  ODYSSEY_THEMES,
  ODYSSEY_TYPOGRAPHY,
  containsPhysicalCss,
} from "../src/index.js";

describe("Design System 2.0 — Atelier tokens (DS.md)", () => {
  it("should expose the Archival Paper and Drafting Charcoal themes", () => {
    expect(ODYSSEY_THEMES.light.name).toBe("Archival Paper");
    expect(ODYSSEY_THEMES.light.canvas).toBe("#FAF9F6");
    expect(ODYSSEY_THEMES.light.surface).toBe("#FFFFFF");
    expect(ODYSSEY_THEMES.light.inkPrimary).toBe("#111111");
    expect(ODYSSEY_THEMES.light.inkSecondary).toBe("#57534E");
    expect(ODYSSEY_THEMES.dark.name).toBe("Drafting Charcoal");
    expect(ODYSSEY_THEMES.dark.canvas).toBe("#0E0E0D");
    expect(ODYSSEY_THEMES.dark.surface).toBe("#161614");
    expect(ODYSSEY_THEMES.dark.inkPrimary).toBe("#F4F3EE");
  });

  it("should configure controlled monochrome editorial ink accent", () => {
    expect(ODYSSEY_THEMES.light.accent).toBe("#111111");
    expect(ODYSSEY_THEMES.dark.accent).toBe("#F4F3EE");
    expect(ODYSSEY_COLORS.accent).toBe(ODYSSEY_THEMES.light.accent);
  });

  it("should configure the three Odyssey path pigments", () => {
    expect(ODYSSEY_COLORS.odysseyPlans.life1).toBe("#2E5E8C");
    expect(ODYSSEY_COLORS.odysseyPlans.life2).toBe("#2F6B57");
    expect(ODYSSEY_COLORS.odysseyPlans.life3).toBe("#9C4F26");
  });

  it("should self-host one variable family covering Persian and Latin", () => {
    expect(ODYSSEY_TYPOGRAPHY.fontFamily.sans).toContain("Estedad");
    expect(ODYSSEY_TYPOGRAPHY.fontFamily.mono).toContain("ui-monospace");
    expect(ODYSSEY_TYPOGRAPHY.variable.weightRange).toEqual([100, 900]);
    expect(ODYSSEY_TYPOGRAPHY.variable.source).toContain("fonts.google.com/specimen/Estedad");
    expect(ODYSSEY_TYPOGRAPHY.variable.license).toContain("Open Font License");
  });

  it("should keep Persian leading looser than Latin", () => {
    expect(ODYSSEY_TYPOGRAPHY.readingLineHeight.fa).toBeGreaterThan(
      ODYSSEY_TYPOGRAPHY.readingLineHeight.en,
    );
    for (const role of Object.values(ODYSSEY_TYPOGRAPHY.scale)) {
      expect(role.lineHeightFa).toBeGreaterThan(role.lineHeightEn);
      expect(role.trackingFa).toBe("0");
    }
  });

  it("should detect and block forbidden physical CSS classes", () => {
    expect(containsPhysicalCss("flex items-center ml-4")).toBe(true);
    expect(containsPhysicalCss("p-2 text-left text-slate-800")).toBe(true);
    expect(containsPhysicalCss("flex items-center ms-4 ps-2 text-start")).toBe(false);
  });
});
