---
name: persistent-side-effects
description: Use when deciding whether a filesystem, Git, environment, or external side effect needs additional approval.
---

# Persistent Side Effects

An accepted implementation request or plan authorizes necessary changes within its scope, not every action an agent could take. A question, investigation, or planning request alone does not authorize implementation.

## Covered by Implementation Approval

Without asking again for each file or command:

- Create or edit source files and tests needed for the accepted outcome.
- Update generated artifacts through the project's expected tooling when required by those changes.
- Run known-safe local validation and fix failures caused by the requested change within the same scope. Disposable fixtures and expected build/test outputs are included when the environment is known to be isolated from production.
- Make necessary local-support edits under `/agentic-change-governance`.

The plan need not enumerate exact filenames. Authorization follows the accepted outcome and boundaries; a test demanding a change is not itself authorization. Unknown test isolation, production access, or destructive command behavior must be resolved before running the command.

## Require Specific Approval

Unless already explicitly approved for this task:

- Staging, committing, creating or switching branches, pushing, publishing, or deploying.
- Destructive actions such as deleting or moving existing user-visible files, overwriting unrelated work, dropping data, or removing containers or volumes.
- Changes outside the accepted scope or new design decisions under `/agentic-change-governance`.
- Creating persistent environments or changing shared/external systems.
- Scratch, planning, notes, or convenience artifacts not needed for the deliverable. Keep these in the conversation by default.

Approval for one action does not imply another: implementation does not imply commit, and creating a container does not imply permission to remove it. Existing harness restrictions and explicit user prohibitions still apply.

## Approval Check

Identify the action, its affected resources, and the request or plan that authorizes it. Ask only for the missing decision when it falls outside that authority; do not re-ask for an action already specifically approved. If scope or impact is uncertain, clarify before acting.

## Completion Criterion

Every side effect is either necessary within accepted implementation scope and covered above, or specifically approved before execution. No unrelated work, protected resource, or external system was changed under an inferred blanket approval.
