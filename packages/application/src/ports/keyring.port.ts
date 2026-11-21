export interface IKeyringPort {
  savePassphrase?(passphrase: string): Promise<void>;
  getPassphrase?(): Promise<string | null>;
  clear?(): Promise<void>;
}
