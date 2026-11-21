import { type IHwplRepository, StorageError } from "@odyssey/application";
import { HlcTimestamp, HwplAssessment, type Result, err, ok } from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface HwplRow {
  id: string;
  cycle_id: string;
  health: number;
  work: number;
  play: number;
  love: number;
  health_notes: string | null;
  work_notes: string | null;
  play_notes: string | null;
  love_notes: string | null;
  created_at: number;
  updated_at: number;
}

export class SqliteHwplRepository implements IHwplRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async saveAssessment(assessment: HwplAssessment): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", assessment.createdAt).toString();
      await this.driver.run(
        `INSERT INTO hwpl_assessments (
          id, cycle_id, health, work, play, love,
          health_notes, work_notes, play_notes, love_notes,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          assessment.id,
          assessment.cycleId,
          assessment.health,
          assessment.work,
          assessment.play,
          assessment.love,
          assessment.healthNotes ?? null,
          assessment.workNotes ?? null,
          assessment.playNotes ?? null,
          assessment.loveNotes ?? null,
          assessment.createdAt,
          assessment.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save HWPL assessment", error));
    }
  }

  public async getLatestAssessment(
    cycleId: string,
  ): Promise<Result<HwplAssessment | null, StorageError>> {
    try {
      const row = await this.driver.get<HwplRow>(
        `SELECT id, cycle_id, health, work, play, love,
                health_notes, work_notes, play_notes, love_notes,
                created_at, updated_at
         FROM hwpl_assessments
         WHERE cycle_id = ? AND deleted_at IS NULL
         ORDER BY created_at DESC
         LIMIT 1;`,
        [cycleId],
      );
      if (!row) return ok(null);

      const assessmentRes = HwplAssessment.create(
        {
          cycleId: row.cycle_id,
          health: row.health,
          work: row.work,
          play: row.play,
          love: row.love,
          healthNotes: row.health_notes ?? undefined,
          workNotes: row.work_notes ?? undefined,
          playNotes: row.play_notes ?? undefined,
          loveNotes: row.love_notes ?? undefined,
        },
        row.id,
      );

      if (!assessmentRes.ok) {
        return err(new StorageError("QUERY_FAILED", "Corrupted HWPL data in database"));
      }

      return ok(assessmentRes.value);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to get latest HWPL assessment", error));
    }
  }

  public async getAssessmentHistory(
    cycleId: string,
  ): Promise<Result<HwplAssessment[], StorageError>> {
    try {
      const rows = await this.driver.all<HwplRow>(
        `SELECT id, cycle_id, health, work, play, love,
                health_notes, work_notes, play_notes, love_notes,
                created_at, updated_at
         FROM hwpl_assessments
         WHERE cycle_id = ? AND deleted_at IS NULL
         ORDER BY created_at ASC;`,
        [cycleId],
      );

      const assessments: HwplAssessment[] = [];
      for (const row of rows) {
        const res = HwplAssessment.create(
          {
            cycleId: row.cycle_id,
            health: row.health,
            work: row.work,
            play: row.play,
            love: row.love,
            healthNotes: row.health_notes ?? undefined,
            workNotes: row.work_notes ?? undefined,
            playNotes: row.play_notes ?? undefined,
            loveNotes: row.love_notes ?? undefined,
          },
          row.id,
        );
        if (res.ok) {
          assessments.push(res.value);
        }
      }

      return ok(assessments);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to get HWPL history", error));
    }
  }
}
