import {
  type IPortabilityService,
  type ImportSummary,
  type OdysseyExportData,
  OdysseyExportDataSchema,
  StorageError,
} from "@odyssey/application";
import { type Result, err, ok } from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface DbRow {
  [key: string]: unknown;
}

export class SqlitePortabilityService implements IPortabilityService {
  constructor(private readonly driver: ISqlDriver) {}

  public async exportAllData(): Promise<Result<OdysseyExportData, StorageError>> {
    try {
      const [
        cyclesRows,
        hwplRows,
        problemsRows,
        compassRows,
        journalRows,
        findingsRows,
        aeiouRows,
        plansRows,
        feedbackRows,
        prototypesRows,
      ] = await Promise.all([
        this.driver.all<DbRow>(
          "SELECT * FROM design_cycles WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM hwpl_assessments WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM life_problems WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM compass_entries WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM journal_entries WHERE deleted_at IS NULL ORDER BY occurred_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM reflection_findings WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM aeiou_analyses WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM odyssey_plans WHERE deleted_at IS NULL ORDER BY slot ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM odyssey_feedbacks WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
        this.driver.all<DbRow>(
          "SELECT * FROM prototypes WHERE deleted_at IS NULL ORDER BY created_at ASC",
        ),
      ]);

      const exportData: OdysseyExportData = {
        format: "odyssey-export",
        schemaVersion: 1,
        exportedAt: Date.now(),
        appVersion: "1.0.0",
        data: {
          designCycles: cyclesRows.map((r) => ({
            id: String(r.id),
            name: String(r.name),
            status: r.status as "ACTIVE" | "ARCHIVED_SNAPSHOT",
            startedAt: Number(r.started_at),
            snapshotAt: r.snapshot_at != null ? Number(r.snapshot_at) : null,
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          hwplAssessments: hwplRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            health: Number(r.health),
            work: Number(r.work),
            play: Number(r.play),
            love: Number(r.love),
            healthNotes: r.health_notes != null ? String(r.health_notes) : null,
            workNotes: r.work_notes != null ? String(r.work_notes) : null,
            playNotes: r.play_notes != null ? String(r.play_notes) : null,
            loveNotes: r.love_notes != null ? String(r.love_notes) : null,
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          lifeProblems: problemsRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            content: String(r.content),
            classification: r.classification as "GRAVITY" | "DESIGNABLE",
            anchorStatement: r.anchor_statement != null ? String(r.anchor_statement) : null,
            reframedQuestion: r.reframed_question != null ? String(r.reframed_question) : null,
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          compassEntries: compassRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            workview: String(r.workview),
            lifeview: String(r.lifeview),
            coherenceComplement:
              r.coherence_complement != null ? String(r.coherence_complement) : null,
            coherenceConflict: r.coherence_conflict != null ? String(r.coherence_conflict) : null,
            coherenceGuide: r.coherence_guide != null ? String(r.coherence_guide) : null,
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          journalEntries: journalRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            title: String(r.title),
            engagement: Number(r.engagement),
            energy: Number(r.energy),
            isFlow: Boolean(r.is_flow === 1 || r.is_flow === true),
            occurredAt: Number(r.occurred_at),
            durationMinutes: r.duration_minutes != null ? Number(r.duration_minutes) : null,
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          reflectionFindings: findingsRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            journalEntryId: r.journal_entry_id != null ? String(r.journal_entry_id) : null,
            tag: r.tag as "TREND" | "INSIGHT" | "SURPRISE",
            notes: String(r.notes),
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          aeiouAnalyses: aeiouRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            reflectionFindingId: String(r.reflection_finding_id),
            activities: String(r.activities),
            environments: String(r.environments),
            interactions: String(r.interactions),
            objects: String(r.objects),
            users: String(r.users),
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          odysseyPlans: plansRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            slot: r.slot as "LIFE_1" | "LIFE_2" | "LIFE_3",
            sixWordTitle: String(r.six_word_title),
            resources: Number(r.resources),
            likability: Number(r.likability),
            confidence: Number(r.confidence),
            coherence: Number(r.coherence),
            questionsJson: String(r.questions_json),
            timelineEventsJson: String(r.timeline_events_json),
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          odysseyFeedbacks: feedbackRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            odysseyPlanId: String(r.odyssey_plan_id),
            sessionId: r.session_id != null ? String(r.session_id) : null,
            externalFeedback: String(r.external_feedback),
            presenterEnergyNote: String(r.presenter_energy_note),
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
          prototypes: prototypesRows.map((r) => ({
            id: String(r.id),
            cycleId: String(r.cycle_id),
            odysseyPlanId: r.odyssey_plan_id != null ? String(r.odyssey_plan_id) : null,
            questionIndex: r.question_index != null ? Number(r.question_index) : null,
            type: r.type as "CONVERSATION" | "EXPERIENCE",
            hypothesis: String(r.hypothesis),
            status: r.status as "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED",
            outcome: r.outcome != null ? String(r.outcome) : null,
            contactId: r.contact_id != null ? String(r.contact_id) : null,
            createdAt: Number(r.created_at),
            updatedAt: Number(r.updated_at),
            hlcTimestamp: String(r.hlc_timestamp),
            deletedAt: r.deleted_at != null ? Number(r.deleted_at) : null,
          })),
        },
      };

      const parseResult = OdysseyExportDataSchema.safeParse(exportData);
      if (!parseResult.success) {
        return err(
          new StorageError(
            "SCHEMA_CORRUPTED",
            `Export data validation failed: ${parseResult.error.message}`,
          ),
        );
      }

      return ok(exportData);
    } catch (error: unknown) {
      return err(
        new StorageError("TRANSACTION_FAILED", "Failed to export data from database", error),
      );
    }
  }

  public async importAllData(
    data: OdysseyExportData,
  ): Promise<Result<ImportSummary, StorageError>> {
    // 1. Strict Schema Validation Gate before touching the database
    const validationResult = OdysseyExportDataSchema.safeParse(data);
    if (!validationResult.success) {
      return err(
        new StorageError(
          "SCHEMA_CORRUPTED",
          `Import data is malformed or invalid: ${validationResult.error.message}`,
        ),
      );
    }

    const {
      designCycles,
      hwplAssessments,
      lifeProblems,
      compassEntries,
      journalEntries,
      reflectionFindings,
      aeiouAnalyses,
      odysseyPlans,
      odysseyFeedbacks,
      prototypes,
    } = validationResult.data.data;

    try {
      await this.driver.transaction(async (tx) => {
        // 1. Insert or Replace Design Cycles
        for (const cycle of designCycles) {
          await tx.run(
            `INSERT OR REPLACE INTO design_cycles (
              id, name, status, started_at, snapshot_at, created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              cycle.id,
              cycle.name,
              cycle.status,
              cycle.startedAt,
              cycle.snapshotAt ?? null,
              cycle.createdAt,
              cycle.updatedAt,
              cycle.hlcTimestamp,
              cycle.deletedAt ?? null,
            ],
          );
        }

        // 2. Insert or Replace HWPL Assessments
        for (const a of hwplAssessments) {
          await tx.run(
            `INSERT OR REPLACE INTO hwpl_assessments (
              id, cycle_id, health, work, play, love,
              health_notes, work_notes, play_notes, love_notes,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              a.id,
              a.cycleId,
              a.health,
              a.work,
              a.play,
              a.love,
              a.healthNotes ?? null,
              a.workNotes ?? null,
              a.playNotes ?? null,
              a.loveNotes ?? null,
              a.createdAt,
              a.updatedAt,
              a.hlcTimestamp,
              a.deletedAt ?? null,
            ],
          );
        }

        // 3. Insert or Replace Life Problems
        for (const p of lifeProblems) {
          await tx.run(
            `INSERT OR REPLACE INTO life_problems (
              id, cycle_id, content, classification,
              anchor_statement, reframed_question,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id,
              p.cycleId,
              p.content,
              p.classification,
              p.anchorStatement ?? null,
              p.reframedQuestion ?? null,
              p.createdAt,
              p.updatedAt,
              p.hlcTimestamp,
              p.deletedAt ?? null,
            ],
          );
        }

        // 4. Insert or Replace Compass Entries
        for (const c of compassEntries) {
          await tx.run(
            `INSERT OR REPLACE INTO compass_entries (
              id, cycle_id, workview, lifeview,
              coherence_complement, coherence_conflict, coherence_guide,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              c.id,
              c.cycleId,
              c.workview,
              c.lifeview,
              c.coherenceComplement ?? null,
              c.coherenceConflict ?? null,
              c.coherenceGuide ?? null,
              c.createdAt,
              c.updatedAt,
              c.hlcTimestamp,
              c.deletedAt ?? null,
            ],
          );
        }

        // 5. Insert or Replace Journal Entries
        for (const j of journalEntries) {
          await tx.run(
            `INSERT OR REPLACE INTO journal_entries (
              id, cycle_id, title, engagement, energy, is_flow,
              occurred_at, duration_minutes,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              j.id,
              j.cycleId,
              j.title,
              j.engagement,
              j.energy,
              j.isFlow ? 1 : 0,
              j.occurredAt,
              j.durationMinutes ?? null,
              j.createdAt,
              j.updatedAt,
              j.hlcTimestamp,
              j.deletedAt ?? null,
            ],
          );
        }

        // 6. Insert or Replace Reflection Findings
        for (const f of reflectionFindings) {
          await tx.run(
            `INSERT OR REPLACE INTO reflection_findings (
              id, cycle_id, journal_entry_id, tag, notes,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              f.id,
              f.cycleId,
              f.journalEntryId ?? null,
              f.tag,
              f.notes,
              f.createdAt,
              f.updatedAt,
              f.hlcTimestamp,
              f.deletedAt ?? null,
            ],
          );
        }

        // 7. Insert or Replace AEIOU Analyses
        for (const ae of aeiouAnalyses) {
          await tx.run(
            `INSERT OR REPLACE INTO aeiou_analyses (
              id, cycle_id, reflection_finding_id,
              activities, environments, interactions, objects, users,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              ae.id,
              ae.cycleId,
              ae.reflectionFindingId,
              ae.activities,
              ae.environments,
              ae.interactions,
              ae.objects,
              ae.users,
              ae.createdAt,
              ae.updatedAt,
              ae.hlcTimestamp,
              ae.deletedAt ?? null,
            ],
          );
        }

        // 8. Insert or Replace Odyssey Plans
        for (const plan of odysseyPlans) {
          await tx.run(
            `INSERT OR REPLACE INTO odyssey_plans (
              id, cycle_id, slot, six_word_title,
              resources, likability, confidence, coherence,
              questions_json, timeline_events_json,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              plan.id,
              plan.cycleId,
              plan.slot,
              plan.sixWordTitle,
              plan.resources,
              plan.likability,
              plan.confidence,
              plan.coherence,
              plan.questionsJson,
              plan.timelineEventsJson,
              plan.createdAt,
              plan.updatedAt,
              plan.hlcTimestamp,
              plan.deletedAt ?? null,
            ],
          );
        }

        // 9. Insert or Replace Odyssey Feedbacks
        for (const fb of odysseyFeedbacks) {
          await tx.run(
            `INSERT OR REPLACE INTO odyssey_feedbacks (
              id, cycle_id, odyssey_plan_id, session_id,
              external_feedback, presenter_energy_note,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              fb.id,
              fb.cycleId,
              fb.odysseyPlanId,
              fb.sessionId ?? null,
              fb.externalFeedback,
              fb.presenterEnergyNote,
              fb.createdAt,
              fb.updatedAt,
              fb.hlcTimestamp,
              fb.deletedAt ?? null,
            ],
          );
        }

        // 10. Insert or Replace Prototypes
        for (const proto of prototypes) {
          await tx.run(
            `INSERT OR REPLACE INTO prototypes (
              id, cycle_id, odyssey_plan_id, question_index,
              type, hypothesis, status, outcome, contact_id,
              created_at, updated_at, hlc_timestamp, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              proto.id,
              proto.cycleId,
              proto.odysseyPlanId ?? null,
              proto.questionIndex ?? null,
              proto.type,
              proto.hypothesis,
              proto.status,
              proto.outcome ?? null,
              proto.contactId ?? null,
              proto.createdAt,
              proto.updatedAt,
              proto.hlcTimestamp,
              proto.deletedAt ?? null,
            ],
          );
        }
      });

      const total =
        designCycles.length +
        hwplAssessments.length +
        lifeProblems.length +
        compassEntries.length +
        journalEntries.length +
        reflectionFindings.length +
        aeiouAnalyses.length +
        odysseyPlans.length +
        odysseyFeedbacks.length +
        prototypes.length;

      return ok({
        success: true,
        designCycles: designCycles.length,
        hwplAssessments: hwplAssessments.length,
        lifeProblems: lifeProblems.length,
        compassEntries: compassEntries.length,
        journalEntries: journalEntries.length,
        reflectionFindings: reflectionFindings.length,
        aeiouAnalyses: aeiouAnalyses.length,
        odysseyPlans: odysseyPlans.length,
        odysseyFeedbacks: odysseyFeedbacks.length,
        prototypes: prototypes.length,
        totalRecords: total,
      });
    } catch (error: unknown) {
      return err(new StorageError("TRANSACTION_FAILED", "Import transaction failed", error));
    }
  }

  public generateMarkdownArchive(
    data: OdysseyExportData,
  ): Result<Record<string, string>, StorageError> {
    try {
      const files: Record<string, string> = {};
      const {
        designCycles,
        hwplAssessments,
        lifeProblems,
        compassEntries,
        journalEntries,
        reflectionFindings,
        aeiouAnalyses,
        odysseyPlans,
        odysseyFeedbacks,
        prototypes,
      } = data.data;

      const dateStr = new Date(data.exportedAt).toISOString().split("T")[0] ?? "unknown-date";

      // 1. README.md (Obsidian Master Index)
      files["README.md"] = `---
type: odyssey_archive
version: ${data.appVersion}
exportedAt: "${dateStr}"
totalCycles: ${designCycles.length}
totalPlans: ${odysseyPlans.length}
totalPrototypes: ${prototypes.length}
---

# Odyssey Life Design Studio — Knowledge Archive

این بایگانی شامل تمام یادداشت‌ها، سنجش‌ها و برنامه‌های طراحی زندگی استخراج‌شده از استودیوی Odyssey است.

## 🧭 فهرست ماژول‌ها و ابزارها
- [[Compass/Workview|دیدگاه کار (Workview)]]
- [[Compass/Lifeview|دیدگاه زندگی (Lifeview)]]
- [[Compass/Coherence|سنجش انسجام (Coherence)]]
- [[Dashboard/HWPL|تراز ۴گانه سلامت، کار، بازی و عشق (HWPL)]]
- [[Problems/Gravity-and-Designable|مسائل گرانشی و چالش‌های قابل طراحی]]
- [[Journal/Index|دفترچه اوقات خوش (Good Time Journal)]]
- [[Odyssey/Index|برنامه‌های سه‌گانه ادیسه (Three Odyssey Plans)]]
- [[Prototypes/Index|آزمایشگاه پروتوتایپ (Prototyping Lab)]]

---
*تولیدشده به صورت خودکار توسط موتور Local-First و Zero-Knowledge Odyssey.*
`;

      // 2. Compass Module
      const activeCompass = compassEntries[0];
      if (activeCompass) {
        files["Compass/Workview.md"] = `---
type: compass
view: workview
cycleId: "${activeCompass.cycleId}"
updatedAt: "${new Date(activeCompass.updatedAt).toISOString()}"
---

# دیدگاه کار (Workview)

> کار برای شما چه معنایی دارد؟ چرا کار می‌کنید و چه چیزی به آن ارزش می‌بخشد؟

${activeCompass.workview}
`;

        files["Compass/Lifeview.md"] = `---
type: compass
view: lifeview
cycleId: "${activeCompass.cycleId}"
updatedAt: "${new Date(activeCompass.updatedAt).toISOString()}"
---

# دیدگاه زندگی (Lifeview)

> زیستن چه معنایی دارد؟ چه چیزی زندگی را ارزشمند و رضایت‌بخش می‌سازد؟

${activeCompass.lifeview}
`;

        files["Compass/Coherence.md"] = `---
type: compass_coherence
cycleId: "${activeCompass.cycleId}"
---

# سنجش انسجام دیدگاه کار و زندگی (Coherence)

## نقاط هم‌افزا و مکمل (Complementary)
${activeCompass.coherenceComplement || "ثبت نشده"}

## نقاط تضاد و اصطکاک (Conflicting)
${activeCompass.coherenceConflict || "ثبت نشده"}

## قطب‌نمای هدایت زندگی (Life Guide)
${activeCompass.coherenceGuide || "ثبت نشده"}
`;
      }

      // 3. HWPL Dashboard
      const activeHwpl = hwplAssessments[hwplAssessments.length - 1];
      if (activeHwpl) {
        files["Dashboard/HWPL.md"] = `---
type: hwpl_dashboard
cycleId: "${activeHwpl.cycleId}"
health: ${activeHwpl.health}
work: ${activeHwpl.work}
play: ${activeHwpl.play}
love: ${activeHwpl.love}
---

# تراز چهارگانه زندگی (Health, Work, Play, Love)

| حوزه | تراز (%) | یادداشت‌ها و مشاهدات |
| :--- | :---: | :--- |
| **سلامت (Health)** | ${activeHwpl.health}% | ${activeHwpl.healthNotes || "-"} |
| **کار (Work)** | ${activeHwpl.work}% | ${activeHwpl.workNotes || "-"} |
| **بازی و تفریح (Play)** | ${activeHwpl.play}% | ${activeHwpl.playNotes || "-"} |
| **عشق و ارتباطات (Love)** | ${activeHwpl.love}% | ${activeHwpl.loveNotes || "-"} |
`;
      }

      // 4. Gravity vs Designable Problems
      const gravityList = lifeProblems.filter((p) => p.classification === "GRAVITY");
      const designableList = lifeProblems.filter((p) => p.classification === "DESIGNABLE");

      files["Problems/Gravity-and-Designable.md"] = `---
type: problems_classification
totalGravity: ${gravityList.length}
totalDesignable: ${designableList.length}
---

# تفکیک مسائل گرانشی از چالش‌های قابل طراحی

## ⚠️ مسائل گرانشی (غیرقابل حل - شرایط پایدار واقعیت)
این مسائل مثل جاذبه زمین هستند. به جای جنگیدن با آن‌ها، باید پذیرفته شده و دور زده شوند:

${gravityList.map((p, i) => `${i + 1}. **${p.content}**\n   - صورت‌بندی لنگر: ${p.anchorStatement || "تعیین نشده"}`).join("\n\n") || "مسئله گرانشی ثبت نشده است."}

---

## 💡 چالش‌های قابل طراحی (امکان بازچارچوب‌بندی و اقدام)
این مسائل ظرفیت حل شدن، آزمودن و ساختن دارند:

${designableList.map((p, i) => `${i + 1}. **${p.content}**\n   - سؤال بازچارچوب‌شده: *${p.reframedQuestion || "هنوز بازچارچوب‌بندی نشده"}*`).join("\n\n") || "چالشی ثبت نشده است."}
`;

      // 5. Good Time Journal
      files["Journal/Index.md"] = `---
type: journal_index
totalEntries: ${journalEntries.length}
totalFindings: ${reflectionFindings.length}
---

# دفترچه اوقات خوش (Good Time Journal)

${journalEntries.map((j) => `- [[Journal/${j.id}|${j.title}]] (انرژی: ${j.energy}% | اشتیاق: ${j.engagement}%${j.isFlow ? " | حالت غرقگی 🌊" : ""})`).join("\n") || "ثبتی وجود ندارد."}
`;

      for (const entry of journalEntries) {
        const findings = reflectionFindings.filter((f) => f.journalEntryId === entry.id);
        files[`Journal/${entry.id}.md`] = `---
type: journal_entry
id: "${entry.id}"
title: "${entry.title}"
engagement: ${entry.engagement}
energy: ${entry.energy}
isFlow: ${entry.isFlow}
durationMinutes: ${entry.durationMinutes ?? 0}
occurredAt: "${new Date(entry.occurredAt).toISOString()}"
---

# ${entry.title}

- **میزان اشتیاق (Engagement):** ${entry.engagement}%
- **میزان انرژی (Energy):** ${entry.energy}%
- **وضعیت غرقگی (Flow):** ${entry.isFlow ? "بله" : "خیر"}
- **مدت زمان:** ${entry.durationMinutes || 0} دقیقه

${findings.length > 0 ? `## یافته‌های بازتاب هفتگی\n${findings.map((f) => `- [${f.tag}] ${f.notes}`).join("\n")}` : ""}
`;
      }

      // 6. Odyssey Plans
      files["Odyssey/Index.md"] = `---
type: odyssey_index
totalPlans: ${odysseyPlans.length}
---

# برنامه‌های پنج‌ساله سه‌گانه ادیسه

${odysseyPlans.map((p) => `- [[Odyssey/${p.slot}|${p.slot}: ${p.sixWordTitle}]]`).join("\n") || "پلنی ذخیره نشده است."}
`;

      for (const plan of odysseyPlans) {
        let questions: string[] = [];
        try {
          questions = JSON.parse(plan.questionsJson);
        } catch {
          questions = [];
        }

        let events: Array<{ year: number; type: string; description: string }> = [];
        try {
          events = JSON.parse(plan.timelineEventsJson);
        } catch {
          events = [];
        }

        const planFeedbacks = odysseyFeedbacks.filter(
          (f) => f.odysseyPlanId === plan.id || f.odysseyPlanId === plan.slot,
        );

        files[`Odyssey/${plan.slot}.md`] = `---
type: odyssey_plan
slot: "${plan.slot}"
title: "${plan.sixWordTitle}"
resources: ${plan.resources}
likability: ${plan.likability}
confidence: ${plan.confidence}
coherence: ${plan.coherence}
---

# مسیر ادیسه: ${plan.sixWordTitle} (${plan.slot})

## سنجه‌های چهارگانه
- **منابع و امکانات:** ${plan.resources}%
- **دوست‌داشتنی بودن:** ${plan.likability}%
- **اطمینان و اعتمادبه‌نفس:** ${plan.confidence}%
- **انسجام با قطب‌نما:** ${plan.coherence}%

## ۳ سؤال کلیدی فرضیه‌ساز
${questions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")}

## گاه‌شمار ۵ ساله
${events.map((e) => `- سال ${e.year} [${e.type === "work" ? "کاری" : "شخصی"}]: ${e.description}`).join("\n")}

${planFeedbacks.length > 0 ? `## بازخوردهای ارائه (Pitch Mode)\n${planFeedbacks.map((f) => `### بازخورد شنوندگان\n${f.externalFeedback}\n\n### حس درونی ارائه دهنده\n${f.presenterEnergyNote}`).join("\n\n---\n\n")}` : ""}
`;
      }

      // 7. Prototypes Lab
      files["Prototypes/Index.md"] = `---
type: prototypes_index
totalPrototypes: ${prototypes.length}
---

# آزمایشگاه پروتوتایپ (Prototyping Lab)

${prototypes.map((p) => `- [[Prototypes/${p.id}|${p.type === "CONVERSATION" ? "گفت‌وگو" : "تجربه"}: ${p.hypothesis} (${p.status})]]`).join("\n") || "پروتوتایپی ثبت نشده است."}
`;

      for (const proto of prototypes) {
        files[`Prototypes/${proto.id}.md`] = `---
type: prototype
id: "${proto.id}"
protoType: "${proto.type}"
status: "${proto.status}"
hypothesis: "${proto.hypothesis}"
---

# پروتوتایپ: ${proto.type === "CONVERSATION" ? "مصاحبه داستان‌محور" : "آزمون سریع تجربه"}

- **فرضیه مورد آزمون:** ${proto.hypothesis}
- **وضعیت کنونی:** ${proto.status}
${proto.outcome ? `\n## نتیجه و یافته‌ها\n${proto.outcome}` : ""}
`;
      }

      return ok(files);
    } catch (error: unknown) {
      return err(
        new StorageError("TRANSACTION_FAILED", "Failed to generate Markdown archive", error),
      );
    }
  }
}
