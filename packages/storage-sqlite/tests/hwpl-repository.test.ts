import { HwplAssessment, LifeProblem } from "@odyssey/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BetterSqliteDriver } from "../src/driver/better-sqlite.driver.js";
import { migration0001 } from "../src/migrations/0001_initial_schema.js";
import { MigrationRunner } from "../src/migrations/migration-runner.js";
import { SqliteHwplRepository } from "../src/repositories/hwpl-repository.js";
import { SqliteLifeProblemRepository } from "../src/repositories/life-problem-repository.js";

describe("SQLite HWPL and Life Problems Repositories (F-006)", () => {
  let driver: BetterSqliteDriver;
  let hwplRepo: SqliteHwplRepository;
  let problemRepo: SqliteLifeProblemRepository;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    hwplRepo = new SqliteHwplRepository(driver);
    problemRepo = new SqliteLifeProblemRepository(driver);
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should save and retrieve HWPL assessment history", async () => {
    const a1Res = HwplAssessment.create({
      cycleId: "cycle-1",
      health: 60,
      work: 70,
      play: 40,
      love: 80,
      healthNotes: "First checkin",
    });
    expect(a1Res.ok).toBe(true);
    if (!a1Res.ok) return;
    const a1 = a1Res.value;

    const saveRes = await hwplRepo.saveAssessment(a1);
    expect(saveRes.ok).toBe(true);

    const latestRes = await hwplRepo.getLatestAssessment("cycle-1");
    expect(latestRes.ok).toBe(true);
    if (latestRes.ok && latestRes.value) {
      expect(latestRes.value.health).toBe(60);
      expect(latestRes.value.healthNotes).toBe("First checkin");
    }

    const a2Res = HwplAssessment.create({
      cycleId: "cycle-1",
      health: 80,
      work: 75,
      play: 60,
      love: 85,
      healthNotes: "Second checkin after recovery",
    });
    expect(a2Res.ok).toBe(true);
    if (!a2Res.ok) return;
    const a2 = a2Res.value;

    await hwplRepo.saveAssessment(a2);

    const historyRes = await hwplRepo.getAssessmentHistory("cycle-1");
    expect(historyRes.ok).toBe(true);
    if (historyRes.ok) {
      expect(historyRes.value.length).toBe(2);
      expect(historyRes.value[1]?.health).toBe(80);
    }
  });

  it("should save, classify, and filter life problems", async () => {
    const p1 = LifeProblem.create("cycle-1", "رکود بازار کار", "GRAVITY");
    const p2 = LifeProblem.create("cycle-1", "یادگیری فریمورک جدید", "DESIGNABLE");

    await problemRepo.saveProblem(p1);
    await problemRepo.saveProblem(p2);

    const problemsRes = await problemRepo.getProblems("cycle-1");
    expect(problemsRes.ok).toBe(true);
    if (problemsRes.ok) {
      expect(problemsRes.value.length).toBe(2);
      const gravity = problemsRes.value.find((p) => p.isGravity);
      const designable = problemsRes.value.find((p) => !p.isGravity);
      expect(gravity?.content).toBe("رکود بازار کار");
      expect(designable?.content).toBe("یادگیری فریمورک جدید");
    }

    // Reclassify p2 to GRAVITY
    await problemRepo.updateClassification(p2.id, "GRAVITY");
    const updatedRes = await problemRepo.getProblems("cycle-1");
    if (updatedRes.ok) {
      const updatedP2 = updatedRes.value.find((p) => p.id === p2.id);
      expect(updatedP2?.isGravity).toBe(true);
    }
  });
});
