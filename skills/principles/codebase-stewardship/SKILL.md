---
name: codebase-stewardship
description: Codebase-coherence principles for fitting a change into existing patterns. Use when choosing names, file placement, extension points, abstractions, test fixtures, or domain vocabulary so new work does not create parallel systems or drift from local conventions.
---

# Codebase Stewardship

Make the next change fit the codebase that already exists.

## Learn the Local Pattern First

Before adding new behavior, inspect nearby or similar code for:

- Naming style and domain vocabulary.
- File placement and public exports.
- Data flow and state ownership.
- Error handling and validation style.
- Test style and fixture conventions.
- Existing extension points or abstractions.

Prefer the local pattern even when another pattern would be reasonable in isolation.

## Avoid Parallel Systems

Do not create a second way to do the same thing unless the task is explicitly to replace the old one.

Red flags:

- A new helper overlaps an existing helper.
- A new service, hook, adapter, command, or component duplicates an existing responsibility.
- The same concept receives a new name in the new code.
- New config or flags bypass an existing capability.
- New tests need custom setup while nearby tests already have shared fixtures.

When overlap exists, extend or adapt the established surface instead of creating a competing path.

## Keep Domain Concepts Stable

Changing names is changing the system's language. Rename only when the request is a rename or the old name is actively misleading for the current change.

Use existing domain terms for:

- Types and interfaces.
- API fields.
- Events and commands.
- Test names.
- Error names.
- File and directory names.

If a new term is needed, define how it relates to the existing vocabulary.

## Leave a Reviewable Trail

When the change introduces a new pattern or extends an old one, make that decision easy to audit:

- Point to the existing pattern being followed.
- State why the extension belongs there.
- Keep examples and tests aligned with the same vocabulary.
- Avoid mixing stewardship decisions with unrelated cleanup.

## Completion Criterion

The change fits the existing codebase identity: it follows the closest local pattern, avoids duplicate systems, preserves domain vocabulary unless a rename is required, extends established surfaces where possible, and makes any necessary new pattern explicit and reviewable.
