---
name: plan-it
description: Plan a code change before implementation. Use when the user wants to add, modify, remove, or fix behavior and needs an approach, impact analysis, testing strategy, acceptance criteria, or implementation plan.
---

# Plan It

Plan before editing. The goal is to make the change small, justified, and verifiable.

## Process

### 1. Restate the Goal

Write the goal in one or two sentences from the user's perspective. Include the intended behavior, not just the implementation idea.

If the goal is ambiguous, ask only the questions that materially affect the plan.

### 2. Read the Current System

Read `CLAUDE.md` and `CONTEXT.md` first if they exist. Then inspect the relevant code, tests, docs, and configuration. Look for existing patterns before inventing new ones.

Identify:

- Current behavior.
- Public interfaces or seams involved.
- Nearby tests and validation commands.
- Existing conventions for similar changes.
- Likely affected files or modules.
- System rules, ownership boundaries, public contracts, or local patterns the change must preserve.
- Formal design or principle-check tooling explicitly tied to the affected area, such as proof models, design-rule checkers, or architecture conformance checks.

### 3. Choose the Approach

Prefer the smallest change that fits the existing design.

When there are multiple plausible approaches, compare them by:

- Blast radius.
- Testability.
- Fit with existing architecture — see `/architecture` for boundary and dependency principles.
- Fit with existing codebase identity — see `/codebase-stewardship` for local patterns, vocabulary, and avoiding parallel systems.
- Agent authority — see `/agentic-change-governance` before planning design, ownership, convention, or public-contract changes.
- Contract impact — see `/contracts` when APIs, schemas, events, jobs, exports, config, or other cross-boundary interfaces are involved.
- Reversibility.
- Risk of hidden behavior changes.

Do not over-design for hypothetical future requirements.

If the goal is feasibility assessment only, stop here. Report blast radius, risks, and a go/no-go recommendation without producing a full plan.

### 4. Decide Formal Principle Checks

If the affected area already has a formal design/principle checker, or the user explicitly requested a formal gate, include a formal-check decision before test planning.

Record:

- `Formal principle check: required` when an existing checker applies to the affected area or the user requested one.
- `Formal principle check: unavailable` when a checker is required but no suitable existing checker can be located.
- `Formal principle check: not needed` when no applicable checker is documented for the affected area and the user did not request one.
- The exact existing checker, command, file, skill, or workflow to use when known.
- What conflict or inconsistency would stop implementation.
- Whether user approval is required before implementation may continue; this is mandatory when the required checker is unavailable.

Do not invent a new formal verification framework during planning unless the user explicitly asked for that design work.

### 5. Define Validation

For behavior changes, ask the user whether they want test-first implementation unless they already specified test-first, TDD, or post-implementation tests. Keep this to one direct question, and continue only after the answer when it materially changes the implementation order.

Record the test-first decision in the plan:

- `TDD: yes` means `/implement-plan` should follow `/tdd` and write the focused failing test before production edits.
- `TDD: no` means tests may be added after or alongside implementation.
- If the change is trivial, test-hostile, or validation-only, state why TDD is not recommended.

Specify how the implementation will be checked:

- Formatting, linting, typechecking, or static analysis.
- Focused unit/integration/e2e tests.
- Manual verification, if needed.
- Regression checks for affected behavior.

List the test behaviors as completely as practical before implementation. Cover observable user-facing behavior first, then important edge cases, regressions, error paths, permissions, data boundaries, state transitions, serialization or migration behavior, concurrency or ordering concerns, and any contract/API expectations that could break callers.

If no good test seam exists, call that out as a risk instead of pretending validation is strong.

### 6. Produce the Plan

If the current coding-agent harness provides a native plan, planning, or todo mode, use that native mode to deliver and track the plan. Fill the plan content with the sections below.

Use this format:

```markdown
## Goal

## Current Understanding

## Proposed Approach

## Affected Areas

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

The plan is complete when it answers:

- What will change.
- Where it will change.
- Why this approach fits the codebase.
- How correctness will be verified.
- Whether a formal principle check is required, unavailable, or not needed; which checker should run before TDD when required; and whether unavailable tooling requires an explicit user decision before continuing.
- Whether implementation should be test-first, with the user's preference recorded when relevant.
- Which behaviors should be tested before or during implementation.
- What risks or unknowns remain.

After the plan is accepted, move to `/implement-plan`.
