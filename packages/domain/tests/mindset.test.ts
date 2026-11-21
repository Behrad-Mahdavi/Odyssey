import { describe, expect, it } from "vitest";
import { DesignCycle, MindsetNudge } from "../src/index.js";

describe("Mindset Nudge & Design Cycle Domain Entities (F-005)", () => {
  it("should create active DesignCycle 1", () => {
    const cycle = DesignCycle.create("Cycle 1");
    expect(cycle.name).toBe("Cycle 1");
    expect(cycle.status).toBe("ACTIVE");
    expect(cycle.snapshotAt).toBeNull();
    expect(cycle.startedAt).toBeGreaterThan(0);
  });

  it("should create immutable archived snapshot of cycle", () => {
    const cycle = DesignCycle.create("Cycle 1");
    const snapshot = cycle.createSnapshot();

    expect(snapshot.id).toBe(cycle.id);
    expect(snapshot.status).toBe("ARCHIVED_SNAPSHOT");
    expect(snapshot.snapshotAt).not.toBeNull();
    expect(snapshot.snapshotAt).toBeGreaterThanOrEqual(cycle.startedAt);
  });

  it("should create MindsetNudge entity and handle dismissal", () => {
    const nudge = MindsetNudge.create(
      "curiosity",
      "hwpl",
      "کنجکاوی در وضعیت فعلی",
      "وضعیت هر یک از مخازن را بررسی کنید.",
    );

    expect(nudge.mindset).toBe("curiosity");
    expect(nudge.moduleKey).toBe("hwpl");
    expect(nudge.isDismissed).toBe(false);

    const dismissed = nudge.dismiss();
    expect(dismissed.isDismissed).toBe(true);
    expect(dismissed.id).toBe(nudge.id);
    expect(dismissed.updatedAt).toBeGreaterThanOrEqual(nudge.updatedAt);
  });
});
