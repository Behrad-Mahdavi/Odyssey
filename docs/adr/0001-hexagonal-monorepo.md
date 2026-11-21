# ADR 0001: Hexagonal Monorepo Architecture with Strict Package Boundaries

## Status
Accepted

## Context
Odyssey requires long-term maintainability, multi-platform targets (Web PWA, Tauri Desktop, optional Sync Relay), and strict isolation of domain invariants from database, framework, and UI layers.

## Decision
Adopt a Ports & Adapters (Hexagonal) architecture within a `pnpm` + `Turborepo` monorepo:
1. `packages/domain`: Pure TypeScript, zero external I/O or framework dependencies. Enforces all life design methodology invariants.
2. `packages/application`: Use Cases, CQRS ports, and XState v5 statecharts.
3. `packages/storage-sqlite`, `packages/crypto`, `packages/ui`: Swappable infrastructural adapters.
4. Boundary rules are mechanically enforced in CI via `dependency-cruiser`.

## Consequences
### Positive
- Domain rules are unit-testable in milliseconds without mocks.
- Storage or UI engines can be swapped without touching business logic.
### Trade-offs
- Requires disciplined mapping between domain entities and DTOs.
