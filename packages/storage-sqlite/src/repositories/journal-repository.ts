import { type IJournalRepository, StorageError } from "@odyssey/application";
import {
  AeiouAnalysis,
  HlcTimestamp,
  JournalEntry,
  ReflectionFinding,
  type ReflectionTag,
  type Result,
  err,
  ok,
} from "@odyssey/domain";
import type { ISqlDriver } from "../driver/sql-driver.interface.js";

interface JournalEntryRow {
  id: string;
  cycle_id: string;
  title: string;
  engagement: number;
  energy: number;
  is_flow: number;
  occurred_at: number;
  duration_minutes: number | null;
  created_at: number;
  updated_at: number;
}

interface ReflectionFindingRow {
  id: string;
  cycle_id: string;
  journal_entry_id: string;
  tag: string;
  notes: string;
  created_at: number;
  updated_at: number;
}

interface AeiouAnalysisRow {
  id: string;
  cycle_id: string;
  reflection_finding_id: string;
  activities: string;
  environments: string;
  interactions: string;
  objects: string;
  users: string;
  created_at: number;
  updated_at: number;
}

export class SqliteJournalRepository implements IJournalRepository {
  constructor(private readonly driver: ISqlDriver) {}

  public async saveJournalEntry(entry: JournalEntry): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", entry.createdAt).toString();
      await this.driver.run(
        `INSERT INTO journal_entries (
          id, cycle_id, title, engagement, energy, is_flow, occurred_at,
          duration_minutes, created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          engagement = excluded.engagement,
          energy = excluded.energy,
          is_flow = excluded.is_flow,
          occurred_at = excluded.occurred_at,
          duration_minutes = excluded.duration_minutes,
          updated_at = excluded.updated_at,
          hlc_timestamp = excluded.hlc_timestamp;`,
        [
          entry.id,
          entry.cycleId,
          entry.title,
          entry.engagement,
          entry.energy,
          entry.isFlow ? 1 : 0,
          entry.occurredAt,
          entry.durationMinutes ?? null,
          entry.createdAt,
          entry.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save journal entry", error));
    }
  }

  public async getJournalEntries(cycleId?: string): Promise<Result<JournalEntry[], StorageError>> {
    try {
      const query = cycleId
        ? `SELECT id, cycle_id, title, engagement, energy, is_flow, occurred_at,
                  duration_minutes, created_at, updated_at
           FROM journal_entries
           WHERE cycle_id = ? AND deleted_at IS NULL
           ORDER BY occurred_at DESC;`
        : `SELECT id, cycle_id, title, engagement, energy, is_flow, occurred_at,
                  duration_minutes, created_at, updated_at
           FROM journal_entries
           WHERE deleted_at IS NULL
           ORDER BY occurred_at DESC;`;

      const params = cycleId ? [cycleId] : [];
      const rows = await this.driver.all<JournalEntryRow>(query, params);

      const entries: JournalEntry[] = [];
      for (const row of rows) {
        const createResult = JournalEntry.create(
          {
            cycleId: row.cycle_id,
            title: row.title,
            engagement: row.engagement,
            energy: row.energy,
            isFlow: Boolean(row.is_flow),
            occurredAt: row.occurred_at,
            durationMinutes: row.duration_minutes ?? undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          row.id,
        );

        if (createResult.ok) {
          entries.push(createResult.value);
        }
      }

      return ok(entries);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch journal entries", error));
    }
  }

  public async deleteJournalEntry(id: string): Promise<Result<void, StorageError>> {
    try {
      const now = Date.now();
      await this.driver.run(
        "UPDATE journal_entries SET deleted_at = ?, updated_at = ? WHERE id = ?;",
        [now, now, id],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to delete journal entry", error));
    }
  }

  public async saveReflectionFinding(
    finding: ReflectionFinding,
  ): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", finding.createdAt).toString();
      await this.driver.run(
        `INSERT INTO reflection_findings (
          id, cycle_id, journal_entry_id, tag, notes,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          finding.id,
          finding.cycleId,
          finding.journalEntryId,
          finding.tag,
          finding.notes,
          finding.createdAt,
          finding.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save reflection finding", error));
    }
  }

  public async getReflectionFindings(
    journalEntryId?: string,
  ): Promise<Result<ReflectionFinding[], StorageError>> {
    try {
      const query = journalEntryId
        ? `SELECT id, cycle_id, journal_entry_id, tag, notes, created_at, updated_at
           FROM reflection_findings
           WHERE journal_entry_id = ? AND deleted_at IS NULL
           ORDER BY created_at DESC;`
        : `SELECT id, cycle_id, journal_entry_id, tag, notes, created_at, updated_at
           FROM reflection_findings
           WHERE deleted_at IS NULL
           ORDER BY created_at DESC;`;

      const params = journalEntryId ? [journalEntryId] : [];
      const rows = await this.driver.all<ReflectionFindingRow>(query, params);

      const findings: ReflectionFinding[] = [];
      for (const row of rows) {
        const createResult = ReflectionFinding.create(
          {
            cycleId: row.cycle_id,
            journalEntryId: row.journal_entry_id,
            tag: row.tag as ReflectionTag,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          row.id,
        );

        if (createResult.ok) {
          findings.push(createResult.value);
        }
      }

      return ok(findings);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch reflection findings", error));
    }
  }

  public async saveAeiouAnalysis(analysis: AeiouAnalysis): Promise<Result<void, StorageError>> {
    try {
      const hlc = HlcTimestamp.create("local-node", analysis.createdAt).toString();
      await this.driver.run(
        `INSERT INTO aeiou_analyses (
          id, cycle_id, reflection_finding_id,
          activities, environments, interactions, objects, users,
          created_at, updated_at, hlc_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          activities = excluded.activities,
          environments = excluded.environments,
          interactions = excluded.interactions,
          objects = excluded.objects,
          users = excluded.users,
          updated_at = excluded.updated_at,
          hlc_timestamp = excluded.hlc_timestamp;`,
        [
          analysis.id,
          analysis.cycleId,
          analysis.reflectionFindingId,
          analysis.activities,
          analysis.environments,
          analysis.interactions,
          analysis.objects,
          analysis.users,
          analysis.createdAt,
          analysis.updatedAt,
          hlc,
        ],
      );
      return ok(undefined);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to save AEIOU analysis", error));
    }
  }

  public async getAeiouByFindingId(
    findingId: string,
  ): Promise<Result<AeiouAnalysis | null, StorageError>> {
    try {
      const row = await this.driver.get<AeiouAnalysisRow>(
        `SELECT id, cycle_id, reflection_finding_id,
                activities, environments, interactions, objects, users,
                created_at, updated_at
         FROM aeiou_analyses
         WHERE reflection_finding_id = ? AND deleted_at IS NULL
         LIMIT 1;`,
        [findingId],
      );

      if (!row) return ok(null);

      const createResult = AeiouAnalysis.create(
        {
          cycleId: row.cycle_id,
          reflectionFindingId: row.reflection_finding_id,
          activities: row.activities,
          environments: row.environments,
          interactions: row.interactions,
          objects: row.objects,
          users: row.users,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
        row.id,
      );

      if (!createResult.ok) {
        return err(
          new StorageError(
            "SCHEMA_CORRUPTED",
            "Corrupt AEIOU analysis row retrieved from database",
          ),
        );
      }

      return ok(createResult.value);
    } catch (error) {
      return err(new StorageError("QUERY_FAILED", "Failed to fetch AEIOU analysis", error));
    }
  }
}
