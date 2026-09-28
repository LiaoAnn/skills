---
name: review-change
description: Use when reviewing a diff for defects, regressions, coverage gaps, and residual risks.
---

# Review Change

Review the diff as a separate reviewer, not as the implementer defending the work.

## Process

### 1. Pin the Review Scope

Identify the fixed point or diff to review:

- A branch, commit, tag, or merge base supplied by the user.
- The current working tree, if no fixed point is supplied.
- A patch file or pasted diff.

If the scope is ambiguous, ask for the fixed point before reviewing.

### 2. Gather Review Inputs

Collect only the context a reviewer needs:

- The diff.
- The task brief, plan, issue, PRD, or user request if available.
- Relevant tests and validation output.
- Project standards or nearby patterns when they matter.

Do not rely on the implementer's reasoning as proof. Verify against the diff and source.

### 3. Use Fresh Context When Possible

Prefer a subagent or fresh context for the review, especially after substantial implementation work.

The reviewer brief should ask for findings, not reassurance. Include the rating section below or a resolved, readable reference to it in the handoff:

```text
Review this change for bugs, behavioral regressions, missing tests, violated project conventions, and maintainability risks. Prioritize concrete findings with file and line references. Do not summarize unless there are findings or notable residual risks.

Use the supplied "Rate Blocker or Hardening" rules. Rate each finding independently, with a concrete trigger and evidence; do not force a mixture of severity levels.
```

If subagents are unavailable, simulate the same stance: reread the diff from scratch before judging it.

### 4. Review for Real Risks

Prioritize:

- Incorrect behavior or missed requirements.
- Regressions in nearby flows.
- Missing or weak tests — use [test judgment](../../principles/tdd/test-judgment.md), without loading the TDD workflow just for review. Audit changed behaviors and list uncovered ones; a gap is a Blocker only when the behavior would be a Blocker if broken, otherwise Hardening. When TDD was required, also check available RED-before-implementation evidence; report missing evidence as unknown rather than inferring it from the final diff.
- Broken error handling or edge cases.
- Validation gaps.

Avoid style commentary that tooling will catch. If validation or CI is failing, distinguish failures caused by the diff from ambient or infrastructure failures.

### 5. Rate Blocker or Hardening

Two levels only: **Blocker** (fix before merge) and **Hardening** (recorded under Residual Risk, no fix demanded).

State the trigger in one sentence, using only actions the product supports. A defect that occurs every time the path runs is a Blocker without further reachability analysis, subject to the impact gate below; a path nothing reaches is not a path. The rest of this section applies only where the trigger depends on ordering, coincidence, or a particular input.

For those, a Blocker's trigger arises without anyone arranging it — and you must name the evidence for that claim: the traffic pattern, deploy model, or operation you are relying on, and where in the repo, config, or docs you found it. Naming a generically supported operation is not evidence; nearly every product deploys, restarts, retries, and evicts caches. An assumed deployment fact makes it Hardening, with the unresolved question under Open Questions.

Impact gates both ends. A trigger that arises on its own but whose worst outcome is cosmetic or recoverable is Hardening. An arranged trigger that crosses a privilege boundary or loses data unrecoverably is a Blocker.

Where the repo, config, or docs place an untrusted party inside the threat model — an exposed route, an auth boundary, a documented tenancy split — that party is a normal actor: crafted input is their normal operation, and the only question is whether they can reach the path with privileges they can actually obtain. If nothing establishes that exposure, rate it Hardening, with the question under Open Questions.

Testability is not the filter. A determined reviewer can mock almost any scenario into a failing test, including ones nobody will ever hit.

Rate each finding independently against reachability, impact, and evidence. All findings may legitimately have the same rating; never promote or downgrade one to force a distribution.

### 6. Report Findings First

Findings holds Blockers only; Hardening goes under Residual Risk. Each Blocker should include:

- File and line, when available.
- The issue.
- The concrete trigger — who does what to hit it.
- Suggested fix or verification.

If there are no blockers, say the change passes and put the rest under Residual Risk. Do not manufacture a blocker to justify the review.

## Output

Use this structure:

```markdown
## Findings

## Open Questions

## Residual Risk (includes Hardening)

## Validation Notes
```

Skip empty sections except when "no blockers" is the main result.

## Completion Criterion

The review is complete when the diff has been checked against the intended behavior, relevant project patterns, and validation evidence, and every blocker has been reported with its concrete trigger, separately from Hardening items in Residual Risk.

No blockers means the change passes. Stop there rather than opening another pass over code the review already covered.
