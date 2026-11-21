import { type IDesignCycleRepository, StorageError } from "@odyssey/application";
import { DesignCycle, HlcTimestamp, type Result, err, ok } from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface CycleRow {
  id: string;
  name: string;
  status: "ACTIVE" | "ARCHIVED_SNAPSHOT";
  started_at: number;
  snapshot_at: number | null;
  created_at: number;
  updated_at: number;
}

export class SqliteDesignCycleRepository implements IDesignCycleRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async create(cycle: DesignCycle): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", cycle.createdAt).toString();
      await this.driver.run(
        `INSERT INTO design_cycles (id, name, status, started_at, snapshot_at, created_at, updated_at, hlc_timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          cycle.id,
          cycle.name,
          cycle.status,
          cycle.startedAt,
          cycle.snapshotAt,
          cycle.createdAt,
          cycle.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to insert design cycle", error));
    }
  }

  public async findById(id: string): Promise<Result<DesignCycle | null, StorageError>> {
    try {
      const row = await this.driver.get<CycleRow>(
        "SELECT id, name, status, started_at, snapshot_at, created_at, updated_at FROM design_cycles WHERE id = ? AND deleted_at IS NULL;",
        [id],
      );
      if (!row) return ok(null);

      const cycle = new DesignCycle(
        row.id,
        {
          name: row.name,
          status: row.status,
          startedAt: row.started_at,
          snapshotAt: row.snapshot_at,
        },
        row.created_at,
        row.updated_at,
      );
      return ok(cycle);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to query design cycle by ID", error));
    }
  }

  public async findActive(): Promise<Result<DesignCycle | null, StorageError>> {
    try {
      const row = await this.driver.get<CycleRow>(
        "SELECT id, name, status, started_at, snapshot_at, created_at, updated_at FROM design_cycles WHERE status = 'ACTIVE' AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1;",
      );
      if (!row) return ok(null);

      const cycle = new DesignCycle(
        row.id,
        {
          name: row.name,
          status: row.status,
          startedAt: row.started_at,
          snapshotAt: row.snapshot_at,
        },
        row.created_at,
        row.updated_at,
      );
      return ok(cycle);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to query active design cycle", error));
    }
  }

  public async findAll(): Promise<Result<DesignCycle[], StorageError>> {
    try {
      const rows = await this.driver.all<CycleRow>(
        "SELECT id, name, status, started_at, snapshot_at, created_at, updated_at FROM design_cycles WHERE deleted_at IS NULL ORDER BY created_at ASC;",
      );
      const cycles = rows.map(
        (r) =>
          new DesignCycle(
            r.id,
            {
              name: r.name,
              status: r.status,
              startedAt: r.started_at,
              snapshotAt: r.snapshot_at,
            },
            r.created_at,
            r.updated_at,
          ),
      );
      return ok(cycles);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to query all design cycles", error));
    }
  }

  public async update(cycle: DesignCycle): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", cycle.updatedAt).toString();
      await this.driver.run(
        `UPDATE design_cycles
         SET name = ?, status = ?, started_at = ?, snapshot_at = ?, updated_at = ?, hlc_timestamp = ?
         WHERE id = ? AND deleted_at IS NULL;`,
        [
          cycle.name,
          cycle.status,
          cycle.startedAt,
          cycle.snapshotAt,
          cycle.updatedAt,
          hlc,
          cycle.id,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to update design cycle", error));
    }
  }
}
