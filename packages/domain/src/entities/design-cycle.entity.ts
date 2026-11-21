import { Entity } from "../core/entity.js";
import { generateUUIDv7 } from "../types/uuid.js";

export type CycleStatus = "ACTIVE" | "ARCHIVED_SNAPSHOT";

export interface DesignCycleProps {
  name: string;
  status: CycleStatus;
  startedAt: number;
  snapshotAt: number | null;
}

/**
 * DesignCycle Entity (Intro & Conclusion / FR-00.3)
 * Represents a life design cycle (e.g. "Cycle 1", "2026 Spring") with snapshot history.
 */
export class DesignCycle extends Entity<DesignCycleProps> {
  public static create(name: string, id?: string): DesignCycle {
    const cycleId = id ?? generateUUIDv7();
    const now = Date.now();
    return new DesignCycle(
      cycleId,
      {
        name,
        status: "ACTIVE",
        startedAt: now,
        snapshotAt: null,
      },
      now,
      now,
    );
  }

  public get name(): string {
    return this.props.name;
  }

  public get status(): CycleStatus {
    return this.props.status;
  }

  public get startedAt(): number {
    return this.props.startedAt;
  }

  public get snapshotAt(): number | null {
    return this.props.snapshotAt;
  }

  public createSnapshot(): DesignCycle {
    const now = Date.now();
    return new DesignCycle(
      this.id,
      {
        ...this.props,
        status: "ARCHIVED_SNAPSHOT",
        snapshotAt: now,
      },
      this.createdAt,
      now,
    );
  }
}
