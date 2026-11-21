import type { AeiouAnalysis, JournalEntry, ReflectionFinding, Result } from "@odyssey/domain";
import type { StorageError } from "../errors/storage-error.js";

export interface IJournalRepository {
  saveJournalEntry(entry: JournalEntry): Promise<Result<void, StorageError>>;
  getJournalEntries(cycleId?: string): Promise<Result<JournalEntry[], StorageError>>;
  deleteJournalEntry(id: string): Promise<Result<void, StorageError>>;

  saveReflectionFinding(finding: ReflectionFinding): Promise<Result<void, StorageError>>;
  getReflectionFindings(
    journalEntryId?: string,
  ): Promise<Result<ReflectionFinding[], StorageError>>;

  saveAeiouAnalysis(analysis: AeiouAnalysis): Promise<Result<void, StorageError>>;
  getAeiouByFindingId(findingId: string): Promise<Result<AeiouAnalysis | null, StorageError>>;
}
