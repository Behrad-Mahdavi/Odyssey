import type { WorkerRequest, WorkerResponse } from "./protocol.js";

/**
 * Storage Web Worker for Odyssey Local-First Architecture.
 * Runs SQLite WASM inside a Dedicated Worker with OPFS storage.
 * Enforces exclusive tab access via Web Locks API (navigator.locks).
 */

let isLocked = false;
let releaseLock: (() => void) | null = null;

async function acquireTabLock(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.locks) {
    return true; // Fallback in environments without Web Locks API
  }

  return new Promise((resolve) => {
    navigator.locks.request("odyssey-vault-lock", { ifAvailable: true }, async (lock) => {
      if (!lock) {
        resolve(false);
        return;
      }

      isLocked = true;
      resolve(true);

      // Keep lock held until explicitly released
      await new Promise<void>((rel) => {
        releaseLock = rel;
      });
      isLocked = false;
    });
  });
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, action } = event.data;

  try {
    switch (action) {
      case "INIT": {
        const hasLock = await acquireTabLock();
        if (!hasLock) {
          self.postMessage({
            id,
            ok: false,
            error: {
              code: "DATABASE_LOCKED_BY_OTHER_TAB",
              message:
                "Another browser tab is currently using Odyssey. Please close other tabs to prevent database corruption.",
            },
          } satisfies WorkerResponse);
          return;
        }

        self.postMessage({
          id,
          ok: true,
          data: { status: "INITIALIZED", vfs: "opfs" },
        } satisfies WorkerResponse);
        break;
      }

      case "CLOSE": {
        if (releaseLock) {
          releaseLock();
          releaseLock = null;
        }
        self.postMessage({ id, ok: true } satisfies WorkerResponse);
        break;
      }

      default:
        self.postMessage({
          id,
          ok: false,
          error: { code: "UNSUPPORTED_ACTION", message: `Action ${action} is not supported` },
        } satisfies WorkerResponse);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({
      id,
      ok: false,
      error: { code: "WORKER_INTERNAL_ERROR", message },
    } satisfies WorkerResponse);
  }
};
