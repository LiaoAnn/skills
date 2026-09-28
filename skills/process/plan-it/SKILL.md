---
name: plan-it
description: Use when a code change needs an approach, scope, or validation plan before implementation.
---

# Plan It

Plan from the reason outward: **Why** the change matters to its users, **How** it fits the current system, and **What** will be delivered in verifiable slices. Leave exact code, filenames, edit ordering, and naming to implementation unless they are part of the contract.

## Boundaries

- Inspect only the instructions, code, tests, and configuration needed to resolve the planning decisions. Reuse current context rather than rereading it ceremonially.
- Planning alone does not authorize product edits or persistent artifacts. Keep the plan in the conversation unless another location is approved.
- Use the harness's planning support when it helps or is required. A short conversational plan is sufficient for a small, clear, low-risk change.
- If asked only for feasibility, report approach, impact, risks, and go/no-go, then stop.

## 1. Establish the Why

Before anything else, state who the change is for, what problem it solves for them, and what success looks like from their side. The Why is the source of the acceptance criteria and the test for scope.

The request must supply three things: the desired capability, the acceptance standard, and the user value. Ask only for what is missing; do not re-ask what the user already stated. When the user gives only a How ("add a column", "switch to X"), ask what it is for.

## 2. Decide the How

Choose the approach in terms of the current system: which existing module, interface, or pattern it extends, what stays unchanged, and which trade-offs matter. Compare alternatives only when the choice matters. Stay abstract — no code, pseudo-code, or edit itinerary.

When the approach depends on something not yet observed — an external endpoint, a GPU path, a third-party permission, a deploy target — check it for real before committing the plan: one call or run that shows it works. A blocked dependency found here costs a question; found after building, it costs the build.

## 3. Cut the What into Slices

Deliver the work as an ordered list of slices. Each slice:

- **Outcome** — a result a user or caller can observe.
- **Acceptance** — how that outcome is demonstrated on the real system: the command, request, or user flow, and the observable result that counts as passing. Checks such as tests, typecheck, or lint support acceptance; they do not replace it.
- **Boundary** — the modules or contracts it touches, and what it deliberately leaves alone.
- **Serves** — which part of the Why it advances.

A slice that serves no part of the Why is cut, not deferred into the same branch. Size each slice so it can be committed, reviewed, and reverted on its own; if one would span several unrelated boundaries, split it. Order slices so each builds on a verified base.

## 4. Settle Validation and Authority

- **Test-first.** Honor the user's choice or project policy; otherwise choose and state it. If TDD is chosen, `/implement-plan` follows `/tdd` for behavior-changing slices. Use [test judgment](../../principles/tdd/test-judgment.md) to decide whether a new test adds coverage.
- **Project verification.** Name the project's verify skill if it has one; otherwise state how acceptance will be driven for this kind of app.
- **Commits.** Record whether each slice is committed automatically after it passes, or only on request.
- **Approvals.** Surface new design decisions, destructive actions, or effects on shared or production systems that need approval. Ask only questions that block a sound plan.

## Output

Scale detail to risk. A small change needs a few lines covering Why, How, and one slice. For a larger change:

```markdown
## Why
<!-- Who it is for, the problem, the value, what success looks like to them. -->
## How
<!-- Approach within the current architecture; trade-offs; feasibility checks run. No code. -->
## What
<!-- Ordered slices: Outcome, Acceptance, Boundary, Serves. -->
## Validation and Authority
<!-- Test-first choice, project verification, commit policy, approvals needed. -->
## Risks and Open Decisions
```

## Completion Criterion

The plan states the Why, the How, and ordered slices that each have an observable outcome, a real-system acceptance check, a boundary, and a link to the Why; feasibility of unobserved dependencies was checked or is listed as a risk; test-first choice, verification method, and commit policy are recorded. No implementation has occurred under planning-only authority.

Once accepted, continue with `/implement-plan`. If the user already authorized a clear, low-risk implementation, the brief plan need not introduce another approval round; new design decisions still require approval.
