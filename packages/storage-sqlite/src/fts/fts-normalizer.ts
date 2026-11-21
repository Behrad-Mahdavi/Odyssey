/**
 * Persian and Arabic text normalizer for FTS5 full-text search.
 * Normalizes 'ی'/'ي', 'ک'/'ك', removes Arabic diacritics (tashkeel),
 * and standardizes Zero-Width Non-Joiner (ZWNJ / \u200c).
 */

export function normalizePersianText(text: string): string {
  if (!text) return "";

  return (
    text
      .normalize("NFC")
      // Arabic Yeh to Persian Yeh
      .replace(/\u064A/g, "\u06CC")
      // Arabic Kaf to Persian Keheh
      .replace(/\u0643/g, "\u06A9")
      // Arabic Tashkeel / Harakat (diacritics)
      .replace(/[\u064B-\u065F\u0670]/g, "")
      // Arabic Tatweel / Kashida
      .replace(/\u0640/g, "")
      // Remove or normalize ZWNJ for search tokens
      // We replace ZWNJ with empty string so "می‌روم" matches "میروم" and "می‌روم"
      .replace(/\u200C/g, "")
      .toLowerCase()
      .trim()
  );
}

/**
 * Tokenizes search query into normalized terms for SQLite FTS5 MATCH clause.
 */
export function buildFts5Query(rawQuery: string): string {
  const normalized = normalizePersianText(rawQuery);
  const terms = normalized
    .split(/[\s\p{P}]+/u)
    .filter((t) => t.length > 0)
    .map((term) => `"${term}"*`);

  return terms.join(" ");
}
