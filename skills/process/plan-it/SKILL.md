---
name: plan-it
description: Plan a code change before implementation. Use when the user wants to add, modify, remove, or fix behavior and needs an approach, impact analysis, testing strategy, acceptance criteria, or implementation plan.
---

# Plan It

Plan before editing. Produce the smallest justified, verifiable plan that fits the current system.

A plan describes the goal and the load-bearing decisions that reach it — not the procedure to type it out. Decide the outcome, the interfaces and boundaries involved, and how correctness is verified; leave exact code, edit ordering, and naming to `/implement-plan`. Test: if a detail could change during implementation without invalidating the plan, it does not belong in the plan.

## Hard Gates

1. Inspect before planning: read `CLAUDE.md` and `CONTEXT.md` if present, then inspect relevant code, tests, docs, and configuration.
2. Use native planning: call the harness plan-mode tool if available, such as `EnterPlanMode`. If only a todo/plan tracker exists, use it. If neither exists, state that before writing a Markdown plan.
3. Do not implement. Planning must not edit product files, create artifacts, or run implementation commands.
4. Describe decisions, not procedure. State what changes, where, why it fits, and how it is verified. Do not write production code, pseudo-code, or a step-by-step edit list — those are `/implement-plan`'s output.
5. Apply `/persistent-side-effects`: planning creates no files, directories, branches, commits, staged changes, or scratch artifacts unless the user explicitly approved them.
6. Record both the formal-check decision and the TDD decision.

## Planning Steps

1. Restate the goal in user-facing behavior terms.
2. Summarize current behavior, nearby tests, affected public interfaces, existing patterns, and the blast radius (which modules or contracts are in scope) — not a file-by-file edit list.
3. Choose the smallest approach that fits the codebase, described at the level of decisions and boundaries: which interface, which pattern, what stays out of scope. Stop short of how to write it. Compare alternatives only when there are real options.
   - If the goal is feasibility assessment only, stop here. Report blast radius, risks, and a go/no-go; no full plan is needed.
4. Decide the formal principle check:
   - `required` when an existing checker applies or the user requested one.
   - `unavailable` when required but not found.
   - `not needed` when no documented checker applies.
   - Note the exact checker command and whether user approval is required before continuing.
5. Decide validation:
   - Ask one direct TDD question for behavior changes unless the user already specified TDD, test-first, or post-implementation tests.
   - `TDD: yes` means `/implement-plan` must invoke `/tdd`; first production edit happens only after an expected RED test.
   - `TDD: no` means tests may be added after or alongside implementation.
6. List the observable behaviors to test. Prefer user-visible behavior, edge cases, error paths, permissions, state transitions, serialization, concurrency, and public contract expectations.

## Plan Format

```markdown
## Goal

## Current Understanding

## Proposed Approach

<!-- The decision and why it fits: interface, pattern, boundaries. No code, pseudo-code, or edit steps. -->

## Affected Areas

<!-- Modules, contracts, and interfaces in scope — the blast radius, not a file-by-file edit list. -->

## Risks

## Formal Principle Check

<!-- required / unavailable / not needed -->
<!-- Checker: command, file, skill, or workflow to run -->
<!-- Conflict condition: what would stop implementation -->
<!-- User approval required: yes / no -->

## Test-First Decision

## Test Behavior Inventory

## Validation Plan

## Open Questions
```

## Completion Criterion

The plan is complete when it states what will change, where, why it fits the codebase, how correctness will be verified, whether a formal check gates implementation, whether implementation is test-first, which behaviors should be tested, and what risks or unknowns remain.

After the plan is accepted, move to `/implement-plan`.
