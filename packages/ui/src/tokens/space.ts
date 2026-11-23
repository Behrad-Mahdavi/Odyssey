/**
 * Odyssey Design System 2.0 — "Atelier"
 * Spatial grid, radii, motion and layout constants.
 * Everything is a multiple of 4px; radii never exceed 6px on containers.
 */

export const ODYSSEY_SPACE = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "32px",
  8: "40px",
  9: "48px",
  10: "64px",
  11: "80px",
  12: "96px",
} as const;

export const ODYSSEY_RADIUS = {
  none: "0px",
  xs: "2px",
  sm: "3px",
  md: "6px",
  pill: "999px",
} as const;

export const ODYSSEY_STROKE = {
  hairline: "1px",
  structural: "2px",
  print: "0.75pt",
} as const;

export const ODYSSEY_MOTION = {
  curve: "cubic-bezier(0.2, 0, 0, 1)",
  micro: "90ms",
  panel: "160ms",
  ritual: "240ms",
  reducedMotion: "prefers-reduced-motion: reduce",
} as const;

export const ODYSSEY_LAYOUT = {
  container: "76rem",
  measure: "66ch",
  rail: "11rem",
  gutter: "clamp(1rem, 3vw, 2rem)",
  grid: 12,
} as const;

export const ODYSSEY_Z = {
  rail: 10,
  overlay: 40,
  dialog: 50,
  toast: 60,
} as const;
