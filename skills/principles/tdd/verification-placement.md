# Where Verification Belongs

A concern being real does not make it a test case. Before writing a test for something you are worried about, ask: **is there already something that fails on this — a mechanism outside the suite, or a behavior test you are already writing?** If yes, route the concern there. If no, a test is likely the right answer — the point is never that fewer tests are better, only that duplicating an existing check is worse than owning it in one place.

## Answering the question

Mechanisms that commonly already own a concern:

- **Type checker** — that a declared shape and its call sites agree. Not that a *value* matches its declared type: values crossing an I/O boundary (database rows, network JSON, env) and unchecked casts (`as`, `.$type<T>()`) are runtime concerns and may well need a test. In an untyped codebase this mechanism does not exist at all.
- **Generator diff in CI** — that a definition and its generated output have not drifted: run the generator, fail on a non-empty diff. Know the scope of the one you have; a generator that diffs against a stored snapshot will not notice a hand-edited output file.
- **Breaking-change differ** — that a new contract version is compatible with the old one (`buf breaking`, GraphQL and OpenAPI diffs, schema-registry compatibility levels). Where no differ exists — CLI flags, an API without a spec — decoding a committed old-version fixture with current code *is* the test, and a real one.
Not on this list: human review. Committing a generated artifact (an SDL file, an OpenAPI document) makes a change *visible* in a diff, which is worth doing — but review does not fail on anything, so never route a concern to it as a substitute for a test or a check.
- **The dependency's own test suite** — that an engine or framework honors its documented guarantees. Narrow: a guarantee gated on project configuration is not the dependency's problem. A per-connection pragma, or a driver that silently lacks a capability, is yours and worth verifying once.

## When the answer is a test

Two cases come up constantly and are worth naming, because an agent applying the routing question too eagerly talks itself out of both:

- **A migration's effect on real data.** That migrations apply to a clean database is the harness's job. That a backfill transforms rows correctly, or that a destructive change survives populated production-shaped data, is a transformation with edge cases — seed it, run it, assert.
- **Application behavior that depends on any guarantee above.** Assert the caller's observable result, not the underlying guarantee. Not *"the unique index rejects duplicates"* but *"registering an existing email updates the profile instead of duplicating it"*. That test survives a switch to a different enforcement mechanism, which is the sign it was testing behavior all along.

## Scope

These are worked examples of the one question, not a lookup table. If your concern is not here, or the named mechanism does not exist in this project, do not force a match — ask the question directly.

The framing assumes application code, where declarations support the deliverable. Where the declarations *are* the deliverable — Terraform, Kubernetes manifests, policy bundles — it inverts: `plan` assertions and policy tests are the primary suite, and nothing here argues against them.

Importance is not the criterion. A foreign key protecting billing data is important, and the test that earns its keep is the one on invoice creation, not a separate orphan-insert assertion the first already fails without. Importance argues for getting the declaration right and for covering the caller — not for a second test at the declaration level.

One exception worth knowing, because nothing else catches it: where the guarantee is gated on per-connection configuration — SQLite's `PRAGMA foreign_keys` defaults off on several drivers — the constraint can be silently unenforced while the schema, the migration, the type checker and the drift check all agree. Verify that once, directly.
