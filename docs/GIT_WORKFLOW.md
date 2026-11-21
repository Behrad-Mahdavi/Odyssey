# Odyssey Git Workflow & Release Engineering

This document specifies the branching, commit, pull request, and release standards for **Odyssey**.

---

## 1. Branching Strategy
- **`main`**: The production-ready trunk. Direct pushes are blocked via GitHub Rulesets. All changes enter via Pull Requests passing full CI.
- **Feature Branches**: `feat/<scope>-<description>` (e.g., `feat/storage-opfs-migration`)
- **Fix Branches**: `fix/<scope>-<description>` (e.g., `fix/domain-zwnj-counter`)
- **Refactor Branches**: `refactor/<scope>-<description>`

---

## 2. Conventional Commits & Commitlint
Every commit message must strictly adhere to the Conventional Commits specification:
```text
<type>(<scope>): <short summary>

[optional body explaining motivation]

[optional footer(s)]
```

### Allowed Scopes:
- `domain`: Changes to `@odyssey/domain`
- `application`: Changes to `@odyssey/application`
- `storage`: Changes to `@odyssey/storage-sqlite`
- `crypto`: Changes to `@odyssey/crypto`
- `ui`: Changes to `@odyssey/ui`
- `web`: Changes to `apps/web`
- `desktop`: Changes to `apps/desktop`
- `sync`: Changes to `@odyssey/sync-engine` or `apps/sync-server`
- `plugin`: Changes to `@odyssey/plugin-sdk`
- `foundation`: Monorepo infrastructure, configuration, and tooling
- `odyssey`: Odyssey Plan generator and Pitch Mode
- `deps`: Dependency updates
- `ci`: GitHub Actions and CI workflows
- `docs`: Documentation and ADRs

---

## 3. Pull Request Requirements
1. Every PR must have at least one approving review and pass all required CI checks.
2. PR descriptions must follow `.github/PULL_REQUEST_TEMPLATE.md`.
3. PRs must not merge with broken tests or failing boundary checks.

---

## 4. Release Process (Changesets)
1. Developers run `pnpm changeset` when adding features or fixes to record changelog intent.
2. When merged to `main`, the `release.yml` workflow automatically creates a Versioning PR.
3. Merging the Versioning PR publishes releases and tags git commits automatically.
