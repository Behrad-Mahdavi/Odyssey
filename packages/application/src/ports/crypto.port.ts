import type { Result } from "@odyssey/domain";

/**
 * Port contract for Zero-Knowledge Vault Cryptography (Argon2id + AES-256-GCM).
 */
export interface ICryptoPort {
  deriveKey(passphrase: string, salt: Uint8Array): Promise<Result<Uint8Array, Error>>;
  encrypt(plaintext: Uint8Array, key: Uint8Array): Promise<Result<Uint8Array, Error>>;
  decrypt(ciphertext: Uint8Array, key: Uint8Array): Promise<Result<Uint8Array, Error>>;
  hash(data: Uint8Array): Promise<string>;
}
