import { describe, expect, it } from "vitest";
import { ODYSSEY_THEMES } from "../src/index.js";

/**
 * Machine-checked WCAG 2.1 AA contract for the Atelier palette.
 * Text pairs must reach 4.5:1; UI boundaries and focus rings must reach 3:1.
 */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe.each(Object.entries({ light: ODYSSEY_THEMES.light, dark: ODYSSEY_THEMES.dark }))(
  "Atelier contrast (%s)",
  (_name, theme) => {
    const backgrounds = [theme.canvas, theme.surface, theme.subtle] as const;

    it("keeps primary ink readable on every surface", () => {
      for (const bg of backgrounds) {
        expect(ratio(theme.inkPrimary, bg)).toBeGreaterThanOrEqual(4.5);
        expect(ratio(theme.inkSecondary, bg)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("keeps muted meta text readable (AA small text)", () => {
      for (const bg of backgrounds) {
        expect(ratio(theme.inkMuted, bg)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("keeps accent text readable on paper and on soft accent", () => {
      expect(ratio(theme.accent, theme.canvas)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(theme.accent, theme.surface)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(theme.accent, theme.accentSoft)).toBeGreaterThanOrEqual(4.5);
    });

    it("keeps label text readable on the accent fill", () => {
      expect(ratio(theme.onAccent, theme.accent)).toBeGreaterThanOrEqual(4.5);
    });

    it("keeps semantic data hues readable on surface", () => {
      for (const hue of Object.values(theme.signals)) {
        expect(ratio(hue, theme.surface)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("keeps focus/strong rules above the 3:1 UI threshold", () => {
      expect(ratio(theme.borderStrong, theme.surface)).toBeGreaterThanOrEqual(3);
      expect(ratio(theme.borderStrong, theme.canvas)).toBeGreaterThanOrEqual(3);
      expect(ratio(theme.ring, theme.canvas)).toBeGreaterThanOrEqual(3);
    });

    it("keeps hairline rules subtle but present", () => {
      const r = ratio(theme.borderSubtle, theme.surface);
      expect(r).toBeGreaterThan(1.15);
      expect(r).toBeLessThan(3);
    });
  },
);
