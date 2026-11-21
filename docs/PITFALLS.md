# Odyssey Engineering Pitfalls & Technical Traps

This living document captures known edge cases, architectural traps, and lessons learned during the development of Odyssey.

---

## 1. OPFS & SharedArrayBuffer in Modern Browsers
- **Trap:** SQLite WASM with OPFS SyncAccessHandle requires `SharedArrayBuffer` in Web Workers.
- **Symptom:** Silent fallback to in-memory temporary storage if COOP/COEP headers are missing.
- **Mitigation:** Ensure dev server and production hosting configure:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

---

## 2. RTL Layout & Physical CSS Drift
- **Trap:** Accidentally using Tailwind `ml-*`, `mr-*`, `left-*` classes breaks Persian RTL mirroring.
- **Symptom:** Uneven margins, flipped icons, and misaligned labels in Persian mode.
- **Mitigation:** Mechanically blocked by `scripts/audit-logical-css.mjs` and pre-commit hooks. Always use `ms-*`, `me-*`, `start-*`, `end-*`.

---

## 3. Persian Word Counting & ZWNJ (نیم‌فاصله)
- **Trap:** Standard `.split(/\s+/)` counts `می‌خواهم` or `کتاب‌ها` as two words because of the zero-width non-joiner (`\u200C`).
- **Symptom:** False positive `WordCountInvariantError` on valid Six-Word Odyssey Titles (INV-03).
- **Mitigation:** Always use `countWords` from `@odyssey/domain/src/core/word-counter.ts`, which joins intra-token ZWNJ before splitting.

---

## 4. Domain Layer Dependency Leakage
- **Trap:** Importing a React utility, Zustand store, or SQLite types into `packages/domain`.
- **Symptom:** Domain becomes coupled to I/O and cannot be tested or re-used in workers/CLI.
- **Mitigation:** Strictly enforced by `.dependency-cruiser.cjs` in CI.
