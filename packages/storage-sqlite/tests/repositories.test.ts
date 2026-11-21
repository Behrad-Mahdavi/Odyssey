import { DesignCycle } from "@odyssey/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  BetterSqliteDriver,
  MigrationRunner,
  SqliteDesignCycleRepository,
  migration0001,
} from "../src/index.js";

describe("SqliteDesignCycleRepository", () => {
  let driver: BetterSqliteDriver;
  let repo: SqliteDesignCycleRepository;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    repo = new SqliteDesignCycleRepository(driver);
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should create and retrieve a design cycle", async () => {
    const cycle = DesignCycle.create("Cycle 1 - Foundation");
    const saveRes = await repo.create(cycle);
    expect(saveRes.ok).toBe(true);

    const findRes = await repo.findById(cycle.id);
    expect(findRes.ok).toBe(true);
    if (findRes.ok && findRes.value) {
      expect(findRes.value.name).toBe("Cycle 1 - Foundation");
      expect(findRes.value.status).toBe("ACTIVE");
    }
  });

  it("should find the active design cycle", async () => {
    const cycle1 = DesignCycle.create("Cycle 1");
    await repo.create(cycle1);

    const activeRes = await repo.findActive();
    expect(activeRes.ok).toBe(true);
    if (activeRes.ok && activeRes.value) {
      expect(activeRes.value.id).toBe(cycle1.id);
    }
  });
});
