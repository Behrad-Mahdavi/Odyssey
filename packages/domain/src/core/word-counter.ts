/**
 * Unicode and Persian/Arabic aware word counter with Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله) support.
 * Essential for Odyssey Title verification (INV-03) and Compass essay counters.
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Normalize Unicode to canonical form
  const normalized = text.normalize("NFC");

  // Replace ZWNJ (\u200C) within compound words with an internal placeholder or join so it counts as 1 word
  // e.g. "می‌خواهم" is 1 word, "کتاب‌ها" is 1 word
  const joinedZwnj = normalized.replace(/([^\s\p{P}])\u200C([^\s\p{P}])/gu, "$1$2");

  // Tokenize using Unicode word boundaries or whitespace
  // Split on any whitespace or structural punctuation
  const words = joinedZwnj
    .trim()
    .split(/[\s\p{Z}\p{C}\r\n\t]+/u)
    .filter((token) => token.replace(/[\p{P}\p{S}]/gu, "").length > 0);

  return words.length;
}
