---
name: implement-plan
description: Implement an agreed code-change plan. Use when a plan exists or the user asks the agent to execute planned work, edit code, run validation scripts, fix failures, and report the final state.
---

# Implement Plan

Execute the agreed plan in small, verifiable steps.

## Preconditions

Start from a plan. If the user has not provided one and the change is not trivial, run `/plan-it` first.

Before editing, identify:

- The target behavior.
- The files or modules likely to change.
- The validation commands to run.
- Any user constraints from the conversation.

## Process

### 1. Inspect Before Editing

Read the relevant files and nearby tests. Confirm the plan still matches the code.

If the code contradicts the plan, stop and update the plan instead of forcing the implementation.

### 2. Change in Small Steps

Work in vertical slices — one logical unit of behavior from the plan per slice:

```
implement slice → validate → commit → next slice
```

When implementing test-first, follow `/tdd` for the red-green-refactor discipline. After validation passes, commit before moving to the next slice. Do not accumulate changes across slices and commit at the end.

Make focused edits that map back to the plan. Avoid unrelated refactors and metadata churn.

Prefer existing project patterns over new abstractions. Add an abstraction only when it removes real complexity or matches a local convention.

### 3. Validate Continuously

Run the cheapest relevant checks early and often:

1. Formatter or lint for touched files, if available.
2. Typecheck or static checks.
3. Focused tests near the change.
4. Broader test suite or integration checks at the end when feasible.

If a command fails, inspect the failure, fix the cause, and rerun the relevant command. Repeat until it passes or a genuine blocker is identified.

### 4. Keep the User's Work Safe

Do not revert unrelated user changes. If the worktree contains changes outside the task, leave them alone.

If existing changes affect the same files, understand them and work with them.

### 5. Finish with Evidence

Before declaring done, verify:

- The requested behavior is implemented.
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

Implementation is complete only when the code is changed and the strongest practical validation has either passed or been blocked for a specific stated reason.
