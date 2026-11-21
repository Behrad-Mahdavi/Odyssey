import { type IPrototypeRepository, StorageError } from "@odyssey/application";
import {
  HlcTimestamp,
  type NextStepVerdict,
  Prototype,
  type PrototypeStatus,
  type PrototypeType,
  type Result,
  err,
  ok,
} from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface PrototypeRow {
  id: string;
  cycle_id: string;
  odyssey_plan_id: string | null;
  question_index: number | null;
  type: string;
  hypothesis: string;
  status: string;
  outcome: string | null;
  contact_id: string | null;
  created_at: number;
  updated_at: number;
}

interface PrototypeMetadata {
  title?: string | undefined;
  intervieweeRole?: string | undefined;
  storyQuestions?: string[] | undefined;
  conversationNotes?: string | undefined;
  referralContact?: string | undefined;
  costEstimate?: string | undefined;
  duration?: string | undefined;
  nextStepVerdict?: NextStepVerdict | undefined;
  notes?: string | undefined;
}

export class SqlitePrototypeRepository implements IPrototypeRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async savePrototype(prototype: Prototype): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", prototype.createdAt).toString();

      const metadata: PrototypeMetadata = {
        title: prototype.title,
        intervieweeRole: prototype.intervieweeRole,
        storyQuestions: prototype.storyQuestions,
        conversationNotes: prototype.conversationNotes,
        referralContact: prototype.referralContact,
        costEstimate: prototype.costEstimate,
        duration: prototype.duration,
        nextStepVerdict: prototype.nextStepVerdict,
        notes: prototype.outcome,
      };

      const outcomeJson = JSON.stringify(metadata);

      await this.driver.run(
        `INSERT INTO prototypes (
          id, cycle_id, odyssey_plan_id, question_index,
          type, hypothesis, status, outcome, contact_id,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          odyssey_plan_id = excluded.odyssey_plan_id,
          question_index = excluded.question_index,
          type = excluded.type,
          hypothesis = excluded.hypothesis,
          status = excluded.status,
          outcome = excluded.outcome,
          contact_id = excluded.contact_id,
          updated_at = excluded.updated_at,
          hlc_timestamp = excluded.hlc_timestamp;`,
        [
          prototype.id,
          prototype.cycleId,
          prototype.odysseyPlanId ?? null,
          prototype.questionIndex ?? null,
          prototype.type,
          prototype.hypothesis,
          prototype.status,
          outcomeJson,
          prototype.referralContact ?? null,
          prototype.createdAt,
          prototype.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save prototype", error));
    }
  }

  public async getPrototypes(cycleId?: string): Promise<Result<Prototype[], StorageError>> {
    try {
      const query = cycleId
        ? `SELECT id, cycle_id, odyssey_plan_id, question_index,
                  type, hypothesis, status, outcome, contact_id,
                  created_at, updated_at
           FROM prototypes
           WHERE cycle_id = ? AND deleted_at IS NULL
           ORDER BY created_at DESC;`
        : `SELECT id, cycle_id, odyssey_plan_id, question_index,
                  type, hypothesis, status, outcome, contact_id,
                  created_at, updated_at
           FROM prototypes
           WHERE deleted_at IS NULL
           ORDER BY created_at DESC;`;

      const params = cycleId ? [cycleId] : [];
      const rows = await this.driver.all<PrototypeRow>(query, params);

      const items: Prototype[] = [];
      for (const row of rows) {
        let meta: PrototypeMetadata = {};
        if (row.outcome) {
          try {
            meta = JSON.parse(row.outcome);
          } catch {
            meta = { notes: row.outcome };
          }
        }

        const createRes = Prototype.create(
          {
            cycleId: row.cycle_id,
            odysseyPlanId: row.odyssey_plan_id ?? undefined,
            questionIndex: row.question_index ?? undefined,
            type: row.type as PrototypeType,
            title: meta.title ?? row.hypothesis,
            hypothesis: row.hypothesis,
            status: row.status as PrototypeStatus,
            outcome: meta.notes,
            intervieweeRole: meta.intervieweeRole,
            storyQuestions: meta.storyQuestions,
            conversationNotes: meta.conversationNotes,
            referralContact: meta.referralContact ?? row.contact_id ?? undefined,
            costEstimate: meta.costEstimate,
            duration: meta.duration,
            nextStepVerdict: meta.nextStepVerdict,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          row.id,
        );

        if (createRes.ok) {
          items.push(createRes.value);
        }
      }

      return ok(items);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch prototypes", error));
    }
  }

  public async getPrototypesByPlan(planId: string): Promise<Result<Prototype[], StorageError>> {
    try {
      const rows = await this.driver.all<PrototypeRow>(
        `SELECT id, cycle_id, odyssey_plan_id, question_index,
                type, hypothesis, status, outcome, contact_id,
                created_at, updated_at
         FROM prototypes
         WHERE odyssey_plan_id = ? AND deleted_at IS NULL
         ORDER BY created_at DESC;`,
        [planId],
      );

      const items: Prototype[] = [];
      for (const row of rows) {
        let meta: PrototypeMetadata = {};
        if (row.outcome) {
          try {
            meta = JSON.parse(row.outcome);
          } catch {
            meta = { notes: row.outcome };
          }
        }

        const createRes = Prototype.create(
          {
            cycleId: row.cycle_id,
            odysseyPlanId: row.odyssey_plan_id ?? undefined,
            questionIndex: row.question_index ?? undefined,
            type: row.type as PrototypeType,
            title: meta.title ?? row.hypothesis,
            hypothesis: row.hypothesis,
            status: row.status as PrototypeStatus,
            outcome: meta.notes,
            intervieweeRole: meta.intervieweeRole,
            storyQuestions: meta.storyQuestions,
            conversationNotes: meta.conversationNotes,
            referralContact: meta.referralContact ?? row.contact_id ?? undefined,
            costEstimate: meta.costEstimate,
            duration: meta.duration,
            nextStepVerdict: meta.nextStepVerdict,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          row.id,
        );

        if (createRes.ok) {
          items.push(createRes.value);
        }
      }

      return ok(items);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch prototypes by plan", error));
    }
  }

  public async deletePrototype(id: string): Promise<Result<void, StorageError>> {
    try {
      const now = Date.now();
      await this.driver.run("UPDATE prototypes SET deleted_at = ?, updated_at = ? WHERE id = ?;", [
        now,
        now,
        id,
      ]);
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to delete prototype", error));
    }
  }
}
