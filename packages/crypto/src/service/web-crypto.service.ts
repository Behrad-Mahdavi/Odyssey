import {
  CryptoError,
  type EncryptedPayload,
  type ICryptoService,
  type KdfParams,
  type WrappedKey,
} from "@odyssey/application";
import { type Result, err, ok } from "@odyssey/domain";
import { argon2id } from "hash-wasm";
import { type OdybundleV1, OdybundleV1Schema } from "../bundle/odybundle.schema.js";
import { constantTimeEqual, zeroize } from "../utils/zeroize.js";

const DEFAULT_KDF_PARAMS: KdfParams = {
  algorithm: "argon2id",
  memoryKiB: 65536, // 64 MiB
  iterations: 3,
  parallelism: 1,
  hashLength: 32,
};

export class WebCryptoService implements ICryptoService {
  public generateRandomBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  public async deriveKey(
    passphrase: string,
    salt: Uint8Array,
    params?: Partial<KdfParams>,
  ): Promise<Result<Uint8Array, CryptoError>> {
    try {
      const normalizedPassphrase = passphrase.normalize("NFC");
      const memoryKiB = params?.memoryKiB ?? DEFAULT_KDF_PARAMS.memoryKiB;
      const iterations = params?.iterations ?? DEFAULT_KDF_PARAMS.iterations;

      if (memoryKiB < 65536 || iterations < 3) {
        return err(
          new CryptoError(
            "WEAK_KDF_PARAMS",
            "KDF parameters do not meet minimum security requirements (memoryKiB >= 65536, iterations >= 3).",
          ),
        );
      }

      const hash = await argon2id({
        password: normalizedPassphrase,
        salt,
        parallelism: 1,
        iterations,
        memorySize: memoryKiB,
        hashLength: 32,
        outputType: "binary",
      });

      return ok(new Uint8Array(hash));
    } catch (error: unknown) {
      return err(new CryptoError("ENCRYPTION_FAILED", "Argon2id key derivation failed", error));
    }
  }

  public async wrapKey(
    dek: Uint8Array,
    kek: Uint8Array,
    aad: string,
    salt: Uint8Array,
    kdfParams: KdfParams,
  ): Promise<Result<WrappedKey, CryptoError>> {
    const encryptRes = await this.encrypt(dek, kek, aad);
    if (!encryptRes.ok) {
      return err(encryptRes.error);
    }

    return ok({
      iv: encryptRes.value.iv,
      wrappedKey: encryptRes.value.ciphertext,
      salt,
      kdfParams,
      aad,
    });
  }

  public async unwrapKey(
    wrapped: WrappedKey,
    kek: Uint8Array,
  ): Promise<Result<Uint8Array, CryptoError>> {
    const decryptRes = await this.decrypt(
      {
        algorithm: "AES-256-GCM",
        iv: wrapped.iv,
        ciphertext: wrapped.wrappedKey,
        aad: wrapped.aad,
      },
      kek,
    );

    if (!decryptRes.ok) {
      return err(
        new CryptoError(
          "INVALID_PASSPHRASE",
          "Failed to unwrap DEK: Invalid passphrase or corrupted header",
        ),
      );
    }

    return ok(decryptRes.value);
  }

  public async encrypt(
    data: Uint8Array,
    key: Uint8Array,
    aad: string,
  ): Promise<Result<EncryptedPayload, CryptoError>> {
    try {
      const iv = this.generateRandomBytes(12); // Fresh 96-bit IV
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key as unknown as BufferSource,
        "AES-GCM",
        false,
        ["encrypt"],
      );

      const additionalData = new TextEncoder().encode(aad);
      const ciphertextBuf = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv as unknown as BufferSource,
          additionalData,
        },
        cryptoKey,
        data as unknown as BufferSource,
      );

      return ok({
        algorithm: "AES-256-GCM",
        iv,
        ciphertext: new Uint8Array(ciphertextBuf),
        aad,
      });
    } catch (error: unknown) {
      return err(new CryptoError("ENCRYPTION_FAILED", "AES-256-GCM encryption failed", error));
    }
  }

  public async decrypt(
    payload: EncryptedPayload,
    key: Uint8Array,
  ): Promise<Result<Uint8Array, CryptoError>> {
    try {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key as unknown as BufferSource,
        "AES-GCM",
        false,
        ["decrypt"],
      );
      const additionalData = new TextEncoder().encode(payload.aad);

      const plaintextBuf = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: payload.iv as unknown as BufferSource,
          additionalData,
        },
        cryptoKey,
        payload.ciphertext as unknown as BufferSource,
      );

      return ok(new Uint8Array(plaintextBuf));
    } catch (error: unknown) {
      return err(
        new CryptoError(
          "TAMPERED_PAYLOAD",
          "Ciphertext authentication failed. Data has been tampered with or key is invalid.",
          error,
        ),
      );
    }
  }

  public async hashSha256(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data as unknown as BufferSource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  public constantTimeCompare(a: string, b: string): boolean {
    return constantTimeEqual(a, b);
  }

  public async createBundle(
    databaseBytes: Uint8Array,
    passphrase: string,
  ): Promise<Result<string, CryptoError>> {
    const salt = this.generateRandomBytes(32);
    const kekRes = await this.deriveKey(passphrase, salt, DEFAULT_KDF_PARAMS);
    if (!kekRes.ok) return err(kekRes.error);

    const kek = kekRes.value;
    try {
      const encryptRes = await this.encrypt(databaseBytes, kek, "odyssey:v1:bundle");
      if (!encryptRes.ok) return err(encryptRes.error);

      const checksum = await this.hashSha256(encryptRes.value.ciphertext);

      const bundle: OdybundleV1 = {
        format: "odyssey-bundle",
        bundleVersion: 1,
        schemaVersion: 1,
        exportedAt: Date.now(),
        kdf: {
          algorithm: "argon2id",
          memoryKiB: DEFAULT_KDF_PARAMS.memoryKiB,
          iterations: DEFAULT_KDF_PARAMS.iterations,
          parallelism: 1,
          saltBase64: this.toBase64(salt),
        },
        cipher: {
          algorithm: "AES-256-GCM",
          ivBase64: this.toBase64(encryptRes.value.iv),
          aad: "odyssey:v1:bundle",
        },
        ciphertextBase64: this.toBase64(encryptRes.value.ciphertext),
        bundleChecksumSha256: checksum,
      };

      const parseRes = OdybundleV1Schema.safeParse(bundle);
      if (!parseRes.success) {
        return err(
          new CryptoError("BUNDLE_CORRUPTED", "Failed to validate generated bundle schema"),
        );
      }

      return ok(JSON.stringify(bundle, null, 2));
    } finally {
      zeroize(kek);
    }
  }

  public async unpackBundle(
    bundleJson: string,
    passphrase: string,
  ): Promise<Result<Uint8Array, CryptoError>> {
    let rawBundle: unknown;
    try {
      rawBundle = JSON.parse(bundleJson);
    } catch (parseError: unknown) {
      return err(new CryptoError("BUNDLE_CORRUPTED", "Bundle is not valid JSON", parseError));
    }

    const validated = OdybundleV1Schema.safeParse(rawBundle);
    if (!validated.success) {
      return err(
        new CryptoError(
          "BUNDLE_CORRUPTED",
          "Bundle structure does not conform to .odybundle v1 specification",
        ),
      );
    }

    const bundle = validated.data;
    const ciphertext = this.fromBase64(bundle.ciphertextBase64);
    const expectedChecksum = await this.hashSha256(ciphertext);

    if (!this.constantTimeCompare(expectedChecksum, bundle.bundleChecksumSha256)) {
      return err(
        new CryptoError(
          "BUNDLE_CORRUPTED",
          "Bundle SHA-256 checksum mismatch: File has been tampered with",
        ),
      );
    }

    const salt = this.fromBase64(bundle.kdf.saltBase64);
    const kekRes = await this.deriveKey(passphrase, salt, {
      memoryKiB: bundle.kdf.memoryKiB,
      iterations: bundle.kdf.iterations,
    });

    if (!kekRes.ok) return err(kekRes.error);

    const kek = kekRes.value;
    try {
      const decryptRes = await this.decrypt(
        {
          algorithm: "AES-256-GCM",
          iv: this.fromBase64(bundle.cipher.ivBase64),
          ciphertext,
          aad: bundle.cipher.aad,
        },
        kek,
      );

      if (!decryptRes.ok) {
        return err(
          new CryptoError(
            "INVALID_PASSPHRASE",
            "Incorrect passphrase for bundle or corrupted ciphertext",
          ),
        );
      }

      return ok(decryptRes.value);
    } finally {
      zeroize(kek);
    }
  }

  private toBase64(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString("base64");
  }

  private fromBase64(base64: string): Uint8Array {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }
}
