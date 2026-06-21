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
```

If subagents are unavailable, simulate the same stance: reread the diff from scratch before judging it.

### 4. Review for Real Risks

Prioritize:

- Incorrect behavior or missed requirements.
- Regressions in nearby flows.
- Missing or weak tests — judge test quality by `/tdd` (behavior through public interfaces, survives refactors).
- Broken error handling or edge cases.
- Validation gaps.

Load only the principle needed for the risk the diff actually shows:

- Use `/architecture` when files move, imports cross module boundaries, transport code grows, or authorization placement changes.
- Use `/agentic-change-governance` when the diff includes unplanned design, ownership, convention, contract, cleanup, or rule changes.
- Use `/codebase-stewardship` when the diff introduces new vocabulary, new patterns, duplicate helpers, parallel systems, or unusual file placement.
- Use `/contracts` when public APIs, schemas, events, jobs, module exports, config, CLI behavior, URLs, or persisted data shapes change.
- Use `/reviewable-change` when the diff mixes behavior with refactors, renames, formatting, generated output, or unrelated edits.
- Use `/engineering-quality` when readability, comments, error context, local refactors, or algorithmic shape are the main risk.
- Use `/property-based-testing` when the behavior is better described by invariants, laws, round trips, state-machine rules, permission rules, or broad generated input spaces.

Avoid style commentary that tooling will catch. If validation or CI is failing, distinguish failures caused by the diff from ambient or infrastructure failures; use `/ci-triage` when that classification needs its own pass.

### 5. Report Findings First

Order findings by severity. Each finding should include:

- File and line, when available.
- The issue.
- Why it matters.
- Suggested fix or verification.

If there are no findings, say that clearly and mention remaining test gaps or residual risk.

## Output

Use this structure:

```markdown
## Findings

## Open Questions

## Residual Risk

## Validation Notes
```

Skip empty sections except when "no findings" is the main result.

## Completion Criterion

The review is complete when the diff has been checked against the intended behavior, relevant project patterns, and validation evidence, and all material risks have been reported without mixing them into a general summary.
