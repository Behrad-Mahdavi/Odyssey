import { Entity } from "../core/entity.js";
import {
  DomainInvariantError,
  type DomainRangeError,
  WordCountInvariantError,
} from "../core/invariant-error.js";
import { validateRange } from "../core/range-validator.js";
import { type Result, err, ok } from "../core/result.js";
import { countWords } from "../core/word-counter.js";
import { generateUUIDv7 } from "../types/uuid.js";

export type OdysseySlot = "LIFE_1" | "LIFE_2" | "LIFE_3";

export interface TimelineEvent {
  year: 1 | 2 | 3 | 4 | 5;
  type: "work" | "personal";
  description: string;
}

export interface OdysseyPlanProps {
  cycleId: string;
  slot: OdysseySlot;
  sixWordTitle: string;
  resources: number; // 0..100 (INV-01)
  likability: number; // 0..100 (INV-01)
  confidence: number; // 0..100 (INV-01)
  coherence: number; // 0..100 (INV-01)
  questions: [string, string, string]; // exactly 3 slots (INV-02)
  timelineEvents: TimelineEvent[];
  isFinalized: boolean;
}

/**
 * OdysseyPlan Entity (Chapter 5: Design Your Lives / INV-01, INV-02, INV-03)
 */
export class OdysseyPlan extends Entity<OdysseyPlanProps> {
  public static create(
    props: {
      cycleId: string;
      slot: OdysseySlot;
      sixWordTitle?: string;
      resources?: number;
      likability?: number;
      confidence?: number;
      coherence?: number;
      questions?: [string, string, string];
      timelineEvents?: TimelineEvent[];
      isFinalized?: boolean;
      createdAt?: number;
      updatedAt?: number;
    },
    id?: string,
  ): Result<OdysseyPlan, DomainRangeError | DomainInvariantError> {
    const resources = props.resources ?? 50;
    const likability = props.likability ?? 50;
    const confidence = props.confidence ?? 50;
    const coherence = props.coherence ?? 50;

    // Validate 4 gauges (INV-01)
    const resRes = validateRange("resources", resources, 0, 100);
    if (!resRes.ok) return err(resRes.error);

    const likRes = validateRange("likability", likability, 0, 100);
    if (!likRes.ok) return err(likRes.error);

    const confRes = validateRange("confidence", confidence, 0, 100);
    if (!confRes.ok) return err(confRes.error);

    const cohRes = validateRange("coherence", coherence, 0, 100);
    if (!cohRes.ok) return err(cohRes.error);

    const questions: [string, string, string] = props.questions ?? ["", "", ""];
    if (questions.length !== 3) {
      return err(
        new DomainInvariantError(
          "INV-02",
          `Odyssey plan must have exactly 3 question slots (got ${questions.length}).`,
        ),
      );
    }

    const title = props.sixWordTitle?.trim() ?? "";
    const isFinalized = props.isFinalized ?? false;

    // If marked as finalized, enforce 6-word title invariant (INV-03)
    if (isFinalized) {
      const words = countWords(title);
      if (words > 6) {
        return err(new WordCountInvariantError(6, words));
      }
    }

    const planId = id ?? generateUUIDv7();
    const now = Date.now();

    return ok(
      new OdysseyPlan(
        planId,
        {
          cycleId: props.cycleId,
          slot: props.slot,
          sixWordTitle: title,
          resources,
          likability,
          confidence,
          coherence,
          questions,
          timelineEvents: props.timelineEvents ?? [],
          isFinalized,
        },
        props.createdAt ?? now,
        props.updatedAt ?? now,
      ),
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }
  public get slot(): OdysseySlot {
    return this.props.slot;
  }
  public get sixWordTitle(): string {
    return this.props.sixWordTitle;
  }
  public get resources(): number {
    return this.props.resources;
  }
  public get likability(): number {
    return this.props.likability;
  }
  public get confidence(): number {
    return this.props.confidence;
  }
  public get coherence(): number {
    return this.props.coherence;
  }
  public get questions(): [string, string, string] {
    return this.props.questions;
  }
  public get timelineEvents(): TimelineEvent[] {
    return this.props.timelineEvents;
  }
  public get isFinalized(): boolean {
    return this.props.isFinalized;
  }

  public get titleWordCount(): number {
    return countWords(this.props.sixWordTitle);
  }

  public finalize(): Result<OdysseyPlan, WordCountInvariantError> {
    const words = this.titleWordCount;
    if (words > 6) {
      return err(new WordCountInvariantError(6, words));
    }

    return ok(
      new OdysseyPlan(
        this.id,
        {
          ...this.props,
          isFinalized: true,
        },
        this.createdAt,
        Date.now(),
      ),
    );
  }

  public updateTitle(title: string): Result<OdysseyPlan, WordCountInvariantError> {
    const trimmed = title.trim();
    if (this.isFinalized) {
      const words = countWords(trimmed);
      if (words > 6) {
        return err(new WordCountInvariantError(6, words));
      }
    }

    return ok(
      new OdysseyPlan(
        this.id,
        {
          ...this.props,
          sixWordTitle: trimmed,
        },
        this.createdAt,
        Date.now(),
      ),
    );
  }

  public updateGauges(
    resources: number,
    likability: number,
    confidence: number,
    coherence: number,
  ): Result<OdysseyPlan, DomainRangeError> {
    const r1 = validateRange("resources", resources, 0, 100);
    if (!r1.ok) return err(r1.error);
    const r2 = validateRange("likability", likability, 0, 100);
    if (!r2.ok) return err(r2.error);
    const r3 = validateRange("confidence", confidence, 0, 100);
    if (!r3.ok) return err(r3.error);
    const r4 = validateRange("coherence", coherence, 0, 100);
    if (!r4.ok) return err(r4.error);

    return ok(
      new OdysseyPlan(
        this.id,
        {
          ...this.props,
          resources,
          likability,
          confidence,
          coherence,
        },
        this.createdAt,
        Date.now(),
      ),
    );
  }

  public updateQuestions(questions: [string, string, string]): OdysseyPlan {
    return new OdysseyPlan(
      this.id,
      {
        ...this.props,
        questions,
      },
      this.createdAt,
      Date.now(),
    );
  }

  public updateTimeline(events: TimelineEvent[]): OdysseyPlan {
    return new OdysseyPlan(
      this.id,
      {
        ...this.props,
        timelineEvents: events,
      },
      this.createdAt,
      Date.now(),
    );
  }
}

export interface OdysseyFeedbackProps {
  cycleId: string;
  odysseyPlanId: string;
  sessionId?: string | undefined;
  externalFeedback: string;
  presenterEnergyNote: string;
}

export class OdysseyFeedback extends Entity<OdysseyFeedbackProps> {
  public static create(
    props: {
      cycleId: string;
      odysseyPlanId: string;
      sessionId?: string | undefined;
      externalFeedback: string;
      presenterEnergyNote: string;
      createdAt?: number;
      updatedAt?: number;
    },
    id?: string,
  ): Result<OdysseyFeedback, DomainInvariantError> {
    if (!props.odysseyPlanId || !props.odysseyPlanId.trim()) {
      return err(
        new DomainInvariantError("INV-FEEDBACK-01", "Feedback must be linked to an OdysseyPlan."),
      );
    }

    const feedbackId = id ?? generateUUIDv7();
    const now = Date.now();

    return ok(
      new OdysseyFeedback(
        feedbackId,
        {
          cycleId: props.cycleId,
          odysseyPlanId: props.odysseyPlanId.trim(),
          sessionId: props.sessionId,
          externalFeedback: props.externalFeedback.trim(),
          presenterEnergyNote: props.presenterEnergyNote.trim(),
        },
        props.createdAt ?? now,
        props.updatedAt ?? now,
      ),
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }
  public get odysseyPlanId(): string {
    return this.props.odysseyPlanId;
  }
  public get sessionId(): string | undefined {
    return this.props.sessionId;
  }
  public get externalFeedback(): string {
    return this.props.externalFeedback;
  }
  public get presenterEnergyNote(): string {
    return this.props.presenterEnergyNote;
  }
}
