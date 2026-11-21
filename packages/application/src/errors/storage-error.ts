export type StorageErrorCode =
  | "STORAGE_NOT_INITIALIZED"
  | "STORAGE_INITIALIZATION_FAILED"
  | "DATABASE_LOCKED_BY_OTHER_TAB"
  | "MIGRATION_FAILED"
  | "QUERY_FAILED"
  | "TRANSACTION_FAILED"
  | "RECORD_NOT_FOUND"
  | "SCHEMA_CORRUPTED";

export class StorageError extends Error {
  constructor(
    public readonly code: StorageErrorCode,
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(`[${code}] ${message}`);
    this.name = "StorageError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
