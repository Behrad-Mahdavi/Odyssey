import { type ICompassRepository, StorageError } from "@odyssey/application";
import { CompassEntry, HlcTimestamp, type Result, err, ok } from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface CompassRow {
  id: string;
  cycle_id: string;
  workview: string;
  lifeview: string;
  coherence_complement: string | null;
  coherence_conflict: string | null;
  coherence_guide: string | null;
  created_at: number;
  updated_at: number;
}

export class SqliteCompassRepository implements ICompassRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async saveEntry(entry: CompassEntry): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", entry.createdAt).toString();
      await this.driver.run(
        `INSERT INTO compass_entries (
          id, cycle_id, workview, lifeview,
          coherence_complement, coherence_conflict, coherence_guide,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          entry.id,
          entry.cycleId,
          entry.workview,
          entry.lifeview,
          entry.coherenceComplement ?? null,
          entry.coherenceConflict ?? null,
          entry.coherenceGuide ?? null,
          entry.createdAt,
          entry.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save compass entry", error));
    }
  }

  public async getLatest(cycleId: string): Promise<Result<CompassEntry | null, StorageError>> {
    try {
      const row = await this.driver.get<CompassRow>(
        `SELECT id, cycle_id, workview, lifeview,
                coherence_complement, coherence_conflict, coherence_guide,
                created_at, updated_at
         FROM compass_entries
         WHERE cycle_id = ? AND deleted_at IS NULL
         ORDER BY created_at DESC
         LIMIT 1;`,
        [cycleId],
      );
      if (!row) return ok(null);

      const entry = CompassEntry.create(
        {
          cycleId: row.cycle_id,
          workview: row.workview,
          lifeview: row.lifeview,
          coherenceComplement: row.coherence_complement ?? undefined,
          coherenceConflict: row.coherence_conflict ?? undefined,
          coherenceGuide: row.coherence_guide ?? undefined,
        },
        row.id,
      );

      return ok(entry);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to get latest compass entry", error));
    }
  }

  public async getHistory(cycleId: string): Promise<Result<CompassEntry[], StorageError>> {
    try {
      const rows = await this.driver.all<CompassRow>(
        `SELECT id, cycle_id, workview, lifeview,
                coherence_complement, coherence_conflict, coherence_guide,
                created_at, updated_at
         FROM compass_entries
         WHERE cycle_id = ? AND deleted_at IS NULL
         ORDER BY created_at ASC;`,
        [cycleId],
      );

      const entries = rows.map((row) =>
        CompassEntry.create(
          {
            cycleId: row.cycle_id,
            workview: row.workview,
            lifeview: row.lifeview,
            coherenceComplement: row.coherence_complement ?? undefined,
            coherenceConflict: row.coherence_conflict ?? undefined,
            coherenceGuide: row.coherence_guide ?? undefined,
          },
          row.id,
        ),
      );

      return ok(entries);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to get compass history", error));
    }
  }
}
