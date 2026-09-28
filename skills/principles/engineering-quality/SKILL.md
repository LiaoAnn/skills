---
name: engineering-quality
description: Use when a change needs judgment about readability, error context, or avoidable algorithmic complexity.
---

# Engineering Quality

Prefer code that is boring to read, easy to debug, and hard to misuse.

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

## Keep Local Refactors Within Authority

Make small in-path refactors when they are needed for correctness or to make the changed path understandable. Follow `/agentic-change-governance` for the distinction between necessary local support and opportunistic improvement; proximity alone is not authorization.

Defer optional cleanup, scope expansion, and work outside the changed behavior unless explicitly requested.

## Watch Algorithmic Shape

Code that is fine for ten items may collapse at production scale. Treat nested loops, repeated queries, repeated parsing, and broad data fetches as design decisions.

Prefer maps, sets, indexing, batching, or precomputation when repeated lookup or matching is the real operation.

## Completion Criterion

The code is clear enough to review without decoding tricks, comments explain only non-obvious context, errors carry useful and safe context, necessary in-path refactors stay within accepted scope, and the algorithmic shape is reasonable for expected scale.
