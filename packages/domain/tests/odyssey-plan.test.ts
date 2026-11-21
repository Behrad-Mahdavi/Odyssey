import { describe, expect, it } from "vitest";
import {
  DomainRangeError,
  OdysseyFeedback,
  OdysseyPlan,
  WordCountInvariantError,
} from "../src/index.js";

describe("Odyssey Plans Domain Invariants (F-009)", () => {
  describe("INV-01: Four calibrated gauges (0..100)", () => {
    it("should create plan with valid gauges and default questions", () => {
      const planRes = OdysseyPlan.create({
        cycleId: "cycle-1",
        slot: "LIFE_1",
        sixWordTitle: "توسعه معماری سیستم و رهبری مهندسی",
        resources: 80,
        likability: 85,
        confidence: 75,
        coherence: 90,
      });

      expect(planRes.ok).toBe(true);
      if (!planRes.ok) return;

      expect(planRes.value.slot).toBe("LIFE_1");
      expect(planRes.value.resources).toBe(80);
      expect(planRes.value.likability).toBe(85);
      expect(planRes.value.confidence).toBe(75);
      expect(planRes.value.coherence).toBe(90);
      expect(planRes.value.questions.length).toBe(3);
    });

    it("should reject gauges outside 0..100 with DomainRangeError", () => {
      const invalidRes = OdysseyPlan.create({
        cycleId: "cycle-1",
        slot: "LIFE_2",
        resources: 105,
      });

      expect(invalidRes.ok).toBe(false);
      if (invalidRes.ok) return;
      expect(invalidRes.error).toBeInstanceOf(DomainRangeError);
    });
  });

  describe("INV-02: Exactly 3 Question Slots", () => {
    it("should reject questions array not matching 3 slots", () => {
      const invalidQuestions = OdysseyPlan.create({
        cycleId: "cycle-1",
        slot: "LIFE_1",
        // @ts-expect-error - testing invalid questions length
        questions: ["تنها یک سؤال"],
      });

      expect(invalidQuestions.ok).toBe(false);
      if (invalidQuestions.ok) return;
      expect(invalidQuestions.error.code).toBe("DOMAIN_INVARIANT_VIOLATION");
    });
  });

  describe("INV-03: Six-Word Title & Finalization", () => {
    it("should count Persian words with ZWNJ correctly", () => {
      const planRes = OdysseyPlan.create({
        cycleId: "cycle-1",
        slot: "LIFE_1",
        sixWordTitle: "توسعه معماری سیستم و رهبری مهندسی", // Exactly 6 words
      });

      expect(planRes.ok).toBe(true);
      if (!planRes.ok) return;
      expect(planRes.value.titleWordCount).toBe(6);

      const finalized = planRes.value.finalize();
      expect(finalized.ok).toBe(true);
      if (finalized.ok) {
        expect(finalized.value.isFinalized).toBe(true);
      }
    });

    it("should reject finalization if title exceeds 6 words (INV-03)", () => {
      const planRes = OdysseyPlan.create({
        cycleId: "cycle-1",
        slot: "LIFE_3",
        sixWordTitle: "یک دو سه چهار پنج شش هفت کلمه اضافه", // 8 words
      });

      expect(planRes.ok).toBe(true);
      if (!planRes.ok) return;

      const finalized = planRes.value.finalize();
      expect(finalized.ok).toBe(false);
      if (finalized.ok) return;
      expect(finalized.error).toBeInstanceOf(WordCountInvariantError);
      expect(finalized.error.maxWords).toBe(6);
    });
  });

  describe("OdysseyFeedback (Criteria 5)", () => {
    it("should create valid feedback with dual fields for external and presenter energy", () => {
      const feedbackRes = OdysseyFeedback.create({
        cycleId: "cycle-1",
        odysseyPlanId: "plan-123",
        externalFeedback: "پیشنهاد شد برای تست سریع، ۲ ساعت مشاوره داوطلبانه ارائه شود.",
        presenterEnergyNote: "هنگام توضیح سال ۳ حس آرامش و انگیزه بسیار بالایی داشتم.",
      });

      expect(feedbackRes.ok).toBe(true);
      if (!feedbackRes.ok) return;
      expect(feedbackRes.value.externalFeedback).toContain("مشاوره داوطلبانه");
      expect(feedbackRes.value.presenterEnergyNote).toContain("آرامش و انگیزه");
    });
  });
});
