import { describe, expect, it } from "vitest";
import { buildFts5Query, normalizePersianText } from "../src/index.js";

describe("FTS5 Persian & Arabic Text Normalizer", () => {
  it("should normalize Arabic Yeh (ي) to Persian Yeh (ی)", () => {
    expect(normalizePersianText("علي")).toBe("علی");
  });

  it("should normalize Arabic Kaf (ك) to Persian Keheh (ک)", () => {
    expect(normalizePersianText("كتاب")).toBe("کتاب");
  });

  it("should remove Arabic Tashkeel / Harakat", () => {
    expect(normalizePersianText("مُعَلِّم")).toBe("معلم");
  });

  it("should normalize ZWNJ for search tokens", () => {
    // "می‌روم" -> "میروم" so that searches without ZWNJ match entries with ZWNJ
    expect(normalizePersianText("می‌روم")).toBe("میروم");
  });

  it("should construct valid SQLite FTS5 prefix match queries", () => {
    const ftsQuery = buildFts5Query("طراحی مسیر شغلی");
    expect(ftsQuery).toBe('"طراحی"* "مسیر"* "شغلی"*');
  });
});
