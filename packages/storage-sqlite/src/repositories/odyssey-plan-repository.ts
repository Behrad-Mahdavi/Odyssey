import { type IOdysseyPlanRepository, StorageError } from "@odyssey/application";
import {
  HlcTimestamp,
  OdysseyFeedback,
  OdysseyPlan,
  type OdysseySlot,
  type Result,
  type TimelineEvent,
  err,
  ok,
} from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface OdysseyPlanRow {
  id: string;
  cycle_id: string;
  slot: string;
  six_word_title: string;
  resources: number;
  likability: number;
  confidence: number;
  coherence: number;
  questions_json: string;
  timeline_events_json: string;
  created_at: number;
  updated_at: number;
}

interface OdysseyFeedbackRow {
  id: string;
  cycle_id: string;
  odyssey_plan_id: string;
  session_id: string | null;
  external_feedback: string;
  presenter_energy_note: string;
  created_at: number;
  updated_at: number;
}

export class SqliteOdysseyPlanRepository implements IOdysseyPlanRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async savePlan(plan: OdysseyPlan): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", plan.createdAt).toString();
      await this.driver.run(
        `INSERT INTO odyssey_plans (
          id, cycle_id, slot, six_word_title,
          resources, likability, confidence, coherence,
          questions_json, timeline_events_json,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          slot = excluded.slot,
          six_word_title = excluded.six_word_title,
          resources = excluded.resources,
          likability = excluded.likability,
          confidence = excluded.confidence,
          coherence = excluded.coherence,
          questions_json = excluded.questions_json,
          timeline_events_json = excluded.timeline_events_json,
          updated_at = excluded.updated_at,
          hlc_timestamp = excluded.hlc_timestamp;`,
        [
          plan.id,
          plan.cycleId,
          plan.slot,
          plan.sixWordTitle,
          plan.resources,
          plan.likability,
          plan.confidence,
          plan.coherence,
          JSON.stringify(plan.questions),
          JSON.stringify(plan.timelineEvents),
          plan.createdAt,
          plan.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save odyssey plan", error));
    }
  }

  public async getPlans(cycleId: string): Promise<Result<OdysseyPlan[], StorageError>> {
    try {
      const rows = await this.driver.all<OdysseyPlanRow>(
        `SELECT id, cycle_id, slot, six_word_title,
                resources, likability, confidence, coherence,
                questions_json, timeline_events_json,
                created_at, updated_at
         FROM odyssey_plans
         WHERE cycle_id = ? AND deleted_at IS NULL
         ORDER BY slot ASC;`,
        [cycleId],
      );

      const plans: OdysseyPlan[] = [];
      for (const row of rows) {
        let questions: [string, string, string] = ["", "", ""];
        try {
          const parsed = JSON.parse(row.questions_json);
          if (Array.isArray(parsed) && parsed.length === 3) {
            questions = [parsed[0] ?? "", parsed[1] ?? "", parsed[2] ?? ""];
          }
        } catch {
          // fallback to defaults
        }

        let timelineEvents: TimelineEvent[] = [];
        try {
          const parsedTimeline = JSON.parse(row.timeline_events_json);
          if (Array.isArray(parsedTimeline)) {
            timelineEvents = parsedTimeline;
          }
        } catch {
          // fallback to empty
        }

        const createRes = OdysseyPlan.create(
          {
            cycleId: row.cycle_id,
            slot: row.slot as OdysseySlot,
            sixWordTitle: row.six_word_title,
            resources: row.resources,
            likability: row.likability,
            confidence: row.confidence,
            coherence: row.coherence,
            questions,
            timelineEvents,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          row.id,
        );

        if (createRes.ok) {
          plans.push(createRes.value);
        }
      }

      return ok(plans);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch odyssey plans", error));
    }
  }

  public async getPlanBySlot(
    cycleId: string,
    slot: string,
  ): Promise<Result<OdysseyPlan | null, StorageError>> {
    try {
      const row = await this.driver.get<OdysseyPlanRow>(
        `SELECT id, cycle_id, slot, six_word_title,
                resources, likability, confidence, coherence,
                questions_json, timeline_events_json,
                created_at, updated_at
         FROM odyssey_plans
         WHERE cycle_id = ? AND slot = ? AND deleted_at IS NULL
         LIMIT 1;`,
        [cycleId, slot],
      );

      if (!row) return ok(null);

      let questions: [string, string, string] = ["", "", ""];
      try {
        const parsed = JSON.parse(row.questions_json);
        if (Array.isArray(parsed) && parsed.length === 3) {
          questions = [parsed[0] ?? "", parsed[1] ?? "", parsed[2] ?? ""];
        }
      } catch {
        // fallback
      }

      let timelineEvents: TimelineEvent[] = [];
      try {
        const parsedTimeline = JSON.parse(row.timeline_events_json);
        if (Array.isArray(parsedTimeline)) {
          timelineEvents = parsedTimeline;
        }
      } catch {
        // fallback
      }

      const createRes = OdysseyPlan.create(
        {
          cycleId: row.cycle_id,
          slot: row.slot as OdysseySlot,
          sixWordTitle: row.six_word_title,
          resources: row.resources,
          likability: row.likability,
          confidence: row.confidence,
          coherence: row.coherence,
          questions,
          timelineEvents,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
        row.id,
      );

      if (!createRes.ok) {
        return err(new StorageError("SCHEMA_CORRUPTED", "Corrupt odyssey plan record"));
      }

      return ok(createRes.value);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch plan by slot", error));
    }
  }

  public async saveFeedback(feedback: OdysseyFeedback): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", feedback.createdAt).toString();
      await this.driver.run(
        `INSERT INTO odyssey_feedbacks (
          id, cycle_id, odyssey_plan_id, session_id,
          external_feedback, presenter_energy_note,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          feedback.id,
          feedback.cycleId,
          feedback.odysseyPlanId,
          feedback.sessionId ?? null,
          feedback.externalFeedback,
          feedback.presenterEnergyNote,
          feedback.createdAt,
          feedback.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save odyssey feedback", error));
    }
  }

  public async getFeedbacks(planId: string): Promise<Result<OdysseyFeedback[], StorageError>> {
    try {
      const rows = await this.driver.all<OdysseyFeedbackRow>(
        `SELECT id, cycle_id, odyssey_plan_id, session_id,
                external_feedback, presenter_energy_note,
                created_at, updated_at
         FROM odyssey_feedbacks
         WHERE odyssey_plan_id = ? AND deleted_at IS NULL
         ORDER BY created_at DESC;`,
        [planId],
      );

      const feedbacks: OdysseyFeedback[] = [];
      for (const row of rows) {
        const createRes = OdysseyFeedback.create(
          {
            cycleId: row.cycle_id,
            odysseyPlanId: row.odyssey_plan_id,
            sessionId: row.session_id ?? undefined,
            externalFeedback: row.external_feedback,
            presenterEnergyNote: row.presenter_energy_note,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          row.id,
        );

        if (createRes.ok) {
          feedbacks.push(createRes.value);
        }
      }

      return ok(feedbacks);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch odyssey feedbacks", error));
    }
  }
}
