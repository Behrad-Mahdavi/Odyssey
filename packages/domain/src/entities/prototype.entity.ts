import { Entity } from "../core/entity.js";
import { DomainInvariantError } from "../core/invariant-error.js";
import { type Result, err, ok } from "../core/result.js";
import { generateUUIDv7 } from "../types/uuid.js";

export type PrototypeType = "CONVERSATION" | "EXPERIENCE";
export type PrototypeStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
export type NextStepVerdict = "PROCEED" | "ITERATE" | "PIVOT" | "STOP";

export interface PrototypeProps {
  cycleId: string;
  odysseyPlanId?: string | undefined;
  questionIndex?: number | undefined;
  type: PrototypeType;
  title: string;
  hypothesis: string;
  status: PrototypeStatus;
  outcome?: string | undefined;
  // Conversation-specific fields (Story interview template)
  intervieweeRole?: string | undefined;
  storyQuestions?: string[] | undefined;
  conversationNotes?: string | undefined;
  referralContact?: string | undefined;
  // Experience-specific fields
  costEstimate?: string | undefined;
  duration?: string | undefined;
  nextStepVerdict?: NextStepVerdict | undefined;
}

/**
 * Prototype Entity (Chapter 6: Prototyping Lab)
 * Models Prototype Conversations (story-driven informational interviews)
 * and Prototype Experiences (rapid micro-trials).
 */
export class Prototype extends Entity<PrototypeProps> {
  public static create(
    props: {
      cycleId: string;
      odysseyPlanId?: string | undefined;
      questionIndex?: number | undefined;
      type: PrototypeType;
      title: string;
      hypothesis: string;
      status?: PrototypeStatus | undefined;
      outcome?: string | undefined;
      intervieweeRole?: string | undefined;
      storyQuestions?: string[] | undefined;
      conversationNotes?: string | undefined;
      referralContact?: string | undefined;
      costEstimate?: string | undefined;
      duration?: string | undefined;
      nextStepVerdict?: NextStepVerdict | undefined;
      createdAt?: number;
      updatedAt?: number;
    },
    id?: string,
  ): Result<Prototype, DomainInvariantError> {
    const title = props.title.trim();
    if (!title) {
      return err(new DomainInvariantError("INV-PROTOTYPE-01", "Prototype title cannot be empty."));
    }

    const hypothesis = props.hypothesis.trim();
    if (!hypothesis) {
      return err(
        new DomainInvariantError("INV-PROTOTYPE-02", "Prototype hypothesis cannot be empty."),
      );
    }

    const prototypeId = id ?? generateUUIDv7();
    const now = Date.now();

    return ok(
      new Prototype(
        prototypeId,
        {
          cycleId: props.cycleId,
          odysseyPlanId: props.odysseyPlanId,
          questionIndex: props.questionIndex,
          type: props.type,
          title,
          hypothesis,
          status: props.status ?? "PLANNED",
          outcome: props.outcome,
          intervieweeRole: props.intervieweeRole,
          storyQuestions: props.storyQuestions ?? [
            "چگونه وارد این مسیر شدید و نقطه آغاز چه بود؟",
            "یک روز کاری واقعی در این نقش دقیقاً چگونه می‌گذرد؟",
            "چه چالش‌ها و واقعیت‌هایی در این حرفه وجود دارد که از بیرون دیده نمی‌شود؟",
            "با چه کس دیگری در این حوزه پیشنهاد می‌کنید گفت‌وگو کنم؟",
          ],
          conversationNotes: props.conversationNotes,
          referralContact: props.referralContact,
          costEstimate: props.costEstimate,
          duration: props.duration,
          nextStepVerdict: props.nextStepVerdict,
        },
        props.createdAt ?? now,
        props.updatedAt ?? now,
      ),
    );
  }

  public get cycleId(): string {
    return this.props.cycleId;
  }
  public get odysseyPlanId(): string | undefined {
    return this.props.odysseyPlanId;
  }
  public get questionIndex(): number | undefined {
    return this.props.questionIndex;
  }
  public get type(): PrototypeType {
    return this.props.type;
  }
  public get title(): string {
    return this.props.title;
  }
  public get hypothesis(): string {
    return this.props.hypothesis;
  }
  public get status(): PrototypeStatus {
    return this.props.status;
  }
  public get outcome(): string | undefined {
    return this.props.outcome;
  }
  public get intervieweeRole(): string | undefined {
    return this.props.intervieweeRole;
  }
  public get storyQuestions(): string[] | undefined {
    return this.props.storyQuestions;
  }
  public get conversationNotes(): string | undefined {
    return this.props.conversationNotes;
  }
  public get referralContact(): string | undefined {
    return this.props.referralContact;
  }
  public get costEstimate(): string | undefined {
    return this.props.costEstimate;
  }
  public get duration(): string | undefined {
    return this.props.duration;
  }
  public get nextStepVerdict(): NextStepVerdict | undefined {
    return this.props.nextStepVerdict;
  }

  public updateStatus(status: PrototypeStatus, outcome?: string): Prototype {
    return new Prototype(
      this.id,
      {
        ...this.props,
        status,
        ...(outcome !== undefined ? { outcome } : {}),
      },
      this.createdAt,
      Date.now(),
    );
  }

  public completeExperience(outcome: string, verdict: NextStepVerdict): Prototype {
    return new Prototype(
      this.id,
      {
        ...this.props,
        status: "COMPLETED",
        outcome,
        nextStepVerdict: verdict,
      },
      this.createdAt,
      Date.now(),
    );
  }

  public completeConversation(notes: string, referral?: string): Prototype {
    return new Prototype(
      this.id,
      {
        ...this.props,
        status: "COMPLETED",
        conversationNotes: notes,
        ...(referral ? { referralContact: referral } : {}),
      },
      this.createdAt,
      Date.now(),
    );
  }
}
