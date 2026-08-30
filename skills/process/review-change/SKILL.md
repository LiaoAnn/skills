---
name: review-change
description: Review a completed or in-progress code change from a fresh reviewer perspective. Use when the user asks for code review, wants a diff checked before finishing, or wants subagents to inspect correctness, regressions, tests, and maintainability.
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

The reviewer brief should ask for findings, not reassurance:

```text
Review this change for bugs, behavioral regressions, missing tests, violated project conventions, and maintainability risks. Prioritize concrete findings with file and line references. Do not summarize unless there are findings or notable residual risks.

Rate each finding Blocker or Hardening. A defect that occurs every time the path runs is a Blocker. Otherwise a Blocker's trigger must arise without anyone arranging it, and you must name the evidence for that — the traffic pattern, deploy model, or exposure you are relying on, and where you found it. When you cannot tell from the repo, rate it Hardening and say why.

A defect whose worst outcome is cosmetic or easily reversed is Hardening even when it always happens. Where the repo places an untrusted party inside the threat model, that party is a normal actor and crafted input is their normal operation. If everything you found is a Blocker, re-rate them against each other.
```

If subagents are unavailable, simulate the same stance: reread the diff from scratch before judging it.

### 4. Review for Real Risks

Prioritize:

- Incorrect behavior or missed requirements.
- Regressions in nearby flows.
- Missing or weak tests — judge test quality by `/tdd`. When the plan, brief, or diff indicates TDD was used, audit behavioral coverage per `/tdd` for each behavior the diff introduces or changes, and list uncovered ones explicitly; a gap is a Blocker only when the behavior would be a Blocker if broken, otherwise Hardening. Absence of gaps is a passing result.
- Broken error handling or edge cases.
- Validation gaps.

Load only the principle needed for the risk the diff actually shows:

- Use `/architecture` when files move, imports cross module boundaries, transport code grows, or authorization placement changes.
- Use `/agentic-change-governance` when the diff includes unplanned design, ownership, convention, contract, cleanup, or rule changes.
- Use `/codebase-stewardship` when the diff introduces new vocabulary, new patterns, duplicate helpers, parallel systems, or unusual file placement.
- Use `/contracts` when public APIs, schemas, events, jobs, module exports, config, CLI behavior, URLs, or persisted data shapes change.
- Use `/reviewable-change` when the diff mixes behavior with refactors, renames, formatting, generated output, or unrelated edits.
- Use `/engineering-quality` when readability, comments, error context, local refactors, or algorithmic shape are the main risk.
- Use `/agent-instruction-files` when the diff adds to or edits `AGENTS.md`, `CLAUDE.md`, or another agent instruction file.
- Use `/property-based-testing` when the behavior is better described by invariants, laws, round trips, state-machine rules, permission rules, or broad generated input spaces.

Avoid style commentary that tooling will catch. If validation or CI is failing, distinguish failures caused by the diff from ambient or infrastructure failures; use `/ci-triage` when that classification needs its own pass.

### 5. Rate Blocker or Hardening

Two levels only: **Blocker** (fix before merge) and **Hardening** (recorded under Residual Risk, no fix demanded).

State the trigger in one sentence, using only actions the product supports. A defect that occurs every time the path runs is a Blocker without further reachability analysis, subject to the impact gate below; a path nothing reaches is not a path. The rest of this section applies only where the trigger depends on ordering, coincidence, or a particular input.

For those, a Blocker's trigger arises without anyone arranging it — and you must name the evidence for that claim: the traffic pattern, deploy model, or operation you are relying on, and where in the repo, config, or docs you found it. Naming a generically supported operation is not evidence; nearly every product deploys, restarts, retries, and evicts caches. An assumed deployment fact makes it Hardening, with the unresolved question under Open Questions.

Impact gates both ends. A trigger that arises on its own but whose worst outcome is cosmetic or recoverable is Hardening. An arranged trigger that crosses a privilege boundary or loses data unrecoverably is a Blocker.

Where the repo, config, or docs place an untrusted party inside the threat model — an exposed route, an auth boundary, a documented tenancy split — that party is a normal actor: crafted input is their normal operation, and the only question is whether they can reach the path with privileges they can actually obtain. If nothing establishes that exposure, rate it Hardening, with the question under Open Questions.

Testability is not the filter. A determined reviewer can mock almost any scenario into a failing test, including ones nobody will ever hit.

If every finding is a Blocker, the rating carries no information. Re-rate them against each other.

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
