import type { DesignCycle, Result } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface IDesignCycleRepository {
  create(cycle: DesignCycle): Promise<Result<void, StorageError>>;
  findById(id: string): Promise<Result<DesignCycle | null, StorageError>>;
  findActive(): Promise<Result<DesignCycle | null, StorageError>>;
  findAll(): Promise<Result<DesignCycle[], StorageError>>;
  update(cycle: DesignCycle): Promise<Result<void, StorageError>>;
}
