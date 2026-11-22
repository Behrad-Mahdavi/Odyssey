import { beforeEach, describe, expect, it } from "vitest";
import { BetterSqliteDriver } from "../src/driver/better-sqlite.driver.js";
import { migration0001 } from "../src/migrations/0001_initial_schema.js";
import { MigrationRunner } from "../src/migrations/migration-runner.js";
import { SqlitePortabilityService } from "../src/services/portability-service.js";

describe("SqlitePortabilityService (F-011 Data Portability)", () => {
  let driver: BetterSqliteDriver;
  let portabilityService: SqlitePortabilityService;

  beforeEach(async () => {
    driver = new BetterSqliteDriver(":memory:");
    await driver.init();
    const runner = new MigrationRunner(driver, [migration0001]);
    await runner.runPending();
    portabilityService = new SqlitePortabilityService(driver);
  });

  it("should export all modules and import back into an empty database with 100% data fidelity", async () => {
    const cycleId = "cycle-test-1";
    const now = Date.now();
    const hlc = `test-node-${now}`;

    // 1. Populate records across all modules
    await driver.run(
      "INSERT INTO design_cycles (id, name, status, started_at, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cycleId, "چرخه آزمایشی ۱", "ACTIVE", now, now, now, hlc],
    );

    await driver.run(
      "INSERT INTO hwpl_assessments (id, cycle_id, health, work, play, love, health_notes, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ["hwpl-1", cycleId, 85, 70, 60, 90, "ورزش صبحگاهی و خواب عالی", now, now, hlc],
    );

    await driver.run(
      "INSERT INTO life_problems (id, cycle_id, content, classification, reframed_question, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "prob-1",
        cycleId,
        "ترافیک روزانه ۲ ساعت وقت می‌گیرد",
        "GRAVITY",
        "چگونه در ترافیک پادکست‌های عمیق گوش دهم؟",
        now,
        now,
        hlc,
      ],
    );

    await driver.run(
      "INSERT INTO compass_entries (id, cycle_id, workview, lifeview, coherence_complement, coherence_conflict, coherence_guide, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "comp-1",
        cycleId,
        "دیدگاه کار: خلق ارزش پایدار و ساخت ابزارهای باکیفیت برای دیگران.",
        "دیدگاه زندگی: رشد پیوسته، یادگیری مستمر و تجربه اصیل روابط انسانی.",
        "هم‌پوشانی: ساخت ابزار به من حس ارزشمندی و رضایت می‌دهد.",
        "تضاد: کار زیاد نباید سلامت فیزیکی را قربانی کند.",
        "راهنما: انتخاب پروژه‌هایی که تأثیر ماندگار دارند.",
        now,
        now,
        hlc,
      ],
    );

    await driver.run(
      "INSERT INTO journal_entries (id, cycle_id, title, engagement, energy, is_flow, occurred_at, duration_minutes, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ["jour-1", cycleId, "معماری ماژول خروجی داده‌ها", 95, 80, 1, now, 60, now, now, hlc],
    );

    await driver.run(
      "INSERT INTO reflection_findings (id, cycle_id, journal_entry_id, tag, notes, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "find-1",
        cycleId,
        "jour-1",
        "INSIGHT",
        "طراحی تایپ‌های دقیق تمرکز را بالا می‌برد",
        now,
        now,
        hlc,
      ],
    );

    await driver.run(
      "INSERT INTO aeiou_analyses (id, cycle_id, reflection_finding_id, activities, environments, interactions, objects, users, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "ae-1",
        cycleId,
        "find-1",
        "کدنویسی تایپ‌اسکریپت",
        "میز کار آرام",
        "تمرکز فردی بدون نوتیفیکیشن",
        "لپ‌تاپ و نمایشگر ۲۷ اینچ",
        "کاربران ادیسه",
        now,
        now,
        hlc,
      ],
    );

    await driver.run(
      "INSERT INTO odyssey_plans (id, cycle_id, slot, six_word_title, resources, likability, confidence, coherence, questions_json, timeline_events_json, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "plan-1",
        cycleId,
        "LIFE_1",
        "توسعه معماری سیستم و استودیوی مستقل",
        85,
        90,
        80,
        95,
        JSON.stringify([
          "آیا بازار به ابزارهای محلی نیاز دارد؟",
          "مدل درآمدی پایدار چیست؟",
          "چگونه تیم رشد کند؟",
        ]),
        JSON.stringify([{ year: 1, type: "work", description: "ساخت نسخه اول" }]),
        now,
        now,
        hlc,
      ],
    );

    await driver.run(
      "INSERT INTO odyssey_feedbacks (id, cycle_id, odyssey_plan_id, external_feedback, presenter_energy_note, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "fb-1",
        cycleId,
        "plan-1",
        "سؤالات ادیسه بسیار واقع‌گرایانه هستند",
        "هنگام ارائه حس هیجان و شفافیت داشتم",
        now,
        now,
        hlc,
      ],
    );

    await driver.run(
      "INSERT INTO prototypes (id, cycle_id, odyssey_plan_id, question_index, type, hypothesis, status, outcome, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "proto-1",
        cycleId,
        "plan-1",
        0,
        "CONVERSATION",
        "آیا طراحان از نرم‌افزارهای محلی استقبال می‌کنند؟",
        "COMPLETED",
        "مصاحبه با ۳ طراح انجام شد و نتیجه کاملاً مثبت بود.",
        now,
        now,
        hlc,
      ],
    );

    // 2. Export All Data
    const exportRes = await portabilityService.exportAllData();
    expect(exportRes.ok).toBe(true);
    if (!exportRes.ok) return;

    const exportData = exportRes.value;
    expect(exportData.format).toBe("odyssey-export");
    expect(exportData.schemaVersion).toBe(1);
    expect(exportData.data.designCycles).toHaveLength(1);
    expect(exportData.data.hwplAssessments).toHaveLength(1);
    expect(exportData.data.lifeProblems).toHaveLength(1);
    expect(exportData.data.compassEntries).toHaveLength(1);
    expect(exportData.data.journalEntries).toHaveLength(1);
    expect(exportData.data.reflectionFindings).toHaveLength(1);
    expect(exportData.data.aeiouAnalyses).toHaveLength(1);
    expect(exportData.data.odysseyPlans).toHaveLength(1);
    expect(exportData.data.odysseyFeedbacks).toHaveLength(1);
    expect(exportData.data.prototypes).toHaveLength(1);

    // 3. Create a brand-new empty database
    const freshDriver = new BetterSqliteDriver(":memory:");
    await freshDriver.init();
    const freshRunner = new MigrationRunner(freshDriver, [migration0001]);
    await freshRunner.runPending();
    const freshPortabilityService = new SqlitePortabilityService(freshDriver);

    // Verify empty state before import
    const emptyCount = await freshDriver.get<{ count: number }>(
      "SELECT count(*) as count FROM design_cycles",
    );
    expect(emptyCount?.count).toBe(0);

    // 4. Import into fresh database
    const importRes = await freshPortabilityService.importAllData(exportData);
    expect(importRes.ok).toBe(true);
    if (!importRes.ok) return;

    expect(importRes.value.totalRecords).toBe(10);
    expect(importRes.value.designCycles).toBe(1);
    expect(importRes.value.prototypes).toBe(1);

    // 5. Verify records inside the fresh database
    const importedCycle = await freshDriver.get<{ name: string }>(
      "SELECT name FROM design_cycles WHERE id = ?",
      [cycleId],
    );
    expect(importedCycle?.name).toBe("چرخه آزمایشی ۱");

    const importedCompass = await freshDriver.get<{ workview: string }>(
      "SELECT workview FROM compass_entries WHERE id = ?",
      ["comp-1"],
    );
    expect(importedCompass?.workview).toContain("خلق ارزش پایدار");

    const importedPlan = await freshDriver.get<{ six_word_title: string }>(
      "SELECT six_word_title FROM odyssey_plans WHERE id = ?",
      ["plan-1"],
    );
    expect(importedPlan?.six_word_title).toBe("توسعه معماری سیستم و استودیوی مستقل");
  });

  it("should reject tampered or invalid import payloads with schema errors without touching database", async () => {
    const invalidPayload = {
      format: "odyssey-export",
      schemaVersion: 1,
      exportedAt: Date.now(),
      appVersion: "1.0.0",
      data: {
        designCycles: [],
        hwplAssessments: [
          {
            id: "bad-hwpl",
            cycleId: "c1",
            health: 999, // INVALID: must be <= 100
            work: 50,
            play: 50,
            love: 50,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            hlcTimestamp: "hlc-bad",
          },
        ],
        lifeProblems: [],
        compassEntries: [],
        journalEntries: [],
        reflectionFindings: [],
        aeiouAnalyses: [],
        odysseyPlans: [],
        odysseyFeedbacks: [],
        prototypes: [],
      },
    };

    // @ts-expect-error - testing invalid schema
    const result = await portabilityService.importAllData(invalidPayload);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("SCHEMA_CORRUPTED");
    }

    // Verify DB remains untouched
    const count = await driver.get<{ count: number }>(
      "SELECT count(*) as count FROM hwpl_assessments",
    );
    expect(count?.count).toBe(0);
  });

  it("should generate comprehensive Markdown archive with YAML frontmatter and Obsidian wikilinks", async () => {
    const cycleId = "cycle-1";
    const now = Date.now();
    const hlc = "hlc-node";

    await driver.run(
      "INSERT INTO design_cycles (id, name, status, started_at, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cycleId, "چرخه آزمایشی", "ACTIVE", now, now, now, hlc],
    );

    await driver.run(
      "INSERT INTO compass_entries (id, cycle_id, workview, lifeview, coherence_complement, coherence_conflict, coherence_guide, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "c1",
        cycleId,
        "دیدگاه کار من",
        "دیدگاه زندگی من",
        "نقاط مکمل",
        "نقاط تضاد",
        "راهنما",
        now,
        now,
        hlc,
      ],
    );

    await driver.run(
      "INSERT INTO odyssey_plans (id, cycle_id, slot, six_word_title, resources, likability, confidence, coherence, questions_json, timeline_events_json, created_at, updated_at, hlc_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "p1",
        cycleId,
        "LIFE_1",
        "ساختن یک استودیوی طراحی ابزار",
        80,
        85,
        75,
        90,
        JSON.stringify(["سؤال ۱", "سؤال ۲", "سؤال ۳"]),
        JSON.stringify([]),
        now,
        now,
        hlc,
      ],
    );

    const exportRes = await portabilityService.exportAllData();
    expect(exportRes.ok).toBe(true);
    if (!exportRes.ok) return;

    const mdRes = portabilityService.generateMarkdownArchive(exportRes.value);
    expect(mdRes.ok).toBe(true);
    if (!mdRes.ok) return;

    const files = mdRes.value;
    expect(files["README.md"]).toBeDefined();
    expect(files["README.md"]).toContain("# Odyssey Life Design Studio");
    expect(files["README.md"]).toContain("[[Compass/Workview|دیدگاه کار (Workview)]]");
    expect(files["Compass/Workview.md"]).toContain("دیدگاه کار من");
    expect(files["Odyssey/LIFE_1.md"]).toContain("ساختن یک استودیوی طراحی ابزار");
    expect(files["Odyssey/LIFE_1.md"]).toContain("type: odyssey_plan");
  });
});
