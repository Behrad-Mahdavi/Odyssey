#!/usr/bin/env node
/**
 * Zero-Telemetry Audit Script
 * Verifies that the codebase contains zero references to remote analytics,
 * external font CDNs, trackers, or non-user-approved network endpoints.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN_PATTERNS = [
  /fonts\.googleapis\.com/i,
  /fonts\.gstatic\.com/i,
  /cdn\.jsdelivr\.net/i,
  /unpkg\.com/i,
  /cdnjs\.cloudflare\.com/i,
  /google-analytics\.com/i,
  /googletagmanager\.com/i,
  /segment\.io/i,
  /sentry\.io/i,
  /mixpanel\.com/i,
  /amplitude\.com/i,
  /telemetry/i,
];

const SCAN_DIRS = ["packages", "apps"];
const IGNORE_DIRS = ["node_modules", "dist", ".turbo", "coverage"];
const IGNORE_FILES = ["audit-zero-telemetry.mjs"];

let violations = 0;

function scanDir(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx|html|css|json)$/.test(entry)) {
      if (IGNORE_FILES.includes(entry)) continue;
      const content = readFileSync(fullPath, "utf-8");
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(content)) {
          console.error(
            `[ZERO-TELEMETRY VIOLATION] ${fullPath} matches forbidden pattern: ${pattern}`,
          );
          violations++;
        }
      }
    }
  }
}

console.log("Checking zero-telemetry and privacy guardrails...");
for (const dir of SCAN_DIRS) {
  scanDir(dir);
}

if (violations > 0) {
  console.error(
    `Found ${violations} privacy / zero-telemetry violations. Remote endpoints & CDNs are prohibited.`,
  );
  process.exit(1);
} else {
  console.log("✔ Zero-telemetry audit passed: 0 remote trackers, CDNs, or telemetry calls found.");
}
