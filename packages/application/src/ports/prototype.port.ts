import type { Prototype, Result } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface IPrototypeRepository {
  savePrototype(prototype: Prototype): Promise<Result<void, StorageError>>;
  getPrototypes(cycleId?: string): Promise<Result<Prototype[], StorageError>>;
  getPrototypesByPlan(planId: string): Promise<Result<Prototype[], StorageError>>;
  deletePrototype(id: string): Promise<Result<void, StorageError>>;
}
