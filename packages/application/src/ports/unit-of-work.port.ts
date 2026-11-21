import type { Result } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface IUnitOfWork {
  executeInTransaction<T>(work: () => Promise<T>): Promise<Result<T, StorageError>>;
}
