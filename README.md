# Odyssey

> A calm, tactile, local-first studio for designing life and career trajectories.

Odyssey is an open-source, zero-knowledge, local-first drafting studio built around design thinking principles. It unites reflective journaling, mind mapping, parallel life scenarios, and prototyping experiments into a connected, privacy-preserving pipeline.

---

## Key Architectural Principles

- **Local-First & Zero-Knowledge Vault:** Data is stored locally in SQLite (WASM/OPFS on web, native on desktop) and encrypted with AES-256-GCM and Argon2id. No telemetry, no default remote calls.
- **Hexagonal Architecture:** Core domain logic (`@odyssey/domain`) is 100% pure TypeScript with zero framework or database dependencies.
- **Tactile & Archival Aesthetic:** High-contrast archival paper and copperplate dark themes inspired by engineering blueprints. No AI gradients or clutter.
- **Native Dual Language & Print:** First-class Persian (`fa-IR`) and English (`en-US`) support using 100% CSS Logical Properties and vector PDF output.

---

## Monorepo Structure

```text
odyssey/
├── packages/
│   ├── domain/           # Pure domain logic & methodology invariants
│   ├── application/      # Use cases, ports, and XState v5 statecharts
│   ├── storage-sqlite/   # SQLite WASM/OPFS and Drizzle ORM adapter
│   ├── crypto/           # Argon2id, AES-256-GCM & .odybundle backup
│   ├── sync-engine/      # Conflict-free sync engine contracts
│   ├── plugin-sdk/       # Sandboxed extensibility interfaces
│   └── ui/               # Design tokens, typography & accessible primitives
└── apps/
    ├── web/              # Web PWA client (Vite + React 19)
    ├── desktop/          # Native desktop client (Tauri v2)
    └── sync-server/      # Optional self-hosted E2EE sync relay
```

---

## Development & Quality Commands

```bash
pnpm install          # Install monorepo dependencies
pnpm build            # Build all packages via Turborepo
pnpm test:unit        # Run unit tests across packages
pnpm lint             # Check formatting and style with Biome
pnpm typecheck        # Strict TypeScript verification
pnpm dep:check        # Architectural dependency boundary verification
pnpm audit:telemetry  # Scan for external endpoints & CDNs
pnpm audit:css        # Verify 100% CSS Logical Properties
```

---

## Legal & Intellectual Property Disclaimer

Odyssey is an independent open-source project. All UI microcopy, design assets, and architectural specifications are developed independently.

---

## License

MIT License. See [LICENSE](./LICENSE) for details.
