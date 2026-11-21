import type { Result } from "@odyssey/domain";
import type { HwplAssessment, LifeProblem, ProblemClassification } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface IHwplRepository {
  saveAssessment(assessment: HwplAssessment): Promise<Result<void, StorageError>>;
  getLatestAssessment(cycleId: string): Promise<Result<HwplAssessment | null, StorageError>>;
  getAssessmentHistory(cycleId: string): Promise<Result<HwplAssessment[], StorageError>>;
}

export interface ILifeProblemRepository {
  saveProblem(problem: LifeProblem): Promise<Result<void, StorageError>>;
  getProblems(cycleId: string): Promise<Result<LifeProblem[], StorageError>>;
  updateClassification(
    problemId: string,
    classification: ProblemClassification,
  ): Promise<Result<void, StorageError>>;
  deleteProblem(problemId: string): Promise<Result<void, StorageError>>;
}
