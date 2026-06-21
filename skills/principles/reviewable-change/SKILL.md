---
name: reviewable-change
description: Diff hygiene principles for human-auditable changes. Use when deciding how to split, limit, or report a diff so behavior changes, refactors, renames, formatting, generated output, and test changes remain separable and reviewable.
---

# Reviewable Change

Write changes so a future reviewer can reconstruct intent from the diff.

## Keep One Purpose Per Diff

Separate different kinds of work:

- Behavior change.
- Refactor.
- Rename.
- Formatting.
- Generated output.
- Test-only change.
- Documentation change.

Do not mix broad cleanup with feature work. If cleanup is necessary, keep it local to the edited path and explain why it was required.

## Make Intent Visible

Every meaningful edit should answer at least one of:

- Which requested behavior does this implement?
- Which existing bug or risk does this remove?
- Which existing pattern does this follow?
- Which validation proves this is correct?

If an edit cannot be tied to intent, remove it or split it into a separate requested change.

## Control Diff Size

Prefer the smallest diff that proves the behavior. Avoid:

- Rewriting files to change a small behavior.
- Renaming symbols across the repo during feature work.
- Reformatting untouched code.
- Moving code before proving the behavior needs movement.
- Introducing abstractions before the second real caller exists.

If a large diff is unavoidable, group it into reviewable phases and state the dependency between phases.

## Preserve Reviewer Independence

Do not rely on the agent's private reasoning as proof. The diff, tests, plan, and final report must give enough evidence for a reviewer to check the work.

Include in the final report:

- The behavior changed.
- The files or modules touched.
- The validation run.
- Any intentional non-local effect.
- Any risk that still needs human review.

## Completion Criterion

The diff is reviewable when it has one clear purpose, behavior changes are not mixed with broad refactors or formatting churn, every meaningful edit maps to intent, validation evidence is available, and a reviewer can understand the change without trusting hidden agent reasoning.
