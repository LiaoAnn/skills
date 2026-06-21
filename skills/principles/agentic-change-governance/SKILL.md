---
name: agentic-change-governance
description: Agent authority and scope-control principles. Use when deciding whether an agent is authorized to make or propose a change, especially design changes, ownership-boundary changes, convention changes, public-contract changes, opportunistic cleanup, or rule weakening outside the accepted request or plan.
---

# Agentic Change Governance

Keep agentic coding inside the authority granted by the user, the plan, and the existing system.

## Classify Authority Before Editing

Classify each intended change:

- **In scope**: directly required by the user request or accepted plan.
- **Local support**: small nearby change needed to make the requested behavior correct.
- **Design change**: alters architecture, ownership boundaries, public APIs, conventions, storage shape, deployment behavior, or cross-module responsibilities.
- **Opportunistic change**: cleanup, reorganization, abstraction, renaming, or style churn not required for the requested behavior.

Implement in-scope and local-support changes only. Stop and ask for human approval before making design changes. Do not make opportunistic changes unless explicitly requested.

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

Stop and request review or a revised plan when the change would:

- Move code across module or ownership boundaries.
- Introduce a new cross-cutting abstraction.
- Change a public contract, persisted data shape, migration behavior, or deployment sequence.
- Remove or replace an established pattern.
- Touch many unrelated files.
- Mix behavior change with broad refactoring or formatting.
- Require weakening validation to pass.

## Completion Criterion

The change stays within the accepted authority: every edit maps to the request or accepted plan, no unapproved design or opportunistic changes are included, system rules remain intact, and any architecture, contract, ownership, or convention change has been explicitly surfaced for human approval.
