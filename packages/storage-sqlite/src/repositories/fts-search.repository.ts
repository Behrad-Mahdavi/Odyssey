import { type ISearchRepository, type SearchMatch, StorageError } from "@odyssey/application";
import { type Result, err, ok } from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";
import { executeFtsSearch } from "../fts/fts5-setup.js";

export class SqliteSearchRepository implements ISearchRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async search(
    query: string,
    cycleId?: string,
    limit = 20,
  ): Promise<Result<SearchMatch[], StorageError>> {
    try {
      const results = await executeFtsSearch(this.driver, query, cycleId, limit);
      const matches: SearchMatch[] = results.map((r) => ({
        entityId: r.entityId,
        entityType: r.entityType as SearchMatch["entityType"],
        cycleId: r.cycleId,
        title: r.title,
        snippet: r.snippet,
        rank: r.rank,
      }));
      return ok(matches);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "FTS5 search query failed", error));
    }
  }
}
