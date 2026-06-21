---
name: property-based-testing
description: Use when generated inputs can search for unknown counterexamples to a stated behavioral property, law, invariant, round trip, model comparison, or state transition rule. Common fits include parsers, serializers, validators, calculations, permissions, state machines, migrations, normalization, ordering, grouping, and deduplication, but do not use merely because code belongs to one of these domains.
---

# Property-Based Testing

Use generated inputs to search for unknown counterexamples to behavior that should hold across many inputs.

Example-based tests confirm known scenarios. Property-based tests search for unknown failures of a stated property.

## Guard Condition

Before recommending or writing a property-based test, state:

1. The property that should hold.
2. The generated input or action space.
3. The unknown counterexample class this test may expose.
4. The oracle: how the test knows the behavior is wrong.

If any item is missing, use example-based tests instead.

Do not invoke this skill merely because the code involves permissions, state machines, parsers, serializers, migrations, or another broad-input domain. Those domains are common fits only when a concrete property can be named:

```
WRONG: This touches permissions, so use property-based testing.
RIGHT: For all resources and actions, a narrower role must not allow more than a broader role.
```

## Design the Property

A property must describe externally observable behavior or a domain invariant.

Good property shapes: round trip, idempotence, commutativity, conservation, monotonicity, subset or permission law, oracle comparison, state invariant, model comparison.

Bad properties mirror the implementation, assert private calls, or only restate the code's control flow.

See [oracles.md](oracles.md) for oracle types, generator guidance, and counterexample practices. See [examples.md](examples.md) for good and bad property examples.

## Implement Through Public Behavior

Property-based tests should exercise the same public interface an example test would use. Name the property in the test name or assertion message. Build generators from domain concepts, not raw random blobs. Assert with the chosen oracle. Configure deterministic replay if the framework requires it.

Do not assert private calls, internal branches, or incidental implementation structure.

## Combine With Example Tests

Property-based tests do not replace example tests.

Use example tests for canonical business cases, boundary examples, regression cases from real bugs, and error messages and user-facing output. Use property-based tests for broad behavioral laws where hand-picked examples are too narrow.

## Completion Criterion

The skill is complete only when the test design states the property, generated input or action space, unknown counterexample class, and oracle; generators produce meaningful valid or intentionally invalid inputs; failures produce actionable counterexamples reproducible via deterministic seed or persisted counterexample; and example tests still cover canonical cases, regressions, exact messages, and user-facing details.
