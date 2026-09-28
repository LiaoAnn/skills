---
name: implement-plan
description: Use when executing an accepted implementation plan through validation.
---

# Implement Plan

Carry the accepted outcome through implementation, relevant validation, and self-review without pausing after the first passing slice.

## Preconditions and Authority

- Start from an accepted plan. A clear, low-risk implementation request can carry a brief inline plan; use `/plan-it` when material decisions remain unresolved.
- Necessary in-scope source and test changes do not need per-file approval. Get specific approval before Git actions, destructive actions, or writes to shared or production systems, and before work outside the accepted scope or a new design decision.
- Use relevant code and tests to confirm the plan, reusing evidence already gathered. Preserve unrelated user work.
- Adapt implementation details when new evidence preserves the accepted outcome and boundaries. Stop for a decision only when evidence invalidates a load-bearing design choice or changes scope, public behavior, ownership, or risk beyond what was approved.

## Implement and Validate

Work in logical slices. For each, make the change, run the checks that provide useful evidence, and self-review against the accepted outcome. Progress updates are informational, not requests for approval; continue until all slices are complete or a genuine blocker remains.

When `TDD: yes`, use `/tdd`. Behavior-changing production edits follow a focused test that ran RED for the expected reason. [Test judgment](../../principles/tdd/test-judgment.md) owns exemptions; do not manufacture a test just to satisfy the workflow. Reading and baseline checks may precede RED.

Choose validation by impact and evidence, not a fixed checklist:

- Run the narrowest check that detects the plausible failure: a focused test, typecheck, lint, generator check, or integration path.
- Run broader checks when affected boundaries, shared code, project requirements, or unresolved risk justify them—not merely because another slice finished.
- If the accepted outcome includes running or inspecting the application, do that; a green unit test alone does not complete it.
- Fix failures caused by this change within accepted scope and rerun affected checks. Do not chase unrelated failures or repeat unchanged checks without new evidence.

Stop only for unresolved failures, missing access, or an authority/design decision that cannot be resolved within scope. Do not weaken tests or rules to finish.

## Output

Report:

- Changes and completed outcomes.
- Validation commands and results, including blocked or unrun checks.
- Remaining risks and deviations from the plan.
- Any slice exempted from a new test, with the existing test/check that owns its concern—or explicitly that none does.

Recommend `/review-change` when an independent pass would add value. Do not stage or commit unless specifically approved.

## Completion Criterion

All accepted outcomes are implemented and inspected where requested; relevant validation passed or has a stated blocker; no temporary debugging code remains; and every side effect stayed within approved authority. A blocked result is reported as blocked, not as a completed implementation.
