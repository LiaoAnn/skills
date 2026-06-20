---
name: ci-triage
description: Triage and boundedly remediate failing CI or local validation checks. Use when builds, type checks, lint, tests, GitHub checks, or other CI jobs fail and the user wants to know what is caused by the current change, what can be auto-fixed safely, what needs implementation work, or what can be treated as unrelated.
---

# CI Triage

Find the smallest trustworthy signal before chasing every failure.

## Process

### 1. Capture the Failing Checks

List each failing command or CI job with:

- Check name.
- Failure summary.
- Relevant log excerpt.
- Whether it ran on the current branch, base branch, or both.

Separate skipped checks, infrastructure failures, and code failures.

### 2. Reproduce the Cheapest Local Signal

Run local checks in dependency order, starting with the cheapest check that can explain the rest:

1. Formatting or lint for touched files.
2. Typecheck or static analysis.
3. Focused tests near the change.
4. Broader test or integration suite.

If static checks fail, fix them before interpreting downstream test failures. Type or compile errors often cause cascading failures.

### 3. Compare Against the Base When Needed

If the failure may be pre-existing or environmental, compare the same check against the base branch or a known-good commit.

Classify each failure:

- **Introduced by this change** — fix now.
- **Pre-existing** — report with evidence and avoid widening scope unless asked.
- **Infrastructure or environment** — report the evidence and identify any rerun or access needed.
- **Unknown** — keep investigating until it can be classified or a blocker is explicit.

### 4. Apply Bounded Fixes

Fix only low-risk failures that are mechanical, local, and clearly caused by the current change:

- Formatter or linter autofixes.
- Missing imports, type-only imports, or obvious import ordering.
- Regenerated types or generated artifacts when the command is known and expected.
- Typo-level test or fixture updates where the intended behavior is already clear.
- Command/config mismatches that only affect the validation harness.

Do not use CI triage to design new behavior, change product logic to satisfy a test, perform broad refactors, or guess at a product bug's root cause. Hand those off:

- Use `/implement-plan` when the fix needs a code-change plan or non-mechanical implementation.
- Use `/diagnose-bug` when the failure reveals a product/runtime behavior bug whose cause is not yet known.

After any bounded fix, rerun the narrowest check that proves it.

### 5. Report the State

Report:

- Which failures were caused by the current change.
- Which were pre-existing or environmental, with evidence.
- Which bounded fixes were applied.
- Which failures need `/implement-plan` or `/diagnose-bug`.
- Which commands were rerun and their result.
- Any remaining blocker and the exact artifact needed next.

## Completion Criterion

CI triage is complete when each failing check is classified, safe bounded fixes have been applied and rerun, failures needing implementation or bug diagnosis are handed off with evidence, and the remaining failures have evidence showing why they are pre-existing, environmental, flaky, or blocked.
