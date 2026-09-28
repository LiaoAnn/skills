---
name: tdd
description: Use when the user or accepted plan requires test-first implementation with red-green-refactor.
---

# Test-Driven Development

Drive implementation through one behavioral test at a time. For test necessity or quality without a test-first workflow, read [test-judgment.md](test-judgment.md) instead.

## Preconditions

Use the public interface and target behaviors from the request or accepted plan. Ask only when a missing decision blocks a meaningful test; do not reconfirm settled choices.

Before each new test, use the [test-necessity gate](test-judgment.md#is-this-test-worth-writing) to name the regression it catches and check for duplicate coverage. If it rejects a test, complete that slice without manufacturing RED and report the exemption. A file category alone never grants an exemption.

## Red-Green-Refactor

1. Write one focused test for an observable behavior. Start outside-in: the first test sits at the level where the behavior is observed — an integration, CLI, or end-to-end test when the environment can reach it — and narrower tests follow only as the implementation needs them. Run it and confirm RED for the expected reason, not an unrelated compile or setup failure.
2. Write the minimal production change that makes it GREEN, then run the test.
3. Refactor while GREEN, rerunning affected tests. Repeat for the next behavior until the accepted target is covered.

When the tests come from a separate test author, the implementer takes them as given: it does not edit or weaken them, and a test it believes is wrong goes back to the author or the user with the reason.

Do not write all tests first and then all implementation. Vertical slices keep each test grounded in what the previous cycle revealed rather than an imagined implementation.

Reading and baseline checks may precede RED. Behavior-changing production edits may not. Do not pause for user approval between cycles unless a new scope, design, or safety decision arises.

## Read Only What the Slice Needs

- [tests.md](tests.md): concrete examples when test quality is uncertain.
- [mocking.md](mocking.md): choosing which boundaries to isolate.
- [refactoring.md](refactoring.md): refactoring a passing implementation.
- [verification-placement.md](verification-placement.md): whether a typechecker, generator, compatibility check, or test owns a concern.

## Completion Criterion

Every targeted behavior has a passing test through a public interface, each test ran RED for the expected reason before its production implementation, and affected tests are GREEN. Report blocked validation or remaining uncovered behavior rather than claiming completion. Exempted slices are recorded with the mechanism owning the concern, or an explicit absence of one, per [test judgment](test-judgment.md).
