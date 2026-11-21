import { Entity } from "../core/entity.js";
import {
  DomainInvariantError,
  type DomainRangeError,
  OrphanRecordError,
} from "../core/invariant-error.js";
import { validateRange } from "../core/range-validator.js";
import { type Result, err, ok } from "../core/result.js";
import { generateUUIDv7 } from "../types/uuid.js";

export type ReflectionTag = "TREND" | "INSIGHT" | "SURPRISE";

export interface JournalEntryProps {
  cycleId: string;
  title: string;
  engagement: number; // 0..100 (INV-01)
  energy: number; // -100..+100 (INV-01)
  isFlow: boolean;
  occurredAt: number;
  durationMinutes?: number | undefined;
}

export class JournalEntry extends Entity<JournalEntryProps> {
  public static create(
    props: {
      cycleId: string;
      title: string;
      engagement: number;
      energy: number;
      isFlow?: boolean;
      occurredAt?: number;
      durationMinutes?: number | undefined;
      createdAt?: number;
      updatedAt?: number;
    },
    id?: string,
  ): Result<JournalEntry, DomainRangeError | DomainInvariantError> {
    const title = props.title.trim();
    if (!title) {
      return err(
        new DomainInvariantError("INV-JOURNAL-01", "Journal entry title cannot be empty."),
      );
    }

    const engagementResult = validateRange("engagement", props.engagement, 0, 100);
    if (!engagementResult.ok) {
      return err(engagementResult.error);
    }

    const energyResult = validateRange("energy", props.energy, -100, 100);
    if (!energyResult.ok) {
      return err(energyResult.error);
    }

    const entryId = id ?? generateUUIDv7();
    const now = Date.now();
    return ok(
      new JournalEntry(
        entryId,
        {
          cycleId: props.cycleId,
          title,
          engagement: props.engagement,
          energy: props.energy,
          isFlow: props.isFlow ?? false,
          occurredAt: props.occurredAt ?? now,
          durationMinutes: props.durationMinutes,
        },
        props.createdAt ?? now,
        props.updatedAt ?? now,
      ),
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }
  public get title(): string {
    return this.props.title;
  }
  public get engagement(): number {
    return this.props.engagement;
  }
  public get energy(): number {
    return this.props.energy;
  }
  public get isFlow(): boolean {
    return this.props.isFlow;
  }
  public get occurredAt(): number {
    return this.props.occurredAt;
  }
  public get durationMinutes(): number | undefined {
    return this.props.durationMinutes;
  }
}

export interface ReflectionFindingProps {
  cycleId: string;
  journalEntryId: string;
  tag: ReflectionTag;
  notes: string;
}

export class ReflectionFinding extends Entity<ReflectionFindingProps> {
  public static create(
    props: {
      cycleId: string;
      journalEntryId: string;
      tag: ReflectionTag;
      notes: string;
      createdAt?: number;
      updatedAt?: number;
    },
    id?: string,
  ): Result<ReflectionFinding, OrphanRecordError | DomainInvariantError> {
    if (!props.journalEntryId || !props.journalEntryId.trim()) {
      return err(new OrphanRecordError("ReflectionFinding", "JournalEntry"));
    }

    const notes = props.notes.trim();
    if (!notes) {
      return err(
        new DomainInvariantError("INV-REFLECTION-01", "Reflection notes cannot be empty."),
      );
    }

    const findingId = id ?? generateUUIDv7();
    const now = Date.now();
    return ok(
      new ReflectionFinding(
        findingId,
        {
          cycleId: props.cycleId,
          journalEntryId: props.journalEntryId.trim(),
          tag: props.tag,
          notes,
        },
        props.createdAt ?? now,
        props.updatedAt ?? now,
      ),
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }
  public get journalEntryId(): string {
    return this.props.journalEntryId;
  }
  public get tag(): ReflectionTag {
    return this.props.tag;
  }
  public get notes(): string {
    return this.props.notes;
  }
}

export interface AeiouAnalysisProps {
  cycleId: string;
  reflectionFindingId: string;
  activities: string;
  environments: string;
  interactions: string;
  objects: string;
  users: string;
}

export class AeiouAnalysis extends Entity<AeiouAnalysisProps> {
  public static create(
    props: {
      cycleId: string;
      reflectionFindingId: string;
      activities: string;
      environments: string;
      interactions: string;
      objects: string;
      users: string;
      createdAt?: number;
      updatedAt?: number;
    },
    id?: string,
  ): Result<AeiouAnalysis, OrphanRecordError> {
    if (!props.reflectionFindingId || !props.reflectionFindingId.trim()) {
      return err(new OrphanRecordError("AeiouAnalysis", "ReflectionFinding"));
    }

    const analysisId = id ?? generateUUIDv7();
    const now = Date.now();
    return ok(
      new AeiouAnalysis(
        analysisId,
        {
          cycleId: props.cycleId,
          reflectionFindingId: props.reflectionFindingId.trim(),
          activities: props.activities.trim(),
          environments: props.environments.trim(),
          interactions: props.interactions.trim(),
          objects: props.objects.trim(),
          users: props.users.trim(),
        },
        props.createdAt ?? now,
        props.updatedAt ?? now,
      ),
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }
  public get reflectionFindingId(): string {
    return this.props.reflectionFindingId;
  }
  public get activities(): string {
    return this.props.activities;
  }
  public get environments(): string {
    return this.props.environments;
  }
  public get interactions(): string {
    return this.props.interactions;
  }
  public get objects(): string {
    return this.props.objects;
  }
  public get users(): string {
    return this.props.users;
  }
}
