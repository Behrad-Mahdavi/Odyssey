import { Entity } from "../core/entity.js";
import { generateUUIDv7 } from "../types/uuid.js";

export type ProblemClassification = "GRAVITY" | "DESIGNABLE";

export interface LifeProblemProps {
  cycleId: string;
  content: string;
  classification: ProblemClassification;
  anchorStatement?: string | undefined;
  reframedQuestion?: string | undefined;
}

/**
 * LifeProblem Entity (Chapter 1 & 4 / Gravity vs Designable Filter)
 * Distinguishes immovable gravity realities from designable challenges.
 */
export class LifeProblem extends Entity<LifeProblemProps> {
  public static create(
    cycleId: string,
    content: string,
    classification: ProblemClassification = "DESIGNABLE",
    id?: string,
  ): LifeProblem {
    const problemId = id ?? generateUUIDv7();
    const now = Date.now();
    return new LifeProblem(
      problemId,
      {
        cycleId,
        content: content.trim(),
        classification,
      },
      now,
      now,
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }

  public get content(): string {
    return this.props.content;
  }

  public get classification(): ProblemClassification {
    return this.props.classification;
  }

  public get isGravity(): boolean {
    return this.props.classification === "GRAVITY";
  }

  public get anchorStatement(): string | undefined {
    return this.props.anchorStatement;
  }

  public get reframedQuestion(): string | undefined {
    return this.props.reframedQuestion;
  }

  public markAsGravity(anchorStatement?: string): LifeProblem {
    return new LifeProblem(
      this.id,
      {
        ...this.props,
        classification: "GRAVITY",
        anchorStatement: anchorStatement ?? this.props.anchorStatement,
      },
      this.createdAt,
      Date.now(),
    );
  }

  public markAsDesignable(reframedQuestion?: string): LifeProblem {
    return new LifeProblem(
      this.id,
      {
        ...this.props,
        classification: "DESIGNABLE",
        reframedQuestion: reframedQuestion ?? this.props.reframedQuestion,
      },
      this.createdAt,
      Date.now(),
    );
  }
}
