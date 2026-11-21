# ADR 0003: Zero-Knowledge Client Vault with Argon2id and AES-256-GCM

## Status
Accepted

## Context
Life design data (Workview, Lifeview, 5-year Odyssey plans, failure reclassifications) contains sensitive psychological reflections. User trust requires absolute privacy guarantees.

## Decision
All user data is encrypted locally at rest using `AES-256-GCM`.
1. Key derivation uses `Argon2id` (WASM in Worker) with high-memory parameters.
2. The user passphrase is never written to persistent disk or transmitted over the network.
3. Encrypted export bundles use the `.odybundle` format with SHA-256 checksums.

## Consequences
### Positive
- Zero risk of cloud data breaches.
- True cryptographic ownership for the user.
### Trade-offs
- Passphrase recovery is impossible if forgotten (by design). Clear UI warnings are mandatory.
