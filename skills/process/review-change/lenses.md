# Review Lenses

Each lens is one reviewer's whole job. A reviewer reads only its inputs, reports only findings inside its question, and attaches the evidence its lens requires. A finding without that evidence is reported as **unconfirmed**, never as a Blocker.

No lens reports what tooling already enforces (format, lint, types, dead exports) or whether the feature meets the user's expectation — the mechanical checks and functional acceptance own those.

## Correctness

- **Question:** Does the changed behavior do what the plan's outcome and acceptance say, including edge cases and error paths? Does it break any caller?
- **Reads:** the diff, callers of changed symbols, the plan or brief.
- **Not its job:** style, design preference, test quality.
- **Evidence:** a concrete trigger plus a failing test or command that reproduces it; when execution is impossible, a line-by-line trace of the path from entry to wrong result.

## Test Quality

- **Question:** Would the tests fail if the implementation were plausibly wrong? Do they test behavior through public interfaces rather than restate declarations or internals?
- **Reads:** changed and added tests, and the code they exercise. Apply [test judgment](../../principles/tdd/test-judgment.md).
- **Not its job:** whether the implementation itself is correct.
- **Evidence:** a named mutant — the specific wrong change to production code — and why every current test still passes with it. For a worthless test, the declaration it merely restates.

## Design Fit

- **Question:** Does the change follow the existing patterns, module boundaries, and vocabulary, or does it start a parallel system, reach into internals, or change a contract without handling its consumers?
- **Reads:** the diff and the nearest existing code that solves a similar problem.
- **Not its job:** the internals of a single function.
- **Evidence:** the existing pattern or boundary it departs from, cited as `file:line`, and the consumer affected. No citation, no finding.

## Simplicity

- **Question:** Is there code the change does not need — unused abstraction, defensive checks for impossible states, compatibility paths nothing uses, comments that narrate the code, edits unrelated to the slice?
- **Reads:** the diff only.
- **Not its job:** whether behavior is correct.
- **Evidence:** proof it can go — no callers (search result), or the checks still pass without it.

## Security (only when applicable)

Run this lens only when the diff touches authentication, authorization, untrusted input, secrets, or data exposure.

- **Question:** Can a party reach data or actions they should not, or can input they control subvert the code?
- **Reads:** the diff and the request path from entry point to the changed code.
- **Evidence:** who the actor is, what privilege they actually hold, and the operation that triggers the issue.
