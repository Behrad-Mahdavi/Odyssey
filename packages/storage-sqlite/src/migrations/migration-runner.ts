import type { ISqlDriver } from "../driver/sql-driver.interface.js";

export interface Migration {
  version: number;
  name: string;
  up: (driver: ISqlDriver) => Promise<void>;
  down?: (driver: ISqlDriver) => Promise<void>;
}

export class MigrationRunner {
  constructor(
    private readonly driver: ISqlDriver,
    private readonly migrations: Migration[],
  ) {}

  public async setupTable(): Promise<void> {
    await this.driver.exec(`
      CREATE TABLE IF NOT EXISTS _odyssey_migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at INTEGER NOT NULL
      );
    `);
  }

  public async getAppliedVersions(): Promise<number[]> {
    await this.setupTable();
    const rows = await this.driver.all<{ version: number }>(
      "SELECT version FROM _odyssey_migrations ORDER BY version ASC;",
    );
    return rows.map((r) => r.version);
  }

  public async runPending(): Promise<number> {
    await this.setupTable();
    const applied = new Set(await this.getAppliedVersions());
    const pending = this.migrations
      .filter((m) => !applied.has(m.version))
      .sort((a, b) => a.version - b.version);

    let appliedCount = 0;
    for (const migration of pending) {
      await this.driver.transaction(async (tx) => {
        await migration.up(tx);
        await tx.run(
          "INSERT INTO _odyssey_migrations (version, name, applied_at) VALUES (?, ?, ?);",
          [migration.version, migration.name, Date.now()],
        );
      });
      appliedCount++;
    }

    return appliedCount;
  }
}
