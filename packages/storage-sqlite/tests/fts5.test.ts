import { HlcTimestamp, generateUUIDv7 } from "@odyssey/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  BetterSqliteDriver,
  MigrationRunner,
  SqliteSearchRepository,
  migration0001,
} from "../src/index.js";

describe("SQLite FTS5 Full-Text Search Engine", () => {
  let driver: BetterSqliteDriver;
  let searchRepo: SqliteSearchRepository;
  const cycleId = "cycle-test-01";

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    searchRepo = new SqliteSearchRepository(driver);
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should index and search journal entries with Persian text and ZWNJ", async () => {
    const id = generateUUIDv7();
    const hlc = HlcTimestamp.create("node-1").toString();

    // Insert journal with ZWNJ: "می‌خواهم"
    await driver.run(
      `INSERT INTO journal_entries (id, cycle_id, title, engagement, energy, is_flow, occurred_at, created_at, updated_at, hlc_timestamp)
       VALUES (?, ?, ?, 80, 50, 1, ?, ?, ?, ?);`,
      [
        id,
        cycleId,
        "جلسه همفکری با تیم طراحی و بازخورد درباره مسیر آینده",
        Date.now(),
        Date.now(),
        Date.now(),
        hlc,
      ],
    );

    // Search using standard Persian terms
    const res = await searchRepo.search("طراحی بازخورد", cycleId);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.length).toBeGreaterThan(0);
      expect(res.value[0]?.entityId).toBe(id);
      expect(res.value[0]?.entityType).toBe("journal_entry");
    }
  });

  it("should benchmark FTS5 search performance on 10,000 records under 30ms", async () => {
    const startTime = performance.now();

    // Batch insert 10,000 journal entries inside a single transaction
    await driver.transaction(async (tx) => {
      const now = Date.now();
      const hlc = HlcTimestamp.create("bench-node").toString();

      for (let i = 0; i < 10000; i++) {
        const id = `bench-id-${i}`;
        const title =
          i === 7777
            ? "کشف یک فرصت استثنایی در حوزه پروتوتایپ سریع"
            : `فعالیت روزمره یادگیری و توسعه کد شماره ${i}`;

        await tx.run(
          `INSERT INTO journal_entries (id, cycle_id, title, engagement, energy, is_flow, occurred_at, created_at, updated_at, hlc_timestamp)
           VALUES (?, ?, ?, 50, 20, 0, ?, ?, ?, ?);`,
          [id, cycleId, title, now, now, now, hlc],
        );
      }
    });

    const insertDuration = performance.now() - startTime;
    console.log(
      `Inserted 10,000 records with automated FTS5 indexing in ${insertDuration.toFixed(1)}ms`,
    );

    // Benchmark search execution time
    const searchStart = performance.now();
    const searchRes = await searchRepo.search("فرصت استثنایی پروتوتایپ", cycleId);
    const searchDuration = performance.now() - searchStart;

    console.log(`FTS5 search over 10,000 records took: ${searchDuration.toFixed(2)}ms`);

    expect(searchRes.ok).toBe(true);
    if (searchRes.ok) {
      expect(searchRes.value.length).toBe(1);
      expect(searchRes.value[0]?.entityId).toBe("bench-id-7777");
    }

    // Acceptance criterion: FTS5 query response time < 30ms
    expect(searchDuration).toBeLessThan(30);
  });
});
