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

### 4. Define Validation

Specify how the implementation will be checked:

- Formatting, linting, typechecking, or static analysis.
- Focused unit/integration/e2e tests.
- Manual verification, if needed.
- Regression checks for affected behavior.

If no good test seam exists, call that out as a risk instead of pretending validation is strong.

### 5. Produce the Plan

Use this format:

```markdown
## Goal

## Current Understanding

## Proposed Approach

## Affected Areas

## Risks

## Validation Plan

## Open Questions
```

## Completion Criterion

The plan is complete when it answers:

- What will change.
- Where it will change.
- Why this approach fits the codebase.
- How correctness will be verified.
- What risks or unknowns remain.

After the plan is accepted, move to `/implement-plan`.
