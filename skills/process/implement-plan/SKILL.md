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
4. If the plan says `TDD: yes`, invoke `/tdd`; for slices that change behavior, the first production edit must happen after a focused test has run RED for the expected reason. Slices `/tdd`'s test-necessity gate exempts are not owed a RED (see *Implement Vertical Slices*).
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

Work one logical slice at a time, and carry through every slice in the plan without pausing for approval between them:

```text
prepare gate -> implement slice -> validate -> self-review against the plan -> report progress -> next slice
```

Self-review is the agent's own check that the slice matches the plan and validation passed — not a request for user confirmation. Report progress is a brief non-blocking note of what the slice did and its validation result; it is informational, not a checkpoint. Do not stop after a passing slice to ask whether to continue; proceed to the next slice.

Stop mid-run only for a genuine gate:
- A validation failure or blocker that cannot be resolved autonomously.
- Code that contradicts the plan (per Hard Gate 5, stop and update the plan).
- A required formal-check conflict (per step 2).
- A persistent side effect that `/persistent-side-effects` requires user approval for.

For `TDD: yes`, invoke `/tdd` and follow its red-green-refactor cycle.

`TDD: yes` applies to the slices that change behavior. It does not mean every slice opens with a RED. Allowed before RED: reading files, baseline checks, and formal principle/spec edits required by the plan. Separately, edits that `/tdd`'s test-necessity gate exempts are owed no RED at all — that gate, not a category of file, decides which. Never manufacture a test to justify starting a slice; implement it, and carry the exemption into the final report per step 5.

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

Report what changed, validation results, commands that could not run, remaining risks, any slice shipped without a test under `/tdd`'s gate together with what owns its concern instead — another test, a project mechanism, or nothing, and "nothing" is itself worth reporting — and the proposed commit message if a diff exists. Recommend `/review-change`.

## Completion Criterion

Implementation is complete only when the requested behavior is implemented, required formal gates passed or were handled by explicit user decision, practical validation passed or is blocked for a stated reason, no temporary debugging code remains, and `/persistent-side-effects` has not been violated.
