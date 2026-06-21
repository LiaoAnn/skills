---
name: persistent-side-effects
description: Persistent side-effect approval contract. Use before creating files or directories, staging or committing changes, creating or switching branches, deleting/moving/overwriting user-visible files, or writing scratch/planning artifacts.
---

# Persistent Side Effects

Require explicit user approval for persistent side effects unless the accepted plan already names that exact artifact or action.

## Persistent Side Effects

- Creating files or directories.
- Staging changes.
- Committing.
- Creating or switching branches.
- Deleting, moving, or overwriting user-visible files.
- Writing scratch, planning, notes, or convenience artifacts.

## Approval Check

Before taking a persistent side effect, confirm:

1. What will be created or changed.
2. Why it is required for the accepted task.
3. Where the user approved it.

If approval is absent, ask first.

## Completion Criterion

The work respects this contract when every persistent side effect is either named in the accepted plan, required by the tested behavior, or explicitly approved by the user before it happens.
