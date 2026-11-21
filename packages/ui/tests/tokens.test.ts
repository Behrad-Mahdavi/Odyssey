import { describe, expect, it } from "vitest";
import { ODYSSEY_COLORS, ODYSSEY_TYPOGRAPHY, containsPhysicalCss } from "../src/index.js";

describe("UI Tokens & Logical CSS Guardrails", () => {
  it("should provide well-defined semantic colors for the 3 Odyssey plans", () => {
    expect(ODYSSEY_COLORS.odysseyPlans.life1).toBe("#2563EB");
    expect(ODYSSEY_COLORS.odysseyPlans.life2).toBe("#D97706");
    expect(ODYSSEY_COLORS.odysseyPlans.life3).toBe("#059669");
  });

  it("should configure dual typography with Vazirmatn and Inter", () => {
    expect(ODYSSEY_TYPOGRAPHY.fontFamily.fa).toContain("Vazirmatn");
    expect(ODYSSEY_TYPOGRAPHY.fontFamily.en).toContain("Inter");
  });

  it("should detect forbidden physical CSS classes", () => {
    expect(containsPhysicalCss("flex items-center ml-4")).toBe(true);
    expect(containsPhysicalCss("p-2 text-left text-slate-800")).toBe(true);
    expect(containsPhysicalCss("flex items-center ms-4 ps-2 text-start")).toBe(false);
  });
});
