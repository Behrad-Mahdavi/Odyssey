import { CompassEntry } from "@odyssey/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BetterSqliteDriver } from "../src/driver/better-sqlite.driver.js";
import { migration0001 } from "../src/migrations/0001_initial_schema.js";
import { MigrationRunner } from "../src/migrations/migration-runner.js";
import { SqliteCompassRepository } from "../src/repositories/compass-repository.js";

describe("SQLite Compass Repository (F-007)", () => {
  let driver: BetterSqliteDriver;
  let repo: SqliteCompassRepository;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    repo = new SqliteCompassRepository(driver);
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should save and retrieve latest compass entry", async () => {
    const entry = CompassEntry.create({
      cycleId: "cycle-1",
      workview: "معماری نرم‌افزار تمیز و توسعه سیستم‌های پایدار",
      lifeview: "پژوهش، تفکر فلسفی و ارتباط عمیق با جامعه",
      coherenceComplement: "مهندسی در خدمت حل مسائل انسانی است",
      coherenceConflict: "گاهی الزامات بازار با سادگی در تضاد قرار می‌گیرد",
      coherenceGuide: "همواره سادگی و ارزش واقعی کاربر را اولویت قرار بده",
    });

    const saveRes = await repo.saveEntry(entry);
    expect(saveRes.ok).toBe(true);

    const latestRes = await repo.getLatest("cycle-1");
    expect(latestRes.ok).toBe(true);
    if (latestRes.ok && latestRes.value) {
      expect(latestRes.value.workview).toBe("معماری نرم‌افزار تمیز و توسعه سیستم‌های پایدار");
      expect(latestRes.value.coherenceGuide).toBe(
        "همواره سادگی و ارزش واقعی کاربر را اولویت قرار بده",
      );
    }
  });

  it("should retrieve historical versions of compass across cycle", async () => {
    const v1 = CompassEntry.create({
      cycleId: "cycle-1",
      workview: "نسخه ۱ کار",
      lifeview: "نسخه ۱ زندگی",
    });
    const v2 = CompassEntry.create({
      cycleId: "cycle-1",
      workview: "نسخه ۲ کار",
      lifeview: "نسخه ۲ زندگی",
    });

    await repo.saveEntry(v1);
    await repo.saveEntry(v2);

    const historyRes = await repo.getHistory("cycle-1");
    expect(historyRes.ok).toBe(true);
    if (historyRes.ok) {
      expect(historyRes.value.length).toBe(2);
      expect(historyRes.value[0]?.workview).toBe("نسخه ۱ کار");
      expect(historyRes.value[1]?.workview).toBe("نسخه ۲ کار");
    }
  });
});
