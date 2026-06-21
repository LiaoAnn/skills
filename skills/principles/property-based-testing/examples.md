# Good and Bad Property Examples

## Good: Serializer Round Trip

Property: for every valid domain object, decoding its encoded form returns the original value.

Input space: valid objects with generated optional fields, boundary numbers, special strings, and nested collections.

Oracle: `decode(encode(value)) == value`.

Unknown counterexamples: missing optional fields, escaping bugs, lossy numeric conversion, or order-dependent decoding.

## Good: Permission Subset Law

Property: for every resource and action, a narrower role cannot allow more than a broader role.

Input space: generated role pairs where `narrower <= broader`, generated resources, and generated actions.

Oracle: allowed actions for the narrower role are a subset of allowed actions for the broader role.

Unknown counterexamples: default grants, fallback rules, or special resource cases that accidentally widen access.

## Good: Stateful Model Comparison

Property: after any generated valid command sequence, the real system agrees with a simpler model and preserves state invariants.

Input space: generated commands with preconditions, such as create, update, delete, transition, undo, or refresh.

Oracle: compare the real state to the model after each command, and assert invariants after each transition.

Unknown counterexamples: invalid mutation after rejected transitions, ordering bugs, stale cache behavior, or missing cleanup.

## Bad: Exact Error Copy

Testing that an empty email field shows `Email is required` is example-based. It checks a known user-facing output, not a broad property.

## Bad: One Known Regression

Testing that input `foo` returns `bar` is example-based unless the case generalizes into a property that can search for unknown failures.
