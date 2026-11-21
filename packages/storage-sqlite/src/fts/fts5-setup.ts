import type { ISqlDriver } from "../driver/sql-driver.interface.js";
import { buildFts5Query } from "./fts-normalizer.js";

export interface FtsSearchResult {
  entityId: string;
  entityType: string;
  cycleId: string;
  title: string;
  snippet: string;
  rank: number;
}

export async function setupFts5(driver: ISqlDriver): Promise<void> {
  // 1. Create FTS5 virtual table
  await driver.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS fts_search_index USING fts5(
      entity_id UNINDEXED,
      entity_type UNINDEXED,
      cycle_id UNINDEXED,
      title,
      content,
      tokenize = 'unicode61'
    );
  `);

  // 2. Triggers for journal_entries
  await driver.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_journal_insert AFTER INSERT ON journal_entries BEGIN
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'journal_entry', new.cycle_id, new.title, new.title);
    END;

    CREATE TRIGGER IF NOT EXISTS trg_journal_update AFTER UPDATE ON journal_entries BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'journal_entry', new.cycle_id, new.title, new.title);
    END;

    CREATE TRIGGER IF NOT EXISTS trg_journal_delete AFTER DELETE ON journal_entries BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
    END;
  `);

  // 3. Triggers for aeiou_analyses
  await driver.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_aeiou_insert AFTER INSERT ON aeiou_analyses BEGIN
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'aeiou_analysis', new.cycle_id, 'AEIOU Analysis',
              new.activities || ' ' || new.environments || ' ' || new.interactions || ' ' || new.objects || ' ' || new.users);
    END;

    CREATE TRIGGER IF NOT EXISTS trg_aeiou_update AFTER UPDATE ON aeiou_analyses BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'aeiou_analysis', new.cycle_id, 'AEIOU Analysis',
              new.activities || ' ' || new.environments || ' ' || new.interactions || ' ' || new.objects || ' ' || new.users);
    END;

    CREATE TRIGGER IF NOT EXISTS trg_aeiou_delete AFTER DELETE ON aeiou_analyses BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
    END;
  `);

  // 4. Triggers for odyssey_plans
  await driver.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_odyssey_insert AFTER INSERT ON odyssey_plans BEGIN
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'odyssey_plan', new.cycle_id, new.six_word_title, new.six_word_title || ' ' || new.questions_json);
    END;

    CREATE TRIGGER IF NOT EXISTS trg_odyssey_update AFTER UPDATE ON odyssey_plans BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'odyssey_plan', new.cycle_id, new.six_word_title, new.six_word_title || ' ' || new.questions_json);
    END;

    CREATE TRIGGER IF NOT EXISTS trg_odyssey_delete AFTER DELETE ON odyssey_plans BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
    END;
  `);

  // 5. Triggers for prototypes
  await driver.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_prototype_insert AFTER INSERT ON prototypes BEGIN
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'prototype', new.cycle_id, new.hypothesis, new.hypothesis || ' ' || coalesce(new.outcome, ''));
    END;

    CREATE TRIGGER IF NOT EXISTS trg_prototype_update AFTER UPDATE ON prototypes BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'prototype', new.cycle_id, new.hypothesis, new.hypothesis || ' ' || coalesce(new.outcome, ''));
    END;

    CREATE TRIGGER IF NOT EXISTS trg_prototype_delete AFTER DELETE ON prototypes BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
    END;
  `);

  // 6. Triggers for failure_logs
  await driver.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_failure_insert AFTER INSERT ON failure_logs BEGIN
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'failure_log', new.cycle_id, new.description,
              new.description || ' ' || coalesce(new.critical_factor, '') || ' ' || coalesce(new.next_action, ''));
    END;

    CREATE TRIGGER IF NOT EXISTS trg_failure_update AFTER UPDATE ON failure_logs BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
      INSERT INTO fts_search_index(entity_id, entity_type, cycle_id, title, content)
      VALUES (new.id, 'failure_log', new.cycle_id, new.description,
              new.description || ' ' || coalesce(new.critical_factor, '') || ' ' || coalesce(new.next_action, ''));
    END;

    CREATE TRIGGER IF NOT EXISTS trg_failure_delete AFTER DELETE ON failure_logs BEGIN
      DELETE FROM fts_search_index WHERE entity_id = old.id;
    END;
  `);
}

export async function executeFtsSearch(
  driver: ISqlDriver,
  rawQuery: string,
  cycleId?: string,
  limit = 20,
): Promise<FtsSearchResult[]> {
  const matchExpression = buildFts5Query(rawQuery);
  if (!matchExpression) {
    return [];
  }

  let sql = `
    SELECT
      entity_id as entityId,
      entity_type as entityType,
      cycle_id as cycleId,
      title,
      snippet(fts_search_index, 4, '<b>', '</b>', '...', 16) as snippet,
      rank
    FROM fts_search_index
    WHERE fts_search_index MATCH ?
  `;

  const params: unknown[] = [matchExpression];

  if (cycleId) {
    sql += " AND cycle_id = ?";
    params.push(cycleId);
  }

  sql += " ORDER BY rank LIMIT ?";
  params.push(limit);

  return driver.all<FtsSearchResult>(sql, params);
}
