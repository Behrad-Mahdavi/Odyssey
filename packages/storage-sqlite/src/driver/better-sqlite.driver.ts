import Database from "better-sqlite3";
import type { ISqlDriver, RunResult } from "./sql-driver.interface.js";

/**
 * Native SQLite Driver using better-sqlite3.
 * Used for Vitest unit testing, CLI tools, and Tauri v2 desktop integration.
 */
export class BetterSqliteDriver implements ISqlDriver {
  private db: Database.Database | null = null;

  constructor(private readonly filename: string = ":memory:") {}

  public async init(): Promise<void> {
    if (this.db) return;

    this.db = new Database(this.filename);

    // Obligatory Enterprise PRAGMAs
    this.db.pragma("foreign_keys = ON");
    this.db.pragma("busy_timeout = 5000");
    this.db.pragma("synchronous = NORMAL");
    this.db.pragma("temp_store = MEMORY");
  }

  public async exec(sql: string): Promise<void> {
    this.ensureDb().exec(sql);
  }

  public async run(sql: string, params: unknown[] = []): Promise<RunResult> {
    const stmt = this.ensureDb().prepare(sql);
    const result = stmt.run(...params);
    return {
      changes: result.changes,
      lastInsertRowId: result.lastInsertRowid,
    };
  }

  public async all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const stmt = this.ensureDb().prepare(sql);
    return stmt.all(...params) as T[];
  }

  public async get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    const stmt = this.ensureDb().prepare(sql);
    return stmt.get(...params) as T | undefined;
  }

  public async transaction<T>(fn: (tx: ISqlDriver) => Promise<T>): Promise<T> {
    const db = this.ensureDb();
    db.exec("BEGIN TRANSACTION;");
    try {
      const res = await fn(this);
      db.exec("COMMIT;");
      return res;
    } catch (err) {
      db.exec("ROLLBACK;");
      throw err;
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  public async isHealthy(): Promise<boolean> {
    try {
      const res = await this.get<{ ok: number }>("SELECT 1 as ok;");
      return res?.ok === 1;
    } catch {
      return false;
    }
  }

  private ensureDb(): Database.Database {
    if (!this.db) {
      throw new Error("Database driver not initialized. Call init() first.");
    }
    return this.db;
  }
}
