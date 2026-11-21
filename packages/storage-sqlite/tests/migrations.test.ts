import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BetterSqliteDriver, MigrationRunner, migration0001 } from "../src/index.js";

describe("SQLite Migrations Runner", () => {
  let driver: BetterSqliteDriver;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should apply migration 0001 successfully and create all schema tables", async () => {
    const runner = new MigrationRunner(driver, [migration0001]);
    const applied = await runner.runPending();

    expect(applied).toBe(1);

    const versions = await runner.getAppliedVersions();
    expect(versions).toEqual([1]);

    // Check that tables exist
    const tables = await driver.all<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';",
    );
    const tableNames = tables.map((t) => t.name);

    expect(tableNames).toContain("design_cycles");
    expect(tableNames).toContain("hwpl_assessments");
    expect(tableNames).toContain("life_problems");
    expect(tableNames).toContain("compass_entries");
    expect(tableNames).toContain("journal_entries");
    expect(tableNames).toContain("odyssey_plans");
    expect(tableNames).toContain("fts_search_index");
  });

  it("should be idempotent and not re-run already applied migrations", async () => {
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();

    // Run again
    const secondRun = await runner.runPending();
    expect(secondRun).toBe(0);
  });
});
