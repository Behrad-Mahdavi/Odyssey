import { describe, expect, it } from "vitest";
import { CompassEntry } from "../src/index.js";

describe("Compass Studio Domain Entity (F-007 / INV-03)", () => {
  it("should create CompassEntry with word counts", () => {
    const entry = CompassEntry.create({
      cycleId: "cycle-1",
      workview: "کار برای من ابزار خلق ارزش و معنا در جهان واقعی است.",
      lifeview: "زندگی پیوسته در حال شکل‌گیری است و غایت آن خدمت به دیگران و شکوفایی است.",
      coherenceComplement: "کارم مستقیماً در راستای شکوفایی دیگران است.",
      coherenceConflict: "گاهی کمبود وقت به استراحت و تفکر آسیب می‌زند.",
      coherenceGuide: "پروژه‌هایی را انتخاب می‌کنم که با ارزش‌های بنیادینم هم‌راستا باشند.",
    });

    expect(entry.workviewWordCount).toBeGreaterThan(0);
    expect(entry.lifeviewWordCount).toBeGreaterThan(0);
    expect(entry.hasMinimumReflectionDepth(250)).toBe(false); // short reflection
    expect(entry.coherenceComplement).toBe("کارم مستقیماً در راستای شکوفایی دیگران است.");
  });

  it("should detect when reflection achieves 250 words minimum depth", () => {
    // Generate 250 words
    const essay = Array(250).fill("کلمه").join(" ");
    const entry = CompassEntry.create({
      cycleId: "cycle-1",
      workview: essay,
      lifeview: essay,
    });

    expect(entry.workviewWordCount).toBe(250);
    expect(entry.lifeviewWordCount).toBe(250);
    expect(entry.hasMinimumReflectionDepth(250)).toBe(true);
  });

  it("should update views and coherence immutably", () => {
    const entry = CompassEntry.create({
      cycleId: "cycle-1",
      workview: "دیدگاه اولیه",
      lifeview: "دیدگاه اولیه",
    });

    const updated = entry.updateViews("دیدگاه بازنگری‌شده کار", "دیدگاه بازنگری‌شده زندگی");
    expect(updated.workview).toBe("دیدگاه بازنگری‌شده کار");
    expect(updated.id).toBe(entry.id);
    expect(updated.updatedAt).toBeGreaterThanOrEqual(entry.updatedAt);
  });
});
