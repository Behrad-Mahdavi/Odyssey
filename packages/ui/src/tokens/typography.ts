/**
 * Odyssey Design System 2.0 — "Atelier"
 * One family (Estedad Variable) carries both scripts; hierarchy comes from
 * weight, size and measure — never from colour alone.
 */

export const ODYSSEY_TYPOGRAPHY = {
  fontFamily: {
    sans: "Estedad, ui-sans-serif, system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  },
  variable: {
    family: "Estedad",
    weightRange: [100, 900] as const,
    source: "https://fonts.google.com/specimen/Estedad",
    license: "SIL Open Font License 1.1",
    selfHostedPath: "packages/ui/src/fonts/estedad-variable.woff2",
  },
  /** Persian needs roughly +0.15 of leading compared to Latin. */
  readingLineHeight: {
    fa: 1.8,
    en: 1.65,
  },
  measure: {
    editor: "66ch",
    prose: "68ch",
  },
  scale: {
    display: {
      size: "2.5rem",
      weight: "700",
      lineHeightFa: 1.34,
      lineHeightEn: 1.2,
      trackingEn: "-0.02em",
      trackingFa: "0",
    },
    h1: {
      size: "1.75rem",
      weight: "650",
      lineHeightFa: 1.45,
      lineHeightEn: 1.3,
      trackingEn: "-0.015em",
      trackingFa: "0",
    },
    h2: {
      size: "1.25rem",
      weight: "600",
      lineHeightFa: 1.5,
      lineHeightEn: 1.35,
      trackingEn: "-0.01em",
      trackingFa: "0",
    },
    h3: {
      size: "1rem",
      weight: "600",
      lineHeightFa: 1.6,
      lineHeightEn: 1.45,
      trackingEn: "0",
      trackingFa: "0",
    },
    body: {
      size: "0.9375rem",
      weight: "400",
      lineHeightFa: 1.8,
      lineHeightEn: 1.65,
      trackingEn: "0",
      trackingFa: "0",
    },
    editor: {
      size: "1rem",
      weight: "400",
      lineHeightFa: 1.85,
      lineHeightEn: 1.7,
      trackingEn: "0",
      trackingFa: "0",
    },
    ui: {
      size: "0.8125rem",
      weight: "500",
      lineHeightFa: 1.55,
      lineHeightEn: 1.45,
      trackingEn: "0",
      trackingFa: "0",
    },
    micro: {
      size: "0.71875rem",
      weight: "500",
      lineHeightFa: 1.5,
      lineHeightEn: 1.4,
      trackingEn: "0.08em",
      trackingFa: "0",
    },
    data: {
      size: "0.8125rem",
      weight: "600",
      lineHeightFa: 1.3,
      lineHeightEn: 1.2,
      trackingEn: "0",
      trackingFa: "0",
    },
  },
} as const;
