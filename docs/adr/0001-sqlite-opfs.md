# ADR 0001: SQLite WASM + OPFS Engine, ISqlDriver Abstraction & Multi-Tab Web Locks

## Status
Accepted

## Context
Odyssey is built as a Local-First application. It requires:
1. True relational persistence and sub-millisecond queries.
2. Full-text search (FTS5) supporting Persian and English.
3. Code sharing between Web PWA and Native Desktop (Tauri v2).
4. Protection against database corruption when opened in multiple browser tabs simultaneously.

## Decision
1. **`ISqlDriver` Abstraction:**
   All repositories, migrations, and schema operate against `ISqlDriver` rather than directly coupling to a specific driver library.
   - `WasmOpfsDriver`: runs in a Dedicated Web Worker with `@sqlite.org/sqlite-wasm` and OPFS.
   - `BetterSqliteDriver`: runs in Node.js (Vitest) and Native Tauri desktop.
   - `WorkerStorageClient`: connects Main Thread to Web Worker via typed RPC messages.
2. **VFS Selection:**
   Use `opfs-sahpool` (SyncAccessHandle pool) or `opfs` VFS. It provides synchronous atomic writes inside the worker thread with maximum I/O throughput.
3. **Mandatory SQLite PRAGMAs:**
   - `PRAGMA foreign_keys = ON;`
   - `PRAGMA busy_timeout = 5000;`
   - `PRAGMA synchronous = NORMAL;`
   - `PRAGMA temp_store = MEMORY;`
4. **Multi-Tab Safety (Web Locks API):**
   The Web Worker acquires an exclusive Web Lock (`navigator.locks.request("odyssey-vault-lock", { ifAvailable: true })`). If a second tab is opened, it fails to acquire the lock and yields a structured `DATABASE_LOCKED_BY_OTHER_TAB` error, safeguarding file integrity.

## Consequences
### Positive
- Zero main thread blocking.
- Unified schema and migrations across web and desktop.
- Complete multi-tab corruption protection.
### Trade-offs
- Web Worker requires COOP/COEP headers for SharedArrayBuffer support in browsers.
