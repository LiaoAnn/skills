---
name: tdd
description: Test-driven development via red-green-refactor. Use when the user wants to build a feature or fix a bug test-first, mentions "TDD" or "red-green-refactor", or wants behavior verified through tests as code is written.
---

# Test-Driven Development

Drive implementation one test at a time. Each test states a behavior; the code exists only to satisfy it.

## Anti-Pattern: Horizontal Slices

**Do not write all tests first, then all implementation.** Tests written in bulk verify *imagined* behavior — they test the shape of things, pass when behavior breaks, and lock in structure before you understand the implementation.

Work in vertical slices instead: one test, one implementation, repeat. Each test responds to what the last cycle taught you.

```
WRONG (horizontal):          RIGHT (vertical):
  RED:   test1, test2, test3   RED→GREEN: test1→impl1
  GREEN: impl1, impl2, impl3   RED→GREEN: test2→impl2
```

## Red-Green Cycle

1. **Before the cycle** — confirm the public interface and which behaviors matter most with the user. Understand the domain's vocabulary and existing test patterns first so test names match the codebase. You can't test everything; focus on critical paths and complex logic.
2. **Tracer bullet** — write ONE test for the first behavior (RED), then minimal code to pass (GREEN). Proves the path works end-to-end.
3. **Incremental loop** — for each remaining behavior: name the regression the test would catch (see [Is This Test Worth Writing](#is-this-test-worth-writing)), then write it (RED) → minimal code (GREEN). One test at a time; don't anticipate future tests.
4. **Refactor** — only while GREEN. See [refactoring.md](refactoring.md). Never refactor while RED.

## Is This Test Worth Writing

Before writing any test, state in one sentence the concrete regression it catches: *"If someone changes X to be wrong, this test goes red."* If you cannot name a plausible wrong implementation that the test would catch, do not write the test.

A test's value is its **discriminating power** — its ability to tell a correct implementation apart from a plausible buggy one (the mutation-testing intuition: a good test kills a mutant). Two kinds of test have no value and should be skipped:

- **Cannot fail** — the test restates a declaration rather than exercising a decision. Asserting a schema has a `name: string` field, that a type annotation holds, or that a constant equals its literal are tautologies: no realistic bug flips them red, because changing the declaration changes the test in lockstep. Testing a framework's own guarantees falls here too.
- **Fails on refactor** — the test goes red when behavior has not changed (asserts on internal calls, structure, or private state). Negative value: it manufactures noise until someone deletes or ignores it.

Test where the code makes a **decision or transformation**, not where it declares a shape. For an Effect Schema or other contract: don't test that the schema exists or lists its fields — test the *behavior at its boundary* (`decode` rejects bad input, a refinement's edge, a transform round-trips). If the schema is a plain passthrough with no logic, the only way to break it is to change the declaration, so there is nothing worth testing.

Long-term, a test is insurance against a *future change*. Its value ≈ how likely someone breaks this behavior × how bad the breakage is × whether this test catches it. Any factor at zero → the test is worthless. A passthrough schema field scores zero on the last factor (the only breakage is a declaration edit, which edits the test too); a `decode` guard scores high (future field/refinement changes plausibly break it and the test catches them).

## Test Quality

Tests verify behavior through public interfaces, not implementation details. A good test survives an internal refactor; a bad one breaks when behavior hasn't changed. See [tests.md](tests.md) for good/bad examples and [mocking.md](mocking.md) for where to mock.

When behavior is better described by an invariant, law, round trip, broad input-space guarantee, parser/serializer property, migration transform, state-machine rule, or permission rule, use `/property-based-testing` for the test design and keep the red-green-refactor cycle here.

## Per-Cycle Checklist

```
[ ] Named the regression this test catches; a plausible bug flips it red
[ ] Test exercises a decision/transformation, not a declaration
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Completion Criterion

Every targeted behavior has a passing test that exercises it through the public interface, each was written before the code that satisfies it, and the suite is GREEN. If behaviors remain untested or any test asserts on internal structure, the cycle is not complete.
