/**
 * Hybrid Logical Clock (HLC) Timestamp for local-first event ordering & CRDT synchronization.
 * Format: `<physical_wall_time_iso>_<logical_counter>_<node_id>`
 */

export class HlcTimestamp {
  constructor(
    public readonly wallTimeMs: number,
    public readonly counter: number,
    public readonly nodeId: string,
  ) {}

  public static create(nodeId: string, wallTimeMs: number = Date.now(), counter = 0): HlcTimestamp {
    return new HlcTimestamp(wallTimeMs, counter, nodeId);
  }

  public toString(): string {
    return `${this.wallTimeMs.toString(36).padStart(8, "0")}-${this.counter.toString(36).padStart(4, "0")}-${this.nodeId}`;
  }

  public static parse(hlcStr: string): HlcTimestamp {
    const parts = hlcStr.split("-");
    if (parts.length < 3) {
      throw new Error(`Invalid HLC timestamp string: ${hlcStr}`);
    }
    const p0 = parts[0] ?? "0";
    const p1 = parts[1] ?? "0";
    const wallTimeMs = Number.parseInt(p0, 36);
    const counter = Number.parseInt(p1, 36);
    const nodeId = parts.slice(2).join("-");
    return new HlcTimestamp(wallTimeMs, counter, nodeId);
  }

  public compare(other: HlcTimestamp): number {
    if (this.wallTimeMs !== other.wallTimeMs) {
      return this.wallTimeMs - other.wallTimeMs;
    }
    if (this.counter !== other.counter) {
      return this.counter - other.counter;
    }
    return this.nodeId.localeCompare(other.nodeId);
  }
}
