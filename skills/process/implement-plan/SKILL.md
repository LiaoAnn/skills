---
name: implement-plan
description: Implement an agreed code-change plan. Use when a plan exists or the user asks the agent to execute planned work, edit code, run validation for that work, fix validation failures encountered during implementation, and report the final state.
---

# Implement Plan

Execute the agreed plan in small, verifiable steps.

## Preconditions

Start from a plan. If the user has not provided one and the change is not trivial, run `/plan-it` first.

Before editing, identify:

- The target behavior.
- The files or modules likely to change.
- The validation commands to run.
- Any formal principle check required by the plan.
- Any user constraints from the conversation.

## Process

### 1. Inspect Before Editing

Read the relevant files and nearby tests. Confirm the plan still matches the code.

If the code contradicts the plan, stop and update the plan instead of forcing the implementation.

### 2. Run Required Principle Checks

Case C — plan says `Formal principle check: not needed`: skip this step entirely.

Case A — plan says `Formal principle check: unavailable`, or plan says `required` but the checker cannot be located in the current checkout: stop and ask the user for an explicit decision before writing failing product tests or production code. Treat unavailable required tooling as a gate, not a warning.

Case B — plan says `Formal principle check: required` and the checker is present: run that check before writing failing product tests or production code.

Use the checker, command, workflow, or stack-specific skill named in the plan. If the plan requires a formal check but does not identify what to run, stop and update the plan before continuing.

The first implementation slice becomes:

```
formalize proposed behavior/principle impact → run principle check → stop on conflict or continue to next step
```

If the check reports a conflict, stop and update the plan or ask for a design decision. Do not bypass, weaken, or delete principle checks to make implementation proceed.

### 3. Change in Small Steps

Work in vertical slices — one logical unit of behavior from the plan per slice:

```
implement slice → validate → commit → next slice
```

When implementing test-first, follow `/tdd` for the red-green-refactor discipline. After validation passes, commit before moving to the next slice. Do not accumulate changes across slices and commit at the end.

Make focused edits that map back to the plan. Avoid unrelated refactors and metadata churn.

Prefer existing project patterns over new abstractions. Add an abstraction only when it removes real complexity or matches a local convention.

For established or large codebases, load only the principle matching the implementation decision: use `/agentic-change-governance` before making any design, ownership, convention, or public-contract change not already accepted in the plan; use `/codebase-stewardship` when choosing how the implementation should fit existing patterns; use `/reviewable-change` when splitting, limiting, or reporting the diff.

### 4. Validate Continuously

Run the cheapest relevant checks early and often:

1. Formatter or lint for touched files, if available.
2. Typecheck or static checks.
3. Focused tests near the change.
4. Broader test suite or integration checks at the end when feasible.

Use `/property-based-testing` when the behavior is best expressed as an invariant, law, round trip, migration transform, state-machine rule, permission rule, parser/serializer property, or broad input-space guarantee.

If a command fails, inspect the failure, fix the cause, and rerun the relevant command. Repeat until it passes or a genuine blocker is identified.

### 5. Keep the User's Work Safe

Do not revert unrelated user changes. If the worktree contains changes outside the task, leave them alone.

If existing changes affect the same files, understand them and work with them.

### 6. Finish with Evidence

Before declaring done, verify:

- The requested behavior is implemented.
- Any required formal principle check passed before implementation proceeded, or the user explicitly decided how to handle unavailable required tooling before implementation continued.
- The planned validation has been run or explicitly skipped with a reason.
- Any temporary debugging code has been removed.
- Remaining risks are stated.

## Output

Report:

- What changed.
- Which validation commands ran and whether they passed.
- Any commands that could not be run.
- Remaining risks or follow-up work.

Then recommend `/review-change` when a diff exists. For larger features, recommend `/open-pr` to prepare the pull request for review.

## Completion Criterion

Implementation is complete only when the code is changed, any required formal principle gate has passed or was handled by an explicit user decision, and the strongest practical validation has either passed or been blocked for a specific stated reason.
