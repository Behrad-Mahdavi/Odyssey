import { type ILifeProblemRepository, StorageError } from "@odyssey/application";
import {
  HlcTimestamp,
  LifeProblem,
  type ProblemClassification,
  type Result,
  err,
  ok,
} from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface ProblemRow {
  id: string;
  cycle_id: string;
  content: string;
  classification: ProblemClassification;
  anchor_statement: string | null;
  reframed_question: string | null;
  created_at: number;
  updated_at: number;
}

export class SqliteLifeProblemRepository implements ILifeProblemRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async saveProblem(problem: LifeProblem): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", problem.createdAt).toString();
      await this.driver.run(
        `INSERT INTO life_problems (
          id, cycle_id, content, classification,
          anchor_statement, reframed_question,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          problem.id,
          problem.cycleId,
          problem.content,
          problem.classification,
          problem.anchorStatement ?? null,
          problem.reframedQuestion ?? null,
          problem.createdAt,
          problem.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save life problem", error));
    }
  }

  public async getProblems(cycleId: string): Promise<Result<LifeProblem[], StorageError>> {
    try {
      const rows = await this.driver.all<ProblemRow>(
        `SELECT id, cycle_id, content, classification,
                anchor_statement, reframed_question,
                created_at, updated_at
         FROM life_problems
         WHERE cycle_id = ? AND deleted_at IS NULL
         ORDER BY created_at ASC;`,
        [cycleId],
      );

      const problems = rows.map((row) => {
        const problem = LifeProblem.create(row.cycle_id, row.content, row.classification, row.id);
        if (row.classification === "GRAVITY" && row.anchor_statement) {
          return problem.markAsGravity(row.anchor_statement);
        }
        if (row.classification === "DESIGNABLE" && row.reframed_question) {
          return problem.markAsDesignable(row.reframed_question);
        }
        return problem;
      });

      return ok(problems);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to get life problems", error));
    }
  }

  public async updateClassification(
    problemId: string,
    classification: ProblemClassification,
  ): Promise<Result<void, StorageError>> {
    try {
      const now = Date.now();
      const hlc = HlcTimestamp.create("local-node", now).toString();
      await this.driver.run(
        `UPDATE life_problems
         SET classification = ?, updated_at = ?, hlc_timestamp = ?
         WHERE id = ? AND deleted_at IS NULL;`,
        [classification, now, hlc, problemId],
      );
      return ok(undefined);
    } catch (error) {
      return err(
        new StorageError("QUERY_FAILED", "Failed to update problem classification", error),
      );
    }
  }

  public async deleteProblem(problemId: string): Promise<Result<void, StorageError>> {
    try {
      const now = Date.now();
      await this.driver.run(
        `UPDATE life_problems
         SET deleted_at = ?
         WHERE id = ?;`,
        [now, problemId],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to soft-delete problem", error));
    }
  }
}
