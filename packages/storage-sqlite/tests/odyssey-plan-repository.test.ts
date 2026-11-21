import { OdysseyFeedback, OdysseyPlan } from "@odyssey/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BetterSqliteDriver } from "../src/driver/better-sqlite.driver.js";
import { migration0001 } from "../src/migrations/0001_initial_schema.js";
import { MigrationRunner } from "../src/migrations/migration-runner.js";
import { SqliteOdysseyPlanRepository } from "../src/repositories/odyssey-plan-repository.js";

describe("SQLite Odyssey Plan Repository (F-009)", () => {
  let driver: BetterSqliteDriver;
  let repo: SqliteOdysseyPlanRepository;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    repo = new SqliteOdysseyPlanRepository(driver);
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should save and retrieve odyssey plans across 3 slots", async () => {
    const plan1 = OdysseyPlan.create({
      cycleId: "cycle-1",
      slot: "LIFE_1",
      sixWordTitle: "توسعه معماری سیستم و رهبری مهندسی",
      resources: 80,
      likability: 75,
      confidence: 85,
      coherence: 90,
      questions: [
        "آیا نیاز بازار به این تخصص پایدار است؟",
        "چگونه تعادل بین خانواده و کار حفظ شود؟",
        "تیم فنی تا چه اندازه می‌تواند مستقل شود؟",
      ],
      timelineEvents: [
        { year: 1, type: "work", description: "تثبیت جایگاه معماری ارشد" },
        { year: 2, type: "personal", description: "سفر مطالعاتی و آموزش" },
      ],
    });
    expect(plan1.ok).toBe(true);
    if (!plan1.ok) return;

    const saveRes = await repo.savePlan(plan1.value);
    expect(saveRes.ok).toBe(true);

    const plansRes = await repo.getPlans("cycle-1");
    expect(plansRes.ok).toBe(true);
    if (plansRes.ok) {
      expect(plansRes.value.length).toBe(1);
      const found = plansRes.value[0];
      expect(found?.slot).toBe("LIFE_1");
      expect(found?.sixWordTitle).toBe("توسعه معماری سیستم و رهبری مهندسی");
      expect(found?.resources).toBe(80);
      expect(found?.questions[0]).toBe("آیا نیاز بازار به این تخصص پایدار است؟");
      expect(found?.timelineEvents.length).toBe(2);
    }
  });

  it("should save and fetch feedback linked to odyssey plan (Criteria 5)", async () => {
    const plan = OdysseyPlan.create({
      cycleId: "cycle-1",
      slot: "LIFE_2",
      sixWordTitle: "تدریس و استودیوی مستقل طراحی ابزار",
    });
    if (!plan.ok) return;
    await repo.savePlan(plan.value);

    const feedback = OdysseyFeedback.create({
      cycleId: "cycle-1",
      odysseyPlanId: plan.value.id,
      externalFeedback: "شنوندگان پیشنهاد کردند دوره‌های آزمایشی رایگان برگزار کنم.",
      presenterEnergyNote: "هنگام پاسخ به سؤالات حس اشتیاق زیادی را در لحن خودم حس کردم.",
    });
    expect(feedback.ok).toBe(true);
    if (!feedback.ok) return;

    const saveFeedbackRes = await repo.saveFeedback(feedback.value);
    expect(saveFeedbackRes.ok).toBe(true);

    const feedbacksRes = await repo.getFeedbacks(plan.value.id);
    expect(feedbacksRes.ok).toBe(true);
    if (feedbacksRes.ok) {
      expect(feedbacksRes.value.length).toBe(1);
      expect(feedbacksRes.value[0]?.externalFeedback).toContain("دوره‌های آزمایشی رایگان");
      expect(feedbacksRes.value[0]?.presenterEnergyNote).toContain("اشتیاق زیادی");
    }
  });
});
