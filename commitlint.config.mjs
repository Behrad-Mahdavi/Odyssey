/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "domain",
        "application",
        "storage",
        "crypto",
        "ui",
        "web",
        "desktop",
        "sync",
        "plugin",
        "foundation",
        "odyssey",
        "deps",
        "ci",
        "docs",
      ],
    ],
    "subject-case": [0],
  },
};
