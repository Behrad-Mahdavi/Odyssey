import { AeiouAnalysis, JournalEntry, ReflectionFinding } from "@odyssey/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BetterSqliteDriver } from "../src/driver/better-sqlite.driver.js";
import { migration0001 } from "../src/migrations/0001_initial_schema.js";
import { MigrationRunner } from "../src/migrations/migration-runner.js";
import { SqliteJournalRepository } from "../src/repositories/journal-repository.js";

describe("SQLite Journal & AEIOU Repository (F-008)", () => {
  let driver: BetterSqliteDriver;
  let repo: SqliteJournalRepository;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    repo = new SqliteJournalRepository(driver);
  });

  afterEach(async () => {
    await driver.close();
  });

  it("should save and retrieve journal entries", async () => {
    const entry1 = JournalEntry.create({
      cycleId: "cycle-1",
      title: "کدنویسی موتور ذخیره‌سازی محلی",
      engagement: 95,
      energy: 80,
      isFlow: true,
      durationMinutes: 90,
    });
    expect(entry1.ok).toBe(true);
    if (!entry1.ok) return;

    const saveRes = await repo.saveJournalEntry(entry1.value);
    expect(saveRes.ok).toBe(true);

    const entriesRes = await repo.getJournalEntries("cycle-1");
    expect(entriesRes.ok).toBe(true);
    if (entriesRes.ok) {
      expect(entriesRes.value.length).toBe(1);
      const found = entriesRes.value[0];
      expect(found?.title).toBe("کدنویسی موتور ذخیره‌سازی محلی");
      expect(found?.engagement).toBe(95);
      expect(found?.energy).toBe(80);
      expect(found?.isFlow).toBe(true);
    }
  });

  it("should soft delete journal entries", async () => {
    const entry = JournalEntry.create({
      cycleId: "cycle-1",
      title: "جلسه موقت",
      engagement: 10,
      energy: -30,
    });
    if (!entry.ok) return;

    await repo.saveJournalEntry(entry.value);
    const deleteRes = await repo.deleteJournalEntry(entry.value.id);
    expect(deleteRes.ok).toBe(true);

    const entriesRes = await repo.getJournalEntries("cycle-1");
    expect(entriesRes.ok).toBe(true);
    if (entriesRes.ok) {
      expect(entriesRes.value.length).toBe(0);
    }
  });

  it("should save reflection findings linked to journal entries (INV-04)", async () => {
    const entry = JournalEntry.create({
      cycleId: "cycle-1",
      title: "طراحی بصری مینیمال",
      engagement: 85,
      energy: 60,
    });
    if (!entry.ok) return;
    await repo.saveJournalEntry(entry.value);

    const finding = ReflectionFinding.create({
      cycleId: "cycle-1",
      journalEntryId: entry.value.id,
      tag: "INSIGHT",
      notes: "کار با پالت رنگ‌های مات استرس بصری را به شدت کاهش داد",
    });
    expect(finding.ok).toBe(true);
    if (!finding.ok) return;

    const saveFindingRes = await repo.saveReflectionFinding(finding.value);
    expect(saveFindingRes.ok).toBe(true);

    const findingsRes = await repo.getReflectionFindings(entry.value.id);
    expect(findingsRes.ok).toBe(true);
    if (findingsRes.ok) {
      expect(findingsRes.value.length).toBe(1);
      expect(findingsRes.value[0]?.tag).toBe("INSIGHT");
      expect(findingsRes.value[0]?.notes).toBe(
        "کار با پالت رنگ‌های مات استرس بصری را به شدت کاهش داد",
      );
    }
  });

  it("should save and retrieve AEIOU analysis linked to reflection finding (INV-04)", async () => {
    const entry = JournalEntry.create({
      cycleId: "cycle-1",
      title: "طراحی دسترسی‌پذیری",
      engagement: 90,
      energy: 70,
    });
    if (!entry.ok) return;
    await repo.saveJournalEntry(entry.value);

    const finding = ReflectionFinding.create(
      {
        cycleId: "cycle-1",
        journalEntryId: entry.value.id,
        tag: "INSIGHT",
        notes: "نور طبیعی و سکوت تمرکز عمیق ایجاد می‌کند",
      },
      "finding-001",
    );
    if (!finding.ok) return;
    await repo.saveReflectionFinding(finding.value);

    const aeiou = AeiouAnalysis.create({
      cycleId: "cycle-1",
      reflectionFindingId: "finding-001",
      activities: "طراحی کامپوننت‌های دسترسی‌پذیر",
      environments: "میز مرتب بدون نوتیفیکیشن",
      interactions: "تعامل فنی متمرکز",
      objects: "کتاب اصول طراحی و نمایشگر مات",
      users: "کاربران حرفه‌ای با نیاز به تمرکز بالا",
    });
    expect(aeiou.ok).toBe(true);
    if (!aeiou.ok) return;

    const saveRes = await repo.saveAeiouAnalysis(aeiou.value);
    expect(saveRes.ok).toBe(true);

    const retrievedRes = await repo.getAeiouByFindingId("finding-001");
    expect(retrievedRes.ok).toBe(true);
    if (retrievedRes.ok && retrievedRes.value) {
      expect(retrievedRes.value.activities).toBe("طراحی کامپوننت‌های دسترسی‌پذیر");
      expect(retrievedRes.value.environments).toBe("میز مرتب بدون نوتیفیکیشن");
      expect(retrievedRes.value.users).toBe("کاربران حرفه‌ای با نیاز به تمرکز بالا");
    }
  });
});
