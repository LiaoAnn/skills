# Oracles, Generators, and Counterexamples

## Choose the Oracle

Every property needs a way to decide that behavior is wrong.

Useful oracles include:

- A round trip: `decode(encode(x)) == x`.
- A metamorphic relation: transforming the input in a domain-preserving way preserves or predictably changes the output.
- A simple reference implementation that is slower but easier to trust.
- A domain lattice, such as role hierarchy or subset rules.
- A simplified model for stateful systems.
- A required invariant checked after each generated operation.

Avoid comparing the system to a copy of itself. That only proves two implementations share the same assumptions.

## Bound the Input Space

Generated data must be valid for the property being tested.

Define:

- Valid domain ranges.
- Required relationships between fields.
- Edge cases that should be generated often.
- Invalid inputs when testing rejection behavior.
- Shrinking behavior if the framework supports it.

Avoid generators so broad that most generated cases are meaningless, discarded, or impossible in production.

Prefer generating valid data directly over filtering out most values. Filtering is acceptable for small constraints, but heavy discarding means the generator does not describe the domain well enough.

## Keep Counterexamples Actionable

When a property fails, the failure should tell the maintainer what behavior was violated.

Prefer:

- Small generators with named domain concepts.
- Deterministic seeds in CI output.
- Assertions that name the invariant.
- Minimal fixtures only after the property exposes a real example.

Add the minimized counterexample as a focused regression test when it documents an important bug.
