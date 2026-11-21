import type { OdysseyFeedback, OdysseyPlan, Result } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface IOdysseyPlanRepository {
  savePlan(plan: OdysseyPlan): Promise<Result<void, StorageError>>;
  getPlans(cycleId: string): Promise<Result<OdysseyPlan[], StorageError>>;
  getPlanBySlot(cycleId: string, slot: string): Promise<Result<OdysseyPlan | null, StorageError>>;

  saveFeedback(feedback: OdysseyFeedback): Promise<Result<void, StorageError>>;
  getFeedbacks(planId: string): Promise<Result<OdysseyFeedback[], StorageError>>;
}
