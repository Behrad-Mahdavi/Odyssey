import type { Result } from "@odyssey/domain";

/**
 * Port contract for Local-First Storage Adapter (SQLite OPFS / Native).
 */
export interface IStoragePort {
  init(): Promise<Result<void, Error>>;
  execute(sql: string, params?: unknown[]): Promise<Result<unknown[], Error>>;
  close(): Promise<void>;
}
