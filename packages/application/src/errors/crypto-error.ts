export type CryptoErrorCode =
  | "INVALID_PASSPHRASE"
  | "TAMPERED_PAYLOAD"
  | "VAULT_LOCKED"
  | "VAULT_ALREADY_INITIALIZED"
  | "VAULT_NOT_INITIALIZED"
  | "WEAK_KDF_PARAMS"
  | "BUNDLE_CORRUPTED"
  | "UNSUPPORTED_BUNDLE_VERSION"
  | "ENCRYPTION_FAILED"
  | "DECRYPTION_FAILED";

export class CryptoError extends Error {
  constructor(
    public readonly code: CryptoErrorCode,
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(`[${code}] ${message}`);
    this.name = "CryptoError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
