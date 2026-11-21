import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { vaultMachine } from "../src/index.js";

describe("Vault State Machine (XState v5)", () => {
  it("should transition from checking to uninitialized if vault does not exist", () => {
    const actor = createActor(vaultMachine);
    actor.start();

    expect(actor.getSnapshot().value).toBe("checking");
    actor.send({ type: "CHECK_INITIALIZED", hasVault: false });
    expect(actor.getSnapshot().value).toBe("uninitialized");
  });

  it("should transition from checking to locked if vault exists", () => {
    const actor = createActor(vaultMachine);
    actor.start();

    actor.send({ type: "CHECK_INITIALIZED", hasVault: true });
    expect(actor.getSnapshot().value).toBe("locked");
  });

  it("should handle unlock lifecycle and error capture", () => {
    const actor = createActor(vaultMachine);
    actor.start();

    actor.send({ type: "CHECK_INITIALIZED", hasVault: true });
    expect(actor.getSnapshot().value).toBe("locked");

    actor.send({ type: "UNLOCK", passphrase: "wrong" });
    expect(actor.getSnapshot().value).toBe("unlocking");

    actor.send({ type: "UNLOCK_FAILURE", error: "Invalid passphrase" });
    expect(actor.getSnapshot().value).toBe("locked");
    expect(actor.getSnapshot().context.error).toBe("Invalid passphrase");

    actor.send({ type: "UNLOCK", passphrase: "correct" });
    expect(actor.getSnapshot().context.error).toBeNull();
    actor.send({ type: "UNLOCK_SUCCESS" });
    expect(actor.getSnapshot().value).toBe("unlocked");

    actor.send({ type: "LOCK" });
    expect(actor.getSnapshot().value).toBe("locked");
  });
});
