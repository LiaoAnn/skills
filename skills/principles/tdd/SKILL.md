---
name: tdd
description: Test-driven development via red-green-refactor. Use when the user wants to build a feature or fix a bug test-first, mentions "TDD" or "red-green-refactor", wants behavior verified through tests as code is written, or is deciding whether a schema, migration, type, or configuration change is owed a test at all.
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

## When a Slice Has No Behavior

Watch for the pressure running backwards. Under a test-first mandate, a slice with no behavior leaves you owing a RED you cannot honestly write, and the easy resolution is to invent one and justify it afterwards. That is the workflow producing the test, not the behavior producing it. The mandate is not the source of truth; behavior is. [Is This Test Worth Writing](#is-this-test-worth-writing) decides — no category of file is exempt by name, and none is owed a test by name.

**Off-ramp.** When the gate rejects a test, write the code with no test. That is a *completed* step, not a skipped one. Record it in the final report: what the slice covered, and which mechanism owns the concern instead — or that none does, which is itself the finding to report. A reviewer must be able to tell an exempted slice from a forgotten test.

Do not confuse this with code that is merely *hard* to test. If a slice resists testing and does contain a decision, the interface is wrong — fix the interface rather than claiming the off-ramp.

## Red-Green Cycle

1. **Before the cycle** — confirm the public interface and which behaviors matter most with the user. Understand the domain's vocabulary and existing test patterns first so test names match the codebase. You can't test everything; focus on critical paths and complex logic.
2. **Tracer bullet** — if the slice has behavior, write ONE test for the first one (RED), then minimal code to pass (GREEN). Proves the path works end-to-end.
3. **Incremental loop** — for each remaining behavior: name the regression the test would catch (see [Is This Test Worth Writing](#is-this-test-worth-writing)), then write it (RED) → minimal code (GREEN). One test at a time; don't anticipate future tests.
4. **Refactor** — only while GREEN. See [refactoring.md](refactoring.md). Never refactor while RED.

## Is This Test Worth Writing

This is the **test-necessity gate** other skills refer to. Before writing any test, state in one sentence the concrete regression it catches: *"If someone changes X to be wrong, this test goes red."* If you cannot name a plausible wrong implementation that the test would catch, do not write the test.

A test's value is its **discriminating power** — its ability to tell a correct implementation apart from a plausible buggy one (the mutation-testing intuition: a good test kills a mutant). Two kinds of test have no value and should be skipped:

- **Cannot fail** — the test restates a declaration rather than exercising a decision. Asserting a schema has a `name: string` field, that a type annotation holds, or that a constant equals its literal are tautologies: no realistic bug flips them red, because changing the declaration changes the test in lockstep. Testing a framework's own guarantees falls here too.
- **Fails on refactor** — the test goes red when behavior has not changed (asserts on internal calls, structure, or private state). Negative value: it manufactures noise until someone deletes or ignores it.

Test where a declaration can be *exercised*, not where a test would merely restate it — see below for what settles that. For an Effect Schema or other contract: don't test that the schema exists or lists its fields — test the *behavior at its boundary* (`decode` rejects bad input, a refinement's edge, a transform round-trips). If the schema is a plain passthrough with no logic, the only way to break it is to change the declaration, so there is nothing worth testing.

Long-term, a test is insurance against a *future change*. Its value ≈ how likely someone breaks this behavior × how bad the breakage is × whether this test catches it. Any factor at zero → the test is worthless. A passthrough schema field scores zero on the last factor (the only breakage is a declaration edit, which edits the test too); a `decode` guard scores high (future field/refinement changes plausibly break it and the test catches them).

The gate is usually defeated by re-describing a declaration as behavior — *the constraint is a business rule, so it is behavior*. What settles it is not whether the subject is a declaration, but what the test does with it:

- **Restates it** — the assertion mirrors the declaration's own syntax: this schema has a `name` field, the column list matches, the constant equals its literal. A declaration edit rewrites the test in lockstep, so no bug ever survives to be caught. Worthless, always.
- **Evaluates it against data** — the assertion runs the declaration and checks the outcome: `decode` rejects a negative age, a `CHECK` expression refuses the row, `updatedAt` bumps on write. Real discriminating power. Skip this kind only for **duplication**, which comes in two forms: a mechanism outside the suite already fails on the same concern, earlier and closer to the source; **or** a behavior test you are already writing fails on every change this one would catch. In the second case keep the caller-observable test and drop the declaration-level one.

Subsumption is the more common ground, and the easier one to get wrong. Check it by naming the changes that break the rule and asking which tests go red. *"The unique index rejects duplicates"* buys nothing once *"registering an existing email updates the profile"* exists: drop the index and the upsert's conflict clause has nothing to match, so the behavior test fails too. Do not reach for a pipeline check as the ground unless it really covers the same changes — a generator drift check compares a definition to its generated output and nothing else, so it does not own a rule the database is enforcing at runtime.

So a `CHECK` expression, a row-security policy, or an ORM-maintained timestamp is worth testing directly when no caller-level test already exercises it: nothing else evaluates whether the rule is *right*, only that it was applied.

A real concern does not become a test case by being real. Route it first: is something cheaper already failing on this? [verification-placement.md](verification-placement.md) works through the mechanisms that commonly own such concerns, and the two cases where the answer is still a test.

## Test Quality

Tests verify behavior through public interfaces, not implementation details. A good test survives an internal refactor; a bad one breaks when behavior hasn't changed. See [tests.md](tests.md) for good/bad examples and [mocking.md](mocking.md) for where to mock.

When behavior is better described by an invariant, law, round trip, broad input-space guarantee, parser/serializer property, migration transform, state-machine rule, or permission rule, use `/property-based-testing` for the test design and keep the red-green-refactor cycle here.

## Per-Cycle Checklist

```
[ ] Named the regression this test catches; a plausible bug flips it red
[ ] Test evaluates its subject against data; it does not restate a declaration
[ ] Nothing cheaper and earlier already fails on this concern
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Completion Criterion

Every targeted behavior has a passing test that exercises it through the public interface, each was written before the code that satisfies it, and the suite is GREEN. If behaviors remain untested or any test asserts on internal structure, the cycle is not complete.

Work the gate exempted is not a targeted behavior and leaves no test debt, provided the final report names each exempted slice and the mechanism that owns its concern instead.
