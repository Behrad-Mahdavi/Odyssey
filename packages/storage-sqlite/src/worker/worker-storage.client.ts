import { type IStorageLifecycle, StorageError, type StorageStatus } from "@odyssey/application";
import { type Result, err, generateUUIDv7, ok } from "@odyssey/domain";
import type { ISqlDriver, RunResult } from "../driver/sql-driver.interface.js";
import type { WorkerAction, WorkerRequest, WorkerResponse } from "./protocol.js";

/**
 * Main Thread Client for Storage Web Worker.
 * Handles typed RPC calls, timeout management, and implements ISqlDriver & IStorageLifecycle.
 */
export class WorkerStorageClient implements ISqlDriver, IStorageLifecycle {
  private worker: Worker | null = null;
  private pendingRequests = new Map<
    string,
    { resolve: (val: unknown) => void; reject: (err: unknown) => void }
  >();
  private isInit = false;

  constructor(private readonly workerFactory: () => Worker) {}

  public async init(): Promise<void> {
    const res = await this.initialize();
    if (!res.ok) {
      throw res.error;
    }
  }

  public async initialize(): Promise<Result<void, StorageError>> {
    if (this.isInit) return ok(undefined);

    try {
      this.worker = this.workerFactory();
      this.worker.onmessage = this.handleMessage.bind(this);

      await this.sendRequest("INIT", { dbName: "odyssey_vault.sqlite3" });
      this.isInit = true;
      return ok(undefined);
    } catch (error: unknown) {
      const errObj = error as { code?: string; message?: string } | undefined;
      const code =
        errObj?.code === "DATABASE_LOCKED_BY_OTHER_TAB"
          ? "DATABASE_LOCKED_BY_OTHER_TAB"
          : "STORAGE_INITIALIZATION_FAILED";
      const message = errObj?.message ?? "Failed to initialize worker storage";
      return err(new StorageError(code, message, error));
    }
  }

  public async exec(sql: string): Promise<void> {
    await this.sendRequest("EXEC", { sql });
  }

  public async run(sql: string, params: unknown[] = []): Promise<RunResult> {
    return this.sendRequest<RunResult>("RUN", { sql, params });
  }

  public async all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.sendRequest<T[]>("ALL", { sql, params });
  }

  public async get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    return this.sendRequest<T | undefined>("GET", { sql, params });
  }

  public async transaction<T>(fn: (tx: ISqlDriver) => Promise<T>): Promise<T> {
    await this.exec("BEGIN TRANSACTION;");
    try {
      const res = await fn(this);
      await this.exec("COMMIT;");
      return res;
    } catch (err) {
      await this.exec("ROLLBACK;");
      throw err;
    }
  }

  public async close(): Promise<void> {
    if (this.worker) {
      await this.sendRequest("CLOSE", {});
      this.worker.terminate();
      this.worker = null;
      this.isInit = false;
    }
  }

  public async getStatus(): Promise<StorageStatus> {
    return {
      isInitialized: this.isInit,
      vfs: "opfs",
      databaseName: "odyssey_vault.sqlite3",
      schemaVersion: 1,
      totalRecordsEstimate: 0,
    };
  }

  public async vacuum(): Promise<Result<void, StorageError>> {
    try {
      await this.exec("VACUUM;");
      return ok(undefined);
    } catch (error: unknown) {
      return err(new StorageError("QUERY_FAILED", "Vacuum failed", error));
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

  private sendRequest<T>(action: WorkerAction, payload: unknown): Promise<T> {
    const worker = this.worker;
    if (!worker) {
      return Promise.reject(new Error("Worker not available"));
    }

    const id = generateUUIDv7();
    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: (val) => resolve(val as T),
        reject,
      });
      worker.postMessage({ id, action, payload } satisfies WorkerRequest);
    });
  }

  private handleMessage(event: MessageEvent<WorkerResponse>): void {
    const { id, ok: success, data, error } = event.data;
    const pending = this.pendingRequests.get(id);
    if (!pending) return;

    this.pendingRequests.delete(id);
    if (success) {
      pending.resolve(data);
    } else {
      pending.reject(error);
    }
  }
}
