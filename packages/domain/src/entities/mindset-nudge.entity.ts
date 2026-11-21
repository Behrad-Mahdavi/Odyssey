import { Entity } from "../core/entity.js";
import { generateUUIDv7 } from "../types/uuid.js";

export type DomainMindset =
  | "curiosity"
  | "bias_to_action"
  | "reframing"
  | "awareness"
  | "radical_collaboration";

export interface MindsetNudgeProps {
  mindset: DomainMindset;
  moduleKey: string;
  title: string;
  prompt: string;
  dismissed: boolean;
}

/**
 * MindsetNudge Entity (Intro & 5 Mindsets Backbone / FR-00.2)
 * Represents a contextual, non-intrusive mindset reminder anchored to a studio tool.
 */
export class MindsetNudge extends Entity<MindsetNudgeProps> {
  public static create(
    mindset: DomainMindset,
    moduleKey: string,
    title: string,
    prompt: string,
    id?: string,
  ): MindsetNudge {
    const nudgeId = id ?? generateUUIDv7();
    const now = Date.now();
    return new MindsetNudge(
      nudgeId,
      {
        mindset,
        moduleKey,
        title,
        prompt,
        dismissed: false,
      },
      now,
      now,
    );
  }

  public get mindset(): DomainMindset {
    return this.props.mindset;
  }

  public get moduleKey(): string {
    return this.props.moduleKey;
  }

  public get title(): string {
    return this.props.title;
  }

  public get prompt(): string {
    return this.props.prompt;
  }

  public get isDismissed(): boolean {
    return this.props.dismissed;
  }

  public dismiss(): MindsetNudge {
    return new MindsetNudge(
      this.id,
      {
        ...this.props,
        dismissed: true,
      },
      this.createdAt,
      Date.now(),
    );
  }
}
