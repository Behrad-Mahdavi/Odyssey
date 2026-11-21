## Pull Request Summary
<!-- Provide a concise description of changes and motivation -->

### Related Feature / Issue
- Closes #[issue_number]
- Featurelist ID: `F-XXX` (if applicable)

---

### Mandatory Quality Checklist (Definition of Done)
- [ ] **Domain Invariants:** Verified that no domain rules (`INV-01` to `INV-08`) are violated.
- [ ] **Pure Domain Isolation:** `@odyssey/domain` contains 0 React, DOM, Drizzle, or SQLite imports.
- [ ] **Bidirectional Layout (RTL/LTR):** 100% Logical CSS used (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`); zero physical classes (`ml-`, `mr-`, etc.).
- [ ] **Privacy & Zero-Telemetry:** No external CDN links, remote analytics, or unapproved network requests introduced.
- [ ] **No Sensitive Logging:** Zero plaintext logging of Workview, Lifeview, Odyssey, or Vault Passphrases in `console.log`.
- [ ] **Verification Commands Passed:**
  - `pnpm dep:check` (Exit code 0)
  - `pnpm lint` (Exit code 0)
  - `pnpm typecheck` (Exit code 0)
  - `pnpm test:unit` (Exit code 0)
