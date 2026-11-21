/**
 * Precision Archival Drafting Studio Design Tokens for Odyssey.
 * Defined in accordance with DS.md (Section 2).
 */

export const ODYSSEY_THEMES = {
  light: {
    name: "Archival Paper",
    canvas: "#F6F5F0",
    surface: "#FCFBF8",
    subtle: "#ECEAE2",
    inverted: "#111317",
    inkPrimary: "#111317",
    inkSecondary: "#4A4D52",
    inkMuted: "#7A7D82",
    borderSubtle: "#DFDDD4",
    borderStrong: "#111317",
    signals: {
      positive: "#1D6B4B",
      negative: "#A63228",
      amber: "#9E6312",
      path1: "#1F4E78",
      path2: "#2E6B5E",
      path3: "#8C4A27",
      gravityMuted: "#6B6E75",
    },
  },
  dark: {
    name: "Copperplate Void",
    canvas: "#090B0E",
    surface: "#101318",
    subtle: "#171B22",
    inverted: "#F3F2EC",
    inkPrimary: "#F3F2EC",
    inkSecondary: "#9CA3AF",
    inkMuted: "#636973",
    borderSubtle: "#222730",
    borderStrong: "#454D5B",
    signals: {
      positive: "#3EB483",
      negative: "#E06358",
      amber: "#E0A442",
      path1: "#5B9BD5",
      path2: "#4FB09B",
      path3: "#D9885B",
      gravityMuted: "#525864",
    },
  },
} as const;

export const ODYSSEY_COLORS = {
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
