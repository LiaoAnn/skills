---
name: property-based-testing
description: Property-based testing principles for behavior-oriented validation with generated inputs, invariants, laws, and round trips. Use when testing parsers, serializers, validators, calculations, permissions, state machines, migrations, normalization, ordering, grouping, deduplication, or other logic with broad input spaces.
---

# Property-Based Testing

Use generated examples to test behavior that should hold across many inputs.

## Choose a Property, Not an Implementation Detail

A property must describe externally observable behavior or a domain invariant.

Good property shapes:

- **Round trip**: decoding an encoded value returns the original valid value.
- **Idempotence**: normalizing an already normalized value changes nothing.
- **Commutativity**: order does not matter when the domain says it should not.
- **Conservation**: totals, counts, or identities are preserved by a transformation.
- **Monotonicity**: increasing an input cannot decrease an output when the domain requires it.
- **Subset or permission law**: a stricter role cannot do more than a broader role.
- **Oracle comparison**: a simple trusted implementation agrees with the optimized implementation.

Bad properties mirror the implementation, assert private calls, or only restate the code's control flow.

## Bound the Input Space

Generated data must be valid for the property being tested.

Define:

- Valid domain ranges.
- Required relationships between fields.
- Edge cases that should be generated often.
- Invalid inputs when testing rejection behavior.
- Shrinking behavior if the framework supports it.

Avoid generators so broad that most generated cases are meaningless, discarded, or impossible in production.

## Keep Counterexamples Actionable

When a property fails, the failure should tell the maintainer what behavior was violated.

Prefer:

- Small generators with named domain concepts.
- Deterministic seeds in CI output.
- Assertions that name the invariant.
- Minimal fixtures only after the property exposes a real example.

Add the minimized counterexample as a focused regression test when it documents an important bug.

## Combine With Example Tests

Property-based tests do not replace example tests.

Use example tests for:

- Canonical business cases.
- Boundary examples that explain the domain.
- Regression cases from real bugs.
- Error messages and user-facing output.

Use property-based tests for broad behavioral laws where hand-picked examples are too narrow.

## Completion Criterion

The property describes observable behavior or a domain invariant, generators produce meaningful valid or intentionally invalid inputs, failures produce actionable counterexamples, deterministic reproduction is available, and example tests still cover canonical cases and user-facing details.
