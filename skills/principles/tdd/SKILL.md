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
3. **Incremental loop** — for each remaining behavior: write next test (RED) → minimal code (GREEN). One test at a time; don't anticipate future tests.
4. **Refactor** — only while GREEN. See [refactoring.md](refactoring.md). Never refactor while RED.

## Test Quality

Tests verify behavior through public interfaces, not implementation details. A good test survives an internal refactor; a bad one breaks when behavior hasn't changed. See [tests.md](tests.md) for good/bad examples and [mocking.md](mocking.md) for where to mock.

## Per-Cycle Checklist

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Completion Criterion

Every targeted behavior has a passing test that exercises it through the public interface, each was written before the code that satisfies it, and the suite is GREEN. If behaviors remain untested or any test asserts on internal structure, the cycle is not complete.
