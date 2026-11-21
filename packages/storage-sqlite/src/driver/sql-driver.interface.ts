export interface RunResult {
  changes: number;
  lastInsertRowId: number | bigint;
}

/**
 * Universal SQL Driver contract.
 * Abstracted so that WasmOpfsDriver (Web Worker), BetterSqliteDriver (Node / Native Tauri),
 * and WorkerClientDriver (Main thread RPC) share the exact same interface.
 */
export interface ISqlDriver {
  init(): Promise<void>;
  exec(sql: string): Promise<void>;
  run(sql: string, params?: unknown[]): Promise<RunResult>;
  all<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  get<T = unknown>(sql: string, params?: unknown[]): Promise<T | undefined>;
  transaction<T>(fn: (tx: ISqlDriver) => Promise<T>): Promise<T>;
  close(): Promise<void>;
  isHealthy(): Promise<boolean>;
}
