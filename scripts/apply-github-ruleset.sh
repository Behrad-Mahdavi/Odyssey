#!/usr/bin/env bash
set -euo pipefail

# Script to apply GitHub branch protection ruleset using GitHub CLI (gh)
# Run: bash scripts/apply-github-ruleset.sh <owner/repo>

REPO="${1:-Behrad-Mahdavi/Odyssey}"

if ! command -v gh &> /dev/null; then
  echo "GitHub CLI (gh) is not installed. Please install gh or configure rulesets via GitHub Web UI."
  exit 1
fi

echo "Applying main branch protection ruleset to $REPO..."

gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/rulesets" \
  --input .github/rulesets/main-branch-ruleset.json

echo "✔ Ruleset successfully applied to $REPO on branch main."
