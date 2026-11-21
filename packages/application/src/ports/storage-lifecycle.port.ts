import type { Result } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface StorageStatus {
  isInitialized: boolean;
  vfs: string;
  databaseName: string;
  schemaVersion: number;
  totalRecordsEstimate: number;
}

export interface IStorageLifecycle {
  initialize(): Promise<Result<void, StorageError>>;
  close(): Promise<void>;
  getStatus(): Promise<StorageStatus>;
  vacuum(): Promise<Result<void, StorageError>>;
}
