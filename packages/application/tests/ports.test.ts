import { describe, expect, it } from "vitest";
import { StorageError, type StorageStatus } from "../src/index.js";

describe("Application Storage Ports & Errors", () => {
  it("should create structured StorageError with standard error codes", () => {
    const error = new StorageError(
      "DATABASE_LOCKED_BY_OTHER_TAB",
      "Another browser tab currently holds exclusive lock on Odyssey OPFS vault.",
    );

    expect(error.code).toBe("DATABASE_LOCKED_BY_OTHER_TAB");
    expect(error.message).toContain("[DATABASE_LOCKED_BY_OTHER_TAB]");
    expect(error.name).toBe("StorageError");
  });

  it("should typecheck StorageStatus interface", () => {
    const status: StorageStatus = {
      isInitialized: true,
      vfs: "opfs-sahpool",
      databaseName: "odyssey_vault.sqlite3",
      schemaVersion: 1,
      totalRecordsEstimate: 120,
    };

    expect(status.vfs).toBe("opfs-sahpool");
  });
});
