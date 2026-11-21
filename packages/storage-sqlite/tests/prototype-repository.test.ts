import { Prototype } from "@odyssey/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BetterSqliteDriver } from "../src/driver/better-sqlite.driver.js";
import { migration0001 } from "../src/migrations/0001_initial_schema.js";
import { MigrationRunner } from "../src/migrations/migration-runner.js";
import { SqlitePrototypeRepository } from "../src/repositories/prototype-repository.js";

describe("SQLite Prototype Repository (F-010)", () => {
  let driver: BetterSqliteDriver;
  let repo: SqlitePrototypeRepository;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    repo = new SqlitePrototypeRepository(driver);
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should save and retrieve prototype conversation with story questions", async () => {
    const proto = Prototype.create({
      cycleId: "cycle-1",
      type: "CONVERSATION",
      title: "گفت‌وگو با معمار ارشد سیستم",
      hypothesis: "آیا این شغل نیاز به سفرهای مکرر دارد؟",
      intervieweeRole: "Lead Architect",
      referralContact: "سارا محمدی",
    });
    expect(proto.ok).toBe(true);
    if (!proto.ok) return;

    const saveRes = await repo.savePrototype(proto.value);
    expect(saveRes.ok).toBe(true);

    const listRes = await repo.getPrototypes("cycle-1");
    expect(listRes.ok).toBe(true);
    if (listRes.ok) {
      expect(listRes.value.length).toBe(1);
      const found = listRes.value[0];
      expect(found?.type).toBe("CONVERSATION");
      expect(found?.title).toBe("گفت‌وگو با معمار ارشد سیستم");
      expect(found?.intervieweeRole).toBe("Lead Architect");
      expect(found?.referralContact).toBe("سارا محمدی");
    }
  });

  it("should save and filter prototypes by odyssey plan id", async () => {
    // In migration0001, odysseyPlanId has a foreign key to odyssey_plans.id
    // First insert a dummy odyssey plan to satisfy FK
    await driver.run(
      `INSERT INTO odyssey_plans (
        id, cycle_id, slot, six_word_title, resources, likability, confidence, coherence,
        questions_json, timeline_events_json, created_at, updated_at, hlc_timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "plan-test-1",
        "cycle-1",
        "LIFE_1",
        "تست عنوان شش کلمه‌ای ادیسه من",
        80,
        80,
        80,
        80,
        JSON.stringify(["Q1", "Q2", "Q3"]),
        JSON.stringify([]),
        Date.now(),
        Date.now(),
        "hlc-1",
      ],
    );

    const expProto = Prototype.create({
      cycleId: "cycle-1",
      odysseyPlanId: "plan-test-1",
      questionIndex: 1,
      type: "EXPERIENCE",
      title: "آزمون دوره تدریس کوتاه",
      hypothesis: "ارائه آنلاین بازخورد مثبت می‌گیرد",
      costEstimate: "۵ ساعت زمان",
      duration: "۱ روز",
      nextStepVerdict: "PROCEED",
    });
    expect(expProto.ok).toBe(true);
    if (!expProto.ok) return;

    await repo.savePrototype(expProto.value);

    const planPrototypes = await repo.getPrototypesByPlan("plan-test-1");
    expect(planPrototypes.ok).toBe(true);
    if (planPrototypes.ok) {
      expect(planPrototypes.value.length).toBe(1);
      expect(planPrototypes.value[0]?.nextStepVerdict).toBe("PROCEED");
      expect(planPrototypes.value[0]?.questionIndex).toBe(1);
    }
  });

  it("should soft delete prototype", async () => {
    const proto = Prototype.create({
      cycleId: "cycle-1",
      type: "EXPERIENCE",
      title: "آزمون موقت",
      hypothesis: "فرضیه آزمایشی",
    });
    if (!proto.ok) return;
    await repo.savePrototype(proto.value);

    const deleteRes = await repo.deletePrototype(proto.value.id);
    expect(deleteRes.ok).toBe(true);

    const listRes = await repo.getPrototypes("cycle-1");
    expect(listRes.ok).toBe(true);
    if (listRes.ok) {
      expect(listRes.value.length).toBe(0);
    }
  });
});
