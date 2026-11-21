import type { Result } from "@odyssey/domain";
import type { CryptoError } from "../errors/crypto-error.js";

export interface KdfParams {
  algorithm: "argon2id";
  memoryKiB: number; // >= 65536 (64 MiB)
  iterations: number; // >= 3
  parallelism: number; // 1
  hashLength: number; // 32 bytes (256-bit)
}

export interface EncryptedPayload {
  algorithm: "AES-256-GCM";
  iv: Uint8Array; // 12 bytes
  ciphertext: Uint8Array; // ciphertext + tag
  aad: string;
}

export interface WrappedKey {
  iv: Uint8Array;
  wrappedKey: Uint8Array;
  salt: Uint8Array;
  kdfParams: KdfParams;
  aad: string;
}

export interface ICryptoService {
  deriveKey(
    passphrase: string,
    salt: Uint8Array,
    params?: Partial<KdfParams>,
  ): Promise<Result<Uint8Array, CryptoError>>;
  generateRandomBytes(length: number): Uint8Array;
  wrapKey(
    dek: Uint8Array,
    kek: Uint8Array,
    aad: string,
    salt: Uint8Array,
    kdfParams: KdfParams,
  ): Promise<Result<WrappedKey, CryptoError>>;
  unwrapKey(wrapped: WrappedKey, kek: Uint8Array): Promise<Result<Uint8Array, CryptoError>>;
  encrypt(
    data: Uint8Array,
    key: Uint8Array,
    aad: string,
  ): Promise<Result<EncryptedPayload, CryptoError>>;
  decrypt(payload: EncryptedPayload, key: Uint8Array): Promise<Result<Uint8Array, CryptoError>>;
  hashSha256(data: Uint8Array): Promise<string>;
  constantTimeCompare(a: string, b: string): boolean;
  createBundle(databaseBytes: Uint8Array, passphrase: string): Promise<Result<string, CryptoError>>;
  unpackBundle(bundleJson: string, passphrase: string): Promise<Result<Uint8Array, CryptoError>>;
}
