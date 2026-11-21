# Odyssey Agent Onboarding Guide

Welcome AI Agent. This repository contains the **Odyssey** Life Design Studio.

## Essential Architectural Directives
Before modifying any code, consult the following authoritative documents in order:
1. `SRD.md` — Software Requirements Document, domain invariants, schema specs.
2. `AGENT.md` — AI Agent execution constitution and quality gates.
3. `DS.md` — Visual & interaction design system (colors, typography, component specs).
4. `Featurelist.json` — Feature dependency graph and acceptance criteria.
5. `docs/PROGRESS.md` — Historical memory and session tracking.

## Mandatory Quality Gates Before PR / Commit
```bash
pnpm dep:check        # Hexagonal boundary check (0 violations)
pnpm lint             # Biome formatting and style check
pnpm typecheck        # TypeScript strict verification
pnpm test:unit        # Unit and invariant tests
pnpm audit:telemetry  # Zero external network calls verification
pnpm audit:css        # 100% CSS Logical Properties check
```
