#!/usr/bin/env node
/**
 * Logical CSS Audit Script
 * Enforces CSS Logical Properties across packages/ui and apps/*.
 * Prohibits physical direction classes: ml-, mr-, pl-, pr-, left-, right-, text-left, text-right.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN_CLASSES = [
  /\bml-[0-9a-z_\[\]]+/g,
  /\bmr-[0-9a-z_\[\]]+/g,
  /\bpl-[0-9a-z_\[\]]+/g,
  /\bpr-[0-9a-z_\[\]]+/g,
  /\bleft-[0-9a-z_\[\]]+/g,
  /\bright-[0-9a-z_\[\]]+/g,
  /\btext-left\b/g,
  /\btext-right\b/g,
];

const SCAN_DIRS = ["packages/ui", "apps/web"];
const IGNORE_DIRS = ["node_modules", "dist", ".turbo", "coverage", "tests"];

let violations = 0;

function scanDir(dir) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (IGNORE_DIRS.includes(entry)) continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile() && /\.(tsx|jsx|html|css)$/.test(entry)) {
        const content = readFileSync(fullPath, "utf-8");
        for (const regex of FORBIDDEN_CLASSES) {
          const matches = content.match(regex);
          if (matches) {
            console.error(
              `[LOGICAL CSS VIOLATION] ${fullPath} contains physical CSS: ${matches.join(", ")}`,
            );
            console.error(
              "  -> Use logical equivalents: ms-, me-, ps-, pe-, start-, end-, text-start, text-end.",
            );
            violations++;
          }
        }
      }
    }
  } catch (_e) {
    // Directory might not exist yet
  }
}

console.log("Checking CSS logical property guardrails...");
for (const dir of SCAN_DIRS) {
  scanDir(dir);
}

if (violations > 0) {
  console.error(
    `Found ${violations} physical CSS violations. Odyssey requires 100% Logical CSS for bidirectional RTL/LTR support.`,
  );
  process.exit(1);
} else {
  console.log("✔ Logical CSS audit passed: 0 physical CSS classes found.");
}
