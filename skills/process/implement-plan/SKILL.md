---
name: implement-plan
description: Implement an agreed code-change plan. Use when a plan exists or the user asks the agent to execute planned work, edit code, run validation for that work, fix validation failures encountered during implementation, and report the final state.
---

# Implement Plan

Execute the accepted plan in small, verifiable slices.

## Hard Gates

1. Start from an accepted plan. If no plan exists and the change is not trivial, run `/plan-it` first.
2. Apply `/persistent-side-effects` before any file, directory, branch, staging, commit, deletion, move, overwrite, scratch, or notes artifact.
3. Run required formal gates before product tests or production code.
4. If the plan says `TDD: yes`, invoke `/tdd`; the first production edit must happen after a focused test has run RED for the expected reason.
5. Keep every edit mapped to the accepted plan. Stop and update the plan if the code contradicts it.
6. Preserve unrelated user work: do not revert, overwrite, stage, or commit changes outside the accepted plan.

## Process

### 1. Inspect Before Editing

Read relevant files and nearby tests. Confirm target behavior, likely files, validation commands, formal-check requirements, and user constraints.

If the plan no longer matches the code, stop and update the plan instead of forcing implementation.

### 2. Run Formal Gates

- `Formal principle check: not needed`: skip.
- `Formal principle check: unavailable`: stop and ask for an explicit user decision before tests or production code.
- `Formal principle check: required`: run the named checker first.

If a required checker is not identified, stop and update the plan. If a checker reports a conflict, stop and ask for a design decision. Do not weaken or bypass validation to proceed.

### 3. Implement Vertical Slices

Work one logical slice at a time:

```text
prepare gate -> implement slice -> validate -> report result -> propose commit message -> wait for approval
```

For `TDD: yes`, invoke `/tdd` and follow its red-green-refactor cycle. Allowed before RED: reading files, baseline checks, and formal principle/spec edits required by the plan.

Make focused edits that fit existing patterns. Use `/agentic-change-governance` for authority or scope questions, `/codebase-stewardship` for local pattern fit, and `/reviewable-change` when splitting or reporting the diff.

### 4. Validate Continuously

Run the cheapest relevant checks early:

1. Formatter or lint for touched files.
2. Typecheck or static checks.
3. Focused tests near the change.
4. Broader tests at the end when feasible.

Use `/property-based-testing` when the behavior is best expressed as an invariant, round trip, state-machine rule, permission rule, parser/serializer property, migration transform, or broad input-space guarantee.

If a check fails, inspect, fix the cause, and rerun until it passes or a real blocker is identified.

### 5. Finish With Evidence

Report what changed, validation results, commands that could not run, remaining risks, and the proposed commit message if a diff exists. Recommend `/review-change`; for larger features, recommend `/open-pr`.

## Completion Criterion

Implementation is complete only when the requested behavior is implemented, required formal gates passed or were handled by explicit user decision, practical validation passed or is blocked for a stated reason, no temporary debugging code remains, and `/persistent-side-effects` has not been violated.
