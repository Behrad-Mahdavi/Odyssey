/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "domain-pure-isolation",
      comment:
        "packages/domain/src must be 100% pure TypeScript. No React, DOM, Drizzle, SQLite, Zustand, or UI imports allowed.",
      severity: "error",
      from: {
        path: "^packages/domain/src",
      },
      to: {
        pathNot: "^packages/domain",
      },
    },
    {
      name: "application-layer-boundaries",
      comment:
        "packages/application may only import from @odyssey/domain, and standard application libraries (xstate, zod). It cannot import storage-sqlite, ui or apps.",
      severity: "error",
      from: {
        path: "^packages/application",
      },
      to: {
        path: "^(packages/storage-sqlite|packages/ui|apps/)",
      },
    },
    {
      name: "ui-cannot-import-storage",
      comment:
        "packages/ui and apps/web cannot directly query or import storage-sqlite or database layers.",
      severity: "error",
      from: {
        path: "^packages/ui",
      },
      to: {
        path: "^(packages/storage-sqlite|packages/crypto|packages/sync-engine)",
      },
    },
    {
      name: "no-circular-dependencies",
      comment: "No circular dependencies are allowed anywhere in the monorepo.",
      severity: "error",
      from: {},
      to: {
        circular: true,
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.base.json",
    },
  },
};
