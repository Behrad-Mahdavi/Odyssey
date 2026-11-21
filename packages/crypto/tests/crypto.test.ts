import { describe, expect, it } from "vitest";
import { WebCryptoService } from "../src/index.js";

describe("WebCryptoService & Zero-Knowledge Vault (F-003)", () => {
  const cryptoService = new WebCryptoService();

  it("should derive 256-bit key using Argon2id with NFC normalization", async () => {
    const salt = cryptoService.generateRandomBytes(32);
    // Persian passphrase with ZWNJ: "رمز عبور من برای ادیسه"
    const passphrase = "رمز عبور من برای ادیسه";

    const keyRes = await cryptoService.deriveKey(passphrase, salt);
    expect(keyRes.ok).toBe(true);
    if (keyRes.ok) {
      expect(keyRes.value.length).toBe(32);
    }
  });

  it("should reject weak KDF parameters (<64 MiB or <3 iterations)", async () => {
    const salt = cryptoService.generateRandomBytes(32);
    const weakRes = await cryptoService.deriveKey("test-pass", salt, {
      memoryKiB: 32768, // only 32 MiB
      iterations: 2,
    });

    expect(weakRes.ok).toBe(false);
    if (!weakRes.ok) {
      expect(weakRes.error.code).toBe("WEAK_KDF_PARAMS");
    }
  });

  it("should securely wrap and unwrap DEK using KEK and AES-256-GCM envelope", async () => {
    const dek = cryptoService.generateRandomBytes(32);
    const kek = cryptoService.generateRandomBytes(32);
    const salt = cryptoService.generateRandomBytes(32);
    const aad = "odyssey:v1:dek-wrap";

    const wrapRes = await cryptoService.wrapKey(dek, kek, aad, salt, {
      algorithm: "argon2id",
      memoryKiB: 65536,
      iterations: 3,
      parallelism: 1,
      hashLength: 32,
    });

    expect(wrapRes.ok).toBe(true);
    if (!wrapRes.ok) return;

    // Correct KEK unwrap
    const unwrapRes = await cryptoService.unwrapKey(wrapRes.value, kek);
    expect(unwrapRes.ok).toBe(true);
    if (unwrapRes.ok) {
      expect(unwrapRes.value).toEqual(dek);
    }

    // Wrong KEK unwrap
    const wrongKek = cryptoService.generateRandomBytes(32);
    const wrongUnwrapRes = await cryptoService.unwrapKey(wrapRes.value, wrongKek);
    expect(wrongUnwrapRes.ok).toBe(false);
    if (!wrongUnwrapRes.ok) {
      expect(wrongUnwrapRes.error.code).toBe("INVALID_PASSPHRASE");
    }
  });

  it("should detect ciphertext tampering and reject with TAMPERED_PAYLOAD", async () => {
    const key = cryptoService.generateRandomBytes(32);
    const data = new TextEncoder().encode("Sensitive Workview Reflection Data");
    const aad = "odyssey:v1:db-snapshot";

    const encRes = await cryptoService.encrypt(data, key, aad);
    expect(encRes.ok).toBe(true);
    if (!encRes.ok) return;

    // Tamper with ciphertext by flipping one byte
    const tamperedCiphertext = new Uint8Array(encRes.value.ciphertext);
    tamperedCiphertext[0] = (tamperedCiphertext[0] ?? 0) ^ 0xff;

    const decRes = await cryptoService.decrypt(
      {
        ...encRes.value,
        ciphertext: tamperedCiphertext,
      },
      key,
    );

    expect(decRes.ok).toBe(false);
    if (!decRes.ok) {
      expect(decRes.error.code).toBe("TAMPERED_PAYLOAD");
    }
  });

  it("should perform full .odybundle backup export and import roundtrip", async () => {
    const databaseBytes = new TextEncoder().encode(
      "SQLite format 3\0 Mock SQLite binary file bytes",
    );
    const passphrase = "StrongVaultPassphrase2026!";

    // Create bundle
    const bundleRes = await cryptoService.createBundle(databaseBytes, passphrase);
    expect(bundleRes.ok).toBe(true);
    if (!bundleRes.ok) return;

    const bundleJson = bundleRes.value;
    expect(bundleJson).toContain('"format": "odyssey-bundle"');
    expect(bundleJson).toContain('"bundleVersion": 1');

    // Unpack bundle with correct passphrase
    const unpackRes = await cryptoService.unpackBundle(bundleJson, passphrase);
    expect(unpackRes.ok).toBe(true);
    if (unpackRes.ok) {
      expect(unpackRes.value).toEqual(databaseBytes);
    }

    // Unpack bundle with wrong passphrase
    const wrongUnpackRes = await cryptoService.unpackBundle(bundleJson, "WrongPassphrase!");
    expect(wrongUnpackRes.ok).toBe(false);
    if (!wrongUnpackRes.ok) {
      expect(wrongUnpackRes.error.code).toBe("INVALID_PASSPHRASE");
    }
  });
});
