# Test Judgment

Use this document for test necessity and coverage decisions during planning, implementation, or review, whether or not the work uses TDD. Use [SKILL.md](SKILL.md) only for the red-green-refactor workflow.

## Is This Test Worth Writing?

Name the concrete regression: **"If someone changes X to be wrong, this test goes red."** If no plausible wrong implementation can be named, do not invent a test to satisfy a workflow.

A useful test distinguishes correct behavior from a plausible bug and survives an internal refactor. Prefer the public interface where the caller observes the result, not private calls, internal structure, or a declaration's syntax.

Distinguish:

- **Restating a declaration.** An assertion copied from the same column list, field definition, or constant supplies no independent expectation. It changes in lockstep and adds no meaningful coverage.
- **Evaluating against data.** A decoder rejects invalid input, a `CHECK` refuses a row, a timestamp updates on write, or an old payload remains compatible. These can catch real regressions even when implemented declaratively.

Do not exempt a file category by name. A schema, migration, type, or configuration change may affect observable behavior. Conversely, a workflow obligation to write RED does not create behavior where none exists.

## Check for Existing Coverage

Omit a new test when an existing mechanism or caller-level test already catches the same plausible failures. Name that evidence rather than assuming coverage from importance, filenames, or the mere presence of CI.

For example, a caller-level test that registering an existing email updates the profile can already catch removal of the unique index supporting its upsert. A separate duplicate-insert assertion may add nothing. A schema-generator drift check does not establish runtime enforcement of that index.

Direct tests of a constraint, policy, or ORM-maintained timestamp remain useful when no caller-level test reaches the rule. Project configuration that enables enforcement also needs coverage; the dependency's tests do not prove the application's configuration is correct.

For type checkers, generator diffs, compatibility checks, migrations, and configuration-specific cases, read [verification-placement.md](verification-placement.md). For concrete test-quality examples, read [tests.md](tests.md); read [mocking.md](mocking.md) when choosing isolation boundaries.

## Off-ramp and Evidence

If a slice adds no independently testable behavior, or the same concern is already covered, implement it without manufacturing a test. Report the slice and which existing test or mechanism owns the concern—or explicitly that none does. No mechanism is an honest gap to evaluate, not an automatic excuse to omit a behavioral test.

Difficulty testing is not an exemption: find a suitable interface, integration path, or report a validation blocker for real behavior that remains unverified.

For a review, list changed behaviors that lack coverage. Rate the risk of missing coverage by the behavior's impact, not by whether test-first was used. For explicit TDD work, additionally verify that behavior tests ran RED before their production implementation.
