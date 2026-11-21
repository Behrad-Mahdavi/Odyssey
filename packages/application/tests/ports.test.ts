import { ok } from "@odyssey/domain";
import { describe, expect, it } from "vitest";
import type { ICryptoPort, IStoragePort } from "../src/index.js";

describe("Application Ports Contract", () => {
  it("should enforce clean interface definitions for Storage Port", async () => {
    const mockStorage: IStoragePort = {
      init: async () => ok(undefined),
      execute: async (_sql, _params) => ok([{ count: 1 }]),
      close: async () => {},
    };

    const res = await mockStorage.execute("SELECT 1;");
    expect(res.ok).toBe(true);
  });

  it("should enforce clean interface definitions for Crypto Port", async () => {
    const mockCrypto: ICryptoPort = {
      deriveKey: async () => ok(new Uint8Array([1, 2, 3])),
      encrypt: async () => ok(new Uint8Array([4, 5, 6])),
      decrypt: async () => ok(new Uint8Array([7, 8, 9])),
      hash: async () => "sha256-mock",
    };

    const hash = await mockCrypto.hash(new Uint8Array([0]));
    expect(hash).toBe("sha256-mock");
  });
});
