import { Entity } from "../core/entity.js";
import type { DomainRangeError } from "../core/invariant-error.js";
import { validateRange } from "../core/range-validator.js";
import { type Result, err, ok } from "../core/result.js";
import { generateUUIDv7 } from "../types/uuid.js";

export interface HwplGauges {
  health: number;
  work: number;
  play: number;
  love: number;
}

export interface HwplAssessmentProps extends HwplGauges {
  cycleId: string;
  healthNotes?: string | undefined;
  workNotes?: string | undefined;
  playNotes?: string | undefined;
  loveNotes?: string | undefined;
}

/**
 * HWPL Assessment Entity (Chapter 1: Start Where You Are / INV-01)
 * Enforces gauge values between 0 and 100 inclusive.
 */
export class HwplAssessment extends Entity<HwplAssessmentProps> {
  public static create(
    props: HwplAssessmentProps,
    id?: string,
  ): Result<HwplAssessment, DomainRangeError> {
    const healthRes = validateRange("health", props.health, 0, 100);
    if (!healthRes.ok) return err(healthRes.error);

    const workRes = validateRange("work", props.work, 0, 100);
    if (!workRes.ok) return err(workRes.error);

    const playRes = validateRange("play", props.play, 0, 100);
    if (!playRes.ok) return err(playRes.error);

    const loveRes = validateRange("love", props.love, 0, 100);
    if (!loveRes.ok) return err(loveRes.error);

    const assessmentId = id ?? generateUUIDv7();
    const now = Date.now();

    return ok(
      new HwplAssessment(
        assessmentId,
        {
          cycleId: props.cycleId,
          health: Math.round(props.health),
          work: Math.round(props.work),
          play: Math.round(props.play),
          love: Math.round(props.love),
          healthNotes: props.healthNotes,
          workNotes: props.workNotes,
          playNotes: props.playNotes,
          loveNotes: props.loveNotes,
        },
        now,
        now,
      ),
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }

  public get health(): number {
    return this.props.health;
  }

  public get work(): number {
    return this.props.work;
  }

  public get play(): number {
    return this.props.play;
  }

  public get love(): number {
    return this.props.love;
  }

  public get healthNotes(): string | undefined {
    return this.props.healthNotes;
  }

  public get workNotes(): string | undefined {
    return this.props.workNotes;
  }

  public get playNotes(): string | undefined {
    return this.props.playNotes;
  }

  public get loveNotes(): string | undefined {
    return this.props.loveNotes;
  }
}
