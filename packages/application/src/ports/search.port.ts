import type { Result } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface SearchMatch {
  entityId: string;
  entityType: "journal_entry" | "aeiou_analysis" | "odyssey_plan" | "prototype" | "failure_log";
  cycleId: string;
  title: string;
  snippet: string;
  rank: number;
}

export interface ISearchRepository {
  search(
    query: string,
    cycleId?: string,
    limit?: number,
  ): Promise<Result<SearchMatch[], StorageError>>;
}
