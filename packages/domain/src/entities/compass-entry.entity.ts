import { Entity } from "../core/entity.js";
import { countWords } from "../core/word-counter.js";
import { generateUUIDv7 } from "../types/uuid.js";

export interface CompassEntryProps {
  cycleId: string;
  workview: string;
  lifeview: string;
  coherenceComplement?: string | undefined;
  coherenceConflict?: string | undefined;
  coherenceGuide?: string | undefined;
}

/**
 * CompassEntry Entity (Chapter 2: Building a Compass / INV-03)
 * Synthesizes Workview and Lifeview to identify complementarity and conflicts.
 */
export class CompassEntry extends Entity<CompassEntryProps> {
  public static create(props: CompassEntryProps, id?: string): CompassEntry {
    const entryId = id ?? generateUUIDv7();
    const now = Date.now();
    return new CompassEntry(
      entryId,
      {
        cycleId: props.cycleId,
        workview: props.workview,
        lifeview: props.lifeview,
        coherenceComplement: props.coherenceComplement,
        coherenceConflict: props.coherenceConflict,
        coherenceGuide: props.coherenceGuide,
      },
      now,
      now,
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }

  public get workview(): string {
    return this.props.workview;
  }

  public get lifeview(): string {
    return this.props.lifeview;
  }

  public get coherenceComplement(): string | undefined {
    return this.props.coherenceComplement;
  }

  public get coherenceConflict(): string | undefined {
    return this.props.coherenceConflict;
  }

  public get coherenceGuide(): string | undefined {
    return this.props.coherenceGuide;
  }

  public get workviewWordCount(): number {
    return countWords(this.props.workview);
  }

  public get lifeviewWordCount(): number {
    return countWords(this.props.lifeview);
  }

  public hasMinimumReflectionDepth(targetWords = 250): boolean {
    return this.workviewWordCount >= targetWords && this.lifeviewWordCount >= targetWords;
  }

  public updateViews(workview: string, lifeview: string): CompassEntry {
    return new CompassEntry(
      this.id,
      {
        ...this.props,
        workview,
        lifeview,
      },
      this.createdAt,
      Date.now(),
    );
  }

  public updateCoherence(complement?: string, conflict?: string, guide?: string): CompassEntry {
    return new CompassEntry(
      this.id,
      {
        ...this.props,
        coherenceComplement: complement ?? this.props.coherenceComplement,
        coherenceConflict: conflict ?? this.props.coherenceConflict,
        coherenceGuide: guide ?? this.props.coherenceGuide,
      },
      this.createdAt,
      Date.now(),
    );
  }
}
