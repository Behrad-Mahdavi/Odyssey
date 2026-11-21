import { describe, expect, it } from "vitest";
import {
  ODYSSEY_COLORS,
  ODYSSEY_THEMES,
  ODYSSEY_TYPOGRAPHY,
  containsPhysicalCss,
} from "../src/index.js";

describe("UI Tokens & Design System Specification (DS.md)", () => {
  it("should configure dual themes (Archival Paper & Copperplate Void)", () => {
    expect(ODYSSEY_THEMES.light.canvas).toBe("#F6F5F0");
    expect(ODYSSEY_THEMES.dark.canvas).toBe("#090B0E");
  });

  it("should configure path signals for the 3 Odyssey plans", () => {
    expect(ODYSSEY_COLORS.odysseyPlans.life1).toBe("#1F4E78");
    expect(ODYSSEY_COLORS.odysseyPlans.life2).toBe("#2E6B5E");
    expect(ODYSSEY_COLORS.odysseyPlans.life3).toBe("#8C4A27");
  });

  it("should specify Estedad Variable as primary sans font", () => {
    expect(ODYSSEY_TYPOGRAPHY.fontFamily.sans).toContain("Estedad");
    expect(ODYSSEY_TYPOGRAPHY.fontFamily.mono).toContain("JetBrains Mono");
  });

  it("should detect and block forbidden physical CSS classes", () => {
    expect(containsPhysicalCss("flex items-center ml-4")).toBe(true);
    expect(containsPhysicalCss("p-2 text-left text-slate-800")).toBe(true);
    expect(containsPhysicalCss("flex items-center ms-4 ps-2 text-start")).toBe(false);
  });
});
