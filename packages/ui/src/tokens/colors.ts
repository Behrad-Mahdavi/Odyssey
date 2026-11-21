/**
 * Semantic Design Tokens for Odyssey Studio.
 * Designed for calm drafting studio aesthetics — strictly functional and non-noisy.
 */
export const ODYSSEY_COLORS = {
  canvas: {
    base: "#F8F9FA",
    paper: "#FFFFFF",
    blueprint: "#0F172A",
    subtle: "#F1F5F9",
  },
  ink: {
    primary: "#0F172A",
    secondary: "#475569",
    muted: "#94A3B8",
    faint: "#CBD5E1",
  },
  // Functional semantic colors for Odyssey plans & Gauges
  odysseyPlans: {
    life1: "#2563EB", // Blue for Life 1 (Current progression)
    life2: "#D97706", // Amber for Life 2 (Alternative scenario)
    life3: "#059669", // Emerald for Life 3 (Wild Card)
  },
  energy: {
    positive: "#10B981", // Green for energizing
    neutral: "#64748B", // Slate for neutral
    depleting: "#F43F5E", // Rose for draining
  },
  vault: {
    locked: "#E11D48",
    unlocked: "#059669",
    offlineNotice: "#0284C7",
  },
} as const;
