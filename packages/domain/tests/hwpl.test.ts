import { describe, expect, it } from "vitest";
import { HwplAssessment, LifeProblem } from "../src/index.js";

describe("HWPL Dashboard & Gravity Filter Domain Entities (F-006 / INV-01)", () => {
  it("should create valid HwplAssessment with 0..100 gauge values", () => {
    const assessmentRes = HwplAssessment.create({
      cycleId: "cycle-1",
      health: 80,
      work: 70,
      play: 50,
      love: 85,
      healthNotes: "Great energy and sleep habits",
      workNotes: "Meaningful architectural work",
    });

    expect(assessmentRes.ok).toBe(true);
    if (assessmentRes.ok) {
      expect(assessmentRes.value.health).toBe(80);
      expect(assessmentRes.value.work).toBe(70);
      expect(assessmentRes.value.play).toBe(50);
      expect(assessmentRes.value.love).toBe(85);
      expect(assessmentRes.value.healthNotes).toBe("Great energy and sleep habits");
    }
  });

  it("should enforce INV-01 and reject gauges out of range (>100 or <0)", () => {
    const invalidHigh = HwplAssessment.create({
      cycleId: "cycle-1",
      health: 120, // Invalid!
      work: 70,
      play: 50,
      love: 85,
    });
    expect(invalidHigh.ok).toBe(false);
    if (!invalidHigh.ok) {
      expect(invalidHigh.error.fieldName).toBe("health");
      expect(invalidHigh.error.value).toBe(120);
    }

    const invalidLow = HwplAssessment.create({
      cycleId: "cycle-1",
      health: 50,
      work: -10, // Invalid!
      play: 50,
      love: 85,
    });
    expect(invalidLow.ok).toBe(false);
    if (!invalidLow.ok) {
      expect(invalidLow.error.fieldName).toBe("work");
      expect(invalidLow.error.value).toBe(-10);
    }
  });

  it("should manage LifeProblem lifecycle and gravity filtering", () => {
    const problem = LifeProblem.create(
      "cycle-1",
      "قوانین مالیاتی شرکت غیرقابل تغییر است",
      "DESIGNABLE",
    );
    expect(problem.isGravity).toBe(false);

    const gravityProblem = problem.markAsGravity("باید واقعیت قانون مالیات را پذیرفت");
    expect(gravityProblem.isGravity).toBe(true);
    expect(gravityProblem.classification).toBe("GRAVITY");
    expect(gravityProblem.anchorStatement).toBe("باید واقعیت قانون مالیات را پذیرفت");

    const designableAgain = gravityProblem.markAsDesignable("چگونه بودجه را بهینه کنیم؟");
    expect(designableAgain.isGravity).toBe(false);
    expect(designableAgain.reframedQuestion).toBe("چگونه بودجه را بهینه کنیم؟");
  });
});
