/**
 * Typography Tokens for Odyssey Studio.
 * Defined in accordance with DS.md (Section 3).
 * Primary: Estedad Variable (Self-Hosted Persian & Latin)
 * Monospace: JetBrains Mono (Technical / Numbers with tabular-nums)
 */

export const ODYSSEY_TYPOGRAPHY = {
  fontFamily: {
    sans: "Estedad, system-ui, -apple-system, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  readingLineHeight: {
    fa: 1.75,
    en: 1.6,
  },
  scale: {
    display: { size: "2rem", weight: "700", lineHeightFa: 1.35, lineHeightEn: 1.15 },
    h1: { size: "1.5rem", weight: "650", lineHeightFa: 1.4, lineHeightEn: 1.2 },
    h2: { size: "1.125rem", weight: "600", lineHeightFa: 1.5, lineHeightEn: 1.3 },
    h3: { size: "0.9375rem", weight: "600", lineHeightFa: 1.55, lineHeightEn: 1.35 },
    body: { size: "0.9375rem", weight: "400", lineHeightFa: 1.75, lineHeightEn: 1.6 },
    ui: { size: "0.8125rem", weight: "500", lineHeightFa: 1.5, lineHeightEn: 1.4 },
    micro: { size: "0.75rem", weight: "500", lineHeightFa: 1.45, lineHeightEn: 1.3 },
    data: { size: "0.875rem", weight: "600", lineHeightFa: 1.2, lineHeightEn: 1.2 },
  },
} as const;
