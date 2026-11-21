#!/usr/bin/env node
/**
 * i18n Parity Audit Script
 * Ensures complete parity between fa-IR and en-US localization keys.
 */

import { existsSync, readFileSync } from "node:fs";

console.log("Checking i18n key parity between fa-IR and en-US...");

const FA_PATH = "packages/ui/src/locales/fa.json";
const EN_PATH = "packages/ui/src/locales/en.json";

if (!existsSync(FA_PATH) || !existsSync(EN_PATH)) {
  console.log("✔ Locale files not yet present or will be verified when created in F-004.");
  process.exit(0);
}

function getKeys(obj, prefix = "") {
  return Object.keys(obj).flatMap((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    return typeof obj[key] === "object" && obj[key] !== null
      ? getKeys(obj[key], fullKey)
      : [fullKey];
  });
}

try {
  const fa = JSON.parse(readFileSync(FA_PATH, "utf-8"));
  const en = JSON.parse(readFileSync(EN_PATH, "utf-8"));

  const faKeys = new Set(getKeys(fa));
  const enKeys = new Set(getKeys(en));

  const missingInEn = [...faKeys].filter((k) => !enKeys.has(k));
  const missingInFa = [...enKeys].filter((k) => !faKeys.has(k));

  if (missingInEn.length > 0 || missingInFa.length > 0) {
    if (missingInEn.length > 0) {
      console.error(`Keys present in fa-IR but missing in en-US:\n${missingInEn.join("\n")}`);
    }
    if (missingInFa.length > 0) {
      console.error(`Keys present in en-US but missing in fa-IR:\n${missingInFa.join("\n")}`);
    }
    process.exit(1);
  }

  console.log(`✔ i18n parity check passed (${faKeys.size} keys verified).`);
} catch (err) {
  console.error("Failed to parse locale JSON:", err.message);
  process.exit(1);
}
