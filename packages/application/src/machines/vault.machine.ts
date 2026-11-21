import { assign, setup } from "xstate";

export interface VaultMachineContext {
  error: string | null;
  idleTimeoutMs: number;
}

export type VaultMachineEvent =
  | { type: "CHECK_INITIALIZED"; hasVault: boolean }
  | { type: "INITIALIZE"; passphrase: string }
  | { type: "UNLOCK"; passphrase: string }
  | { type: "UNLOCK_SUCCESS" }
  | { type: "UNLOCK_FAILURE"; error: string }
  | { type: "LOCK" }
  | { type: "AUTO_LOCK" }
  | { type: "RESET" };

export const vaultMachine = setup({
  types: {
    context: {} as VaultMachineContext,
    events: {} as VaultMachineEvent,
  },
  delays: {
    idleTimeout: ({ context }) => context.idleTimeoutMs,
  },
  actions: {
    setError: assign({
      error: ({ event }) => ("error" in event ? event.error : null),
    }),
    clearError: assign({
      error: null,
    }),
  },
}).createMachine({
  id: "vault",
  initial: "checking",
  context: {
    error: null,
    idleTimeoutMs: 15 * 60 * 1000, // 15 minutes default auto-lock
  },
  states: {
    checking: {
      on: {
        CHECK_INITIALIZED: [
          { target: "uninitialized", guard: ({ event }) => !event.hasVault },
          { target: "locked" },
        ],
      },
    },
    uninitialized: {
      entry: "clearError",
      on: {
        INITIALIZE: {
          target: "unlocked",
        },
      },
    },
    locked: {
      on: {
        UNLOCK: {
          target: "unlocking",
          actions: "clearError",
        },
      },
    },
    unlocking: {
      on: {
        UNLOCK_SUCCESS: {
          target: "unlocked",
        },
        UNLOCK_FAILURE: {
          target: "locked",
          actions: "setError",
        },
      },
    },
    unlocked: {
      entry: "clearError",
      after: {
        idleTimeout: {
          target: "locked",
        },
      },
      on: {
        LOCK: {
          target: "locked",
        },
        AUTO_LOCK: {
          target: "locked",
        },
      },
    },
  },
});
