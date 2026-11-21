import type { Result } from "@odyssey/domain";
import type { CompassEntry } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface ICompassRepository {
  saveEntry(entry: CompassEntry): Promise<Result<void, StorageError>>;
  getLatest(cycleId: string): Promise<Result<CompassEntry | null, StorageError>>;
  getHistory(cycleId: string): Promise<Result<CompassEntry[], StorageError>>;
}
