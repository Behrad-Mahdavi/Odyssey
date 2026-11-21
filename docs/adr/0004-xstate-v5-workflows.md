# ADR 0004: Complex Workflow Management with XState v5 Statecharts

## Status
Accepted

## Context
Multi-step cognitive exercises (e.g. 3-stage Good Time Journal, 4-step Decision Room, Reframe Studio) contain complex branching, hard domain locks (e.g. narrowing to max 5 options), and side effects that become brittle when managed through React `useEffect` / `useState` chains.

## Decision
Model all multi-step flows and the Vault lifecycle using XState v5 statecharts in `packages/application`:
- `wayfindingMachine`
- `ideationMachine`
- `decisionMachine`
- `vaultMachine`

## Consequences
### Positive
- Visual state verification, impossible states become unrepresentable.
- State machines are testable in isolation from React DOM rendering.
### Trade-offs
- Slight learning curve for developers unfamiliar with statecharts.
