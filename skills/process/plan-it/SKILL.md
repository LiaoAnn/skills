---
name: plan-it
description: Use when a code change needs an approach, scope, or validation plan before implementation.
---

# Plan It

Produce the smallest justified plan: the outcome, load-bearing decisions, affected boundaries, and evidence of correctness. Leave exact code, filenames, edit ordering, and naming to implementation unless they are part of the contract.

## Boundaries

- Inspect only the instructions, code, tests, and configuration needed to resolve the planning decisions. Reuse current context rather than rereading it ceremonially.
- Planning alone does not authorize product edits or persistent artifacts. Keep the plan in the conversation unless another location is approved.
- Use the harness's planning support when it helps or is required. A short conversational plan is sufficient for a small, clear, low-risk change; no tool-availability announcement is needed.
- If asked only for feasibility, report approach, impact, risks, and go/no-go, then stop.

## Decisions to Resolve

1. **Outcome and scope.** What changes, what stays unchanged, and which modules or contracts are affected?
2. **Approach.** Which existing interface or pattern fits, and why? Compare alternatives only when the choice matters. Do not turn the plan into code or an edit itinerary.
3. **Validation.** Name observable behaviors and the cheapest checks that distinguish success from failure. Use [test judgment](../../principles/tdd/test-judgment.md) when deciding whether a new test adds coverage; do not load the TDD workflow merely to make that decision.
4. **Test-first choice.** Honor the user's choice or established project policy. Otherwise choose an appropriate approach and state it; ask only when an unresolved preference or trade-off materially changes the work. If TDD is chosen, `/implement-plan` follows `/tdd` for behavior-changing slices.
5. **Authority and unknowns.** Surface new design decisions, destructive actions, or external effects that need approval. Ask only questions that block a sound plan.

## Output

Scale detail to risk. For a small change, a paragraph covering goal, approach, scope, and validation is enough. For a larger change, use:

```markdown
## Goal and Scope
## Current Understanding
## Proposed Approach
## Validation
<!-- Observable behaviors, existing coverage, checks, and test-first choice. -->
## Risks and Open Decisions
```

Avoid repeating the same behavior inventory in several sections. The plan defines completion and genuine stop conditions, not approval checkpoints for every slice.

## Completion Criterion

The plan states the proposed outcome, affected boundaries, approach, validation and test-first choice, and any unresolved risk or approval. No implementation has occurred under planning-only authority.

Once accepted, continue with `/implement-plan`. If the user already authorized a clear, low-risk implementation, the brief plan need not introduce another approval round; new design decisions still require approval.
