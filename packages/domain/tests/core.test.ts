import { describe, expect, it } from "vitest";
import { validateRange } from "../src/core/range-validator.js";
import { err, flatMap, isErr, isOk, map, ok, unwrapOr } from "../src/core/result.js";
import { countWords } from "../src/core/word-counter.js";

describe("Domain Core: Result Pattern", () => {
  it("should handle ok values cleanly", () => {
    const res = ok(42);
    expect(isOk(res)).toBe(true);
    expect(isErr(res)).toBe(false);
    expect(unwrapOr(res, 0)).toBe(42);
  });

  it("should handle err values cleanly", () => {
    const res = err(new Error("Failure"));
    expect(isOk(res)).toBe(false);
    expect(isErr(res)).toBe(true);
    expect(unwrapOr(res, 99)).toBe(99);
  });

  it("should support map and flatMap composition", () => {
    const res = ok(10);
    const doubled = map(res, (n) => n * 2);
    expect(unwrapOr(doubled, 0)).toBe(20);

    const chained = flatMap(doubled, (n) => (n > 15 ? ok(`Result: ${n}`) : err("Too small")));
    expect(unwrapOr(chained, "")).toBe("Result: 20");
  });
});

describe("Domain Core: Range Validator (INV-01)", () => {
  it("should validate numbers within [0, 100]", () => {
    const valid = validateRange("health", 75, 0, 100);
    expect(isOk(valid)).toBe(true);
    expect(unwrapOr(valid, -1)).toBe(75);
  });

  it("should reject numbers outside bounds", () => {
    const invalid = validateRange("health", 120, 0, 100);
    expect(isErr(invalid)).toBe(true);
    if (isErr(invalid)) {
      expect(invalid.error.code).toBe("DOMAIN_RANGE_ERROR");
      expect(invalid.error.message).toContain(
        'Field "health" value 120 is outside valid range [0, 100]',
      );
    }
  });

  it("should validate bipolar energy [-100, 100]", () => {
    expect(isOk(validateRange("energy", -50, -100, 100))).toBe(true);
    expect(isOk(validateRange("energy", 100, -100, 100))).toBe(true);
    expect(isErr(validateRange("energy", -101, -100, 100))).toBe(true);
  });
});

describe("Domain Core: Word Counter (INV-03 with ZWNJ)", () => {
  it("should count English words accurately", () => {
    expect(countWords("Designing Your Life with Odyssey")).toBe(5);
    expect(countWords("")).toBe(0);
  });

  it("should count Persian words with ZWNJ (نیم‌فاصله) as single words", () => {
    // "من به دانشگاه می‌روم" -> 4 words ("می‌روم" contains ZWNJ and counts as 1 word)
    const text = "من به دانشگاه می‌روم";
    expect(countWords(text)).toBe(4);

    // Odyssey Six-Word Title test
    const sixWords = "طراحی زندگی من با ابزار ادیسه";
    expect(countWords(sixWords)).toBe(6);
  });
});
