import type { WrappedKey } from "./crypto-service.port.js";

export interface VaultHeader {
  vaultId: string;
  vaultVersion: number;
  wrappedDek: WrappedKey;
  createdAt: number;
  updatedAt: number;
}

export interface IVaultStoragePort {
  hasVault(): Promise<boolean>;
  readHeader(): Promise<VaultHeader | null>;
  writeHeader(header: VaultHeader): Promise<void>;
  readEncryptedDatabase(): Promise<Uint8Array | null>;
  writeEncryptedDatabase(data: Uint8Array): Promise<void>;
  deleteVault(): Promise<void>;
}
