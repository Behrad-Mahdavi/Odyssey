import { describe, expect, it } from "vitest";
import { DesignCycle, HlcTimestamp, generateUUIDv7, isValidUUIDv7 } from "../src/index.js";

describe("Domain Types: UUIDv7 & HLC", () => {
  it("should generate valid time-sortable UUIDv7 identifiers", () => {
    const id1 = generateUUIDv7();
    const id2 = generateUUIDv7();

    expect(isValidUUIDv7(id1)).toBe(true);
    expect(isValidUUIDv7(id2)).toBe(true);
    expect(id1).not.toBe(id2);
  });

  it("should format and parse HlcTimestamp accurately", () => {
    const hlc1 = HlcTimestamp.create("node-a", 1700000000000, 1);
    const serialized = hlc1.toString();
    const parsed = HlcTimestamp.parse(serialized);

    expect(parsed.wallTimeMs).toBe(hlc1.wallTimeMs);
    expect(parsed.counter).toBe(hlc1.counter);
    expect(parsed.nodeId).toBe("node-a");

    const hlc2 = HlcTimestamp.create("node-b", 1700000000001, 0);
    expect(hlc1.compare(hlc2)).toBeLessThan(0);
  });

  it("should manage DesignCycle lifecycle and immutable snapshotting", () => {
    const cycle = DesignCycle.create("Cycle 1");
    expect(cycle.name).toBe("Cycle 1");
    expect(cycle.status).toBe("ACTIVE");
    expect(cycle.snapshotAt).toBeNull();

    const snapshot = cycle.createSnapshot();
    expect(snapshot.status).toBe("ARCHIVED_SNAPSHOT");
    expect(snapshot.snapshotAt).not.toBeNull();
  });
});
