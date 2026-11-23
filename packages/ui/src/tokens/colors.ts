/**
 * Odyssey Design System 2.0 — "Atelier"
 * High-Contrast Monochrome Editorial & Architectural Drafting Palette.
 * Canvas: #FAF9F6 | Surface: #FFFFFF | Primary Ink: #111111 | Muted: #57534E
 * Dark Canvas: #0E0E0D | Dark Surface: #161614 | Border: #2A2926 | Ink: #F4F3EE
 * Verified against WCAG 2.1 AA in tests/contrast.test.ts.
 */

export const ODYSSEY_THEMES = {
  light: {
    name: "Archival Paper",
    canvas: "#FAF9F6",
    surface: "#FFFFFF",
    subtle: "#F2EFE9",
    inverted: "#111111",
    inkPrimary: "#111111",
    inkSecondary: "#57534E",
    inkMuted: "#57534E",
    borderSubtle: "#E5E3DC",
    borderStrong: "#111111",
    accent: "#111111",
    accentHover: "#2A2926",
    accentSoft: "#EFECE6",
    onAccent: "#FAF9F6",
    ring: "#111111",
    signals: {
      positive: "#2C6E4E",
      negative: "#A8382C",
      amber: "#8A5A10",
      path1: "#2E5E8C",
      path2: "#2F6B57",
      path3: "#9C4F26",
      gravityMuted: "#57534E",
    },
  },
  dark: {
    name: "Drafting Charcoal",
    canvas: "#0E0E0D",
    surface: "#161614",
    subtle: "#1E1E1B",
    inverted: "#F4F3EE",
    inkPrimary: "#F4F3EE",
    inkSecondary: "#A8A29E",
    inkMuted: "#A8A29E",
    borderSubtle: "#2A2926",
    borderStrong: "#6B7484",
    accent: "#F4F3EE",
    accentHover: "#E5E3DC",
    accentSoft: "#252422",
    onAccent: "#0E0E0D",
    ring: "#F4F3EE",
    signals: {
      positive: "#62C79A",
      negative: "#F08A7C",
      amber: "#E8B45C",
      path1: "#7FA9D6",
      path2: "#6FC2A6",
      path3: "#E0A171",
      gravityMuted: "#A8A29E",
    },
  },
} as const;

export const ODYSSEY_COLORS = {
  accent: ODYSSEY_THEMES.light.accent,
  odysseyPlans: {
    life1: ODYSSEY_THEMES.light.signals.path1,
    life2: ODYSSEY_THEMES.light.signals.path2,
    life3: ODYSSEY_THEMES.light.signals.path3,
  },
  energy: {
    positive: ODYSSEY_THEMES.light.signals.positive,
    neutral: ODYSSEY_THEMES.light.inkSecondary,
    depleting: ODYSSEY_THEMES.light.signals.negative,
  },
  vault: {
    locked: ODYSSEY_THEMES.light.signals.negative,
    unlocked: ODYSSEY_THEMES.light.signals.positive,
    offlineNotice: ODYSSEY_THEMES.light.signals.path1,
  },
} as const;
