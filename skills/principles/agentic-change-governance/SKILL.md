---
name: agentic-change-governance
description: Use when a proposed change may exceed accepted scope or introduce an unapproved design decision.
---

# Agentic Change Governance

Keep agentic coding inside the authority granted by the user, the plan, and the existing system.

## Classify Authority Before Editing

Classify each intended change:

- **In scope**: directly required by the user request or accepted plan.
- **Local support**: small nearby change needed to make the requested behavior correct.
- **Design change**: alters architecture, ownership boundaries, public APIs, conventions, storage shape, deployment behavior, or cross-module responsibilities.
- **Opportunistic change**: cleanup, reorganization, abstraction, renaming, or style churn not required for the requested behavior.

Implement in-scope and necessary local-support changes. Design changes already explicitly approved in the request or plan may proceed; ask only for new or materially changed design decisions. Do not make opportunistic changes unless explicitly requested. A nearby cleanup is local support only when needed for correctness or to make the changed path understandable, not merely because it would be nicer.

## Preserve Human-Recognizable Shape

Long-running agentic work must not turn the codebase into a system only the agent understands.

Before introducing a new pattern, abstraction, directory shape, naming scheme, data flow, or error model:

1. Find the closest existing example.
2. Explain why the existing pattern is insufficient.
3. Keep the new pattern as small and local as possible.
4. Mark it as a design decision in the plan or final report.

If no existing pattern is found, prefer a direct implementation over inventing a framework.

## Respect System Rules

Treat project docs, public interfaces, module boundaries, lint rules, tests, and established conventions as constraints, not suggestions.

Do not weaken a rule to make a change pass:

- Do not disable tests, lint rules, type checks, or boundary checks without explicit approval.
- Do not widen types, loosen validation, or swallow errors to hide a mismatch.
- Do not bypass a public API by importing internals.
- Do not make behavior configurable only to avoid deciding the correct behavior.

If the system rule appears wrong, report the conflict and propose a separate design change.

## Escalation Triggers

Stop and request approval or a revised plan when an action not already explicitly approved would:

- Move code across module or ownership boundaries.
- Introduce a new cross-cutting abstraction.
- Change a public contract, persisted data shape, migration behavior, or deployment sequence.
- Remove or replace an established pattern.
- Touch many unrelated files.
- Mix behavior change with broad refactoring or formatting.
- Require weakening validation to pass.

## Completion Criterion

The change stays within the accepted authority: every edit maps to the request or accepted plan, no unapproved design or opportunistic changes are included, system rules remain intact unless their change was explicitly approved, and every architecture, contract, ownership, or convention change has explicit approval rather than merely appearing in a final report.
