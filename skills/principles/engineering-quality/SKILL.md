---
name: engineering-quality
description: Maintainable-code principles for clarity, comments, error context, small local refactors, and algorithmic shape. Use when a planning, implementation, or review decision specifically needs judgment about readability, debuggability, scope control, or avoidable complexity.
---

# Engineering Quality

Prefer code that is boring to read, easy to debug, and hard to misuse.

## Choose Clarity Over Cleverness

Optimize first for the next maintainer's understanding. A slightly longer implementation is often better when it exposes names, intermediate values, and control flow.

Before choosing a clever abstraction or dense expression, ask:

- Does this solve the current problem, or a speculative future one?
- Would a direct version be easier to review?
- Is the abstraction hiding real complexity or only moving it?

## Comment Why, Not What

Comments should explain context the code cannot express:

- Non-obvious business decisions.
- Security or privacy constraints.
- Performance tradeoffs.
- Workarounds and the issue they avoid.
- Surprising ordering requirements.

Delete comments that restate the next line of code. Improve names or structure instead.

## Make Failures Debuggable

Errors should identify the failed operation and the important context, without leaking secrets or sensitive data.

Prefer errors that answer:

- What was the system trying to do?
- Which stable identifier or input matters?
- Is this invalid input, missing state, forbidden access, or an external failure?

Keep transport-specific error classes at the transport boundary. Lower-level code should raise domain or application errors that can be translated outward.

## Do Small Local Refactors Now

Do not defer small cleanup that is directly in the path of the change and reduces immediate confusion: naming, obvious duplication, dead branches, or a tiny extraction that makes the behavior clearer.

Do defer cleanup when it meaningfully expands scope, needs separate review, or touches code outside the current behavior path.

## Watch Algorithmic Shape

Code that is fine for ten items may collapse at production scale. Treat nested loops, repeated queries, repeated parsing, and broad data fetches as design decisions.

Prefer maps, sets, indexing, batching, or precomputation when repeated lookup or matching is the real operation.

## Completion Criterion

The code is clear enough to review without decoding tricks, comments explain only non-obvious context, errors carry useful and safe context, small in-path cleanup is handled, and the algorithmic shape is reasonable for expected scale.
