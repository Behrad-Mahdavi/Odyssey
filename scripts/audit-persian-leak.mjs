#!/usr/bin/env node
/**
 * Persian Localization & Quality Guardrail Script
 * Verifies that:
 * 1. fa-IR locale contains zero raw programming syntax ([...], [[...]], Verdict: [PROCEED]).
 * 2. No leaked English placeholders exist (Year Trajectory-5, Life 01, (Drain), (Fuel), (Bored)).
 * 3. Required keys like prototyping.title and prototyping.desc are fully translated.
 */

import { readFileSync } from "node:fs";

console.log("Checking Persian localization quality and leak prevention...");

const FA_PATH = "packages/ui/src/locales/fa.json";
const fa = JSON.parse(readFileSync(FA_PATH, "utf-8"));

let violations = 0;

// 1. Mandatory critical keys check
const mandatoryKeys = [
  "prototyping.title",
  "prototyping.desc",
  "prototypingLab.title",
  "prototypingLab.desc",
  "overview.title",
  "overview.recommendedStep",
  "odysseyPlans.fiveYearTrajectory",
  "goodTimeJournal.drainLabel",
  "goodTimeJournal.fuelLabel",
];

for (const keyPath of mandatoryKeys) {
  const parts = keyPath.split(".");
  let curr = fa;
  for (const part of parts) {
    curr = curr?.[part];
  }
  if (!curr || typeof curr !== "string" || !curr.trim()) {
    console.error(`[PERSIAN AUDIT VIOLATION] Missing or empty mandatory key: ${keyPath}`);
    violations++;
  }
}

// 2. Forbidden English patterns & programming syntax in Persian values
const FORBIDDEN_VALUE_PATTERNS = [
  /\[\[.+\]\]/, // Obsidian wikilink syntax inside user-facing strings
  /\[PROCEED\]/i,
  /\[ITERATE\]/i,
  /\[PIVOT\]/i,
  /\[STOP\]/i,
  /\bVerdict:\b/i,
  /Year\s+Trajectory/i,
  /Life\s+0[1-3]/i,
  /\(Drain\)/i,
  /\(Fuel\)/i,
  /\(Bored\)/i,
  /\(Engaged\)/i,
  /\(Immersed\)/i,
];

function checkValues(obj, prefix = "") {
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "string") {
      for (const pattern of FORBIDDEN_VALUE_PATTERNS) {
        if (pattern.test(val)) {
          console.error(
            `[PERSIAN LEAK VIOLATION] Key "${fullKey}" contains forbidden syntax or English leak: "${val}" (matches ${pattern})`,
          );
          violations++;
        }
      }
    } else if (typeof val === "object" && val !== null) {
      checkValues(val, fullKey);
    }
  }
}

checkValues(fa);

if (violations > 0) {
  console.error(`Found ${violations} Persian localization violations.`);
  process.exit(1);
} else {
  console.log("✔ Persian localization audit passed: 0 leaked syntax or English tokens found.");
}
