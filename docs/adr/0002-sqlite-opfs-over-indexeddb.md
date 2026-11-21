# ADR 0002: SQLite WASM + OPFS Over Raw IndexedDB

## Status
Accepted

## Context
The application is strictly Local-First. It requires relational joins, full-text search across multilingual journals, ACID transactions, and deterministic schema migrations. IndexedDB is notoriously prone to browser quirks, lacks native FTS5, and has complex transaction semantics.

## Decision
Use official SQLite WASM backed by the Origin Private File System (OPFS) running in a dedicated Web Worker for the web client, and Native SQLite in Tauri desktop.
- Drizzle ORM provides type-safe schema definitions and query building.
- SQLite FTS5 provides fast local full-text search.

## Consequences
### Positive
- True ACID transactions and relational data integrity.
- High-performance binary file storage via OPFS SyncAccessHandle.
- Unified SQL schema across Web and Native Desktop.
### Trade-offs
- Requires Cross-Origin Opener Policy (COOP) and Cross-Origin Embedder Policy (COEP) headers for SharedArrayBuffer support in OPFS.
