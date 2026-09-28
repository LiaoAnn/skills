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

### 3. Choose the Lenses

Review through separate lenses, each owned by one reviewer. Read [lenses.md](lenses.md) for each lens's question, inputs, exclusions, and required evidence.

- **A single slice:** Correctness and Test Quality.
- **A high-risk slice** (public contract, persisted data, shared module, production path) **or a finished feature:** add Design Fit and Simplicity. For a finished feature, run Design Fit over the whole branch, since slices that each fit can drift together.
- **Security** whenever the diff touches authentication, authorization, untrusted input, or secrets.

The user or plan may name a different set; follow it.

### 4. Run Reviewers in Fresh Context

Spawn one subagent per lens, in parallel, so no reviewer is anchored by the implementer's reasoning or by another lens. Each brief contains the diff scope, the plan or request, the lens definition from [lenses.md](lenses.md), and the rating rules below. Ask for findings, not reassurance:

```text
Review this change through the <lens> lens only. Report findings inside that lens, each with file and line, the concrete trigger, and the evidence the lens requires. Mark anything you could not back with that evidence as unconfirmed. Rate each finding with the supplied "Rate Blocker or Hardening" rules. Do not summarize the change.
```

When TDD was required, the Test Quality reviewer also checks available RED-before-implementation evidence and reports missing evidence as unknown rather than inferring it from the final diff.

If subagents are unavailable, run the lenses one at a time, rereading the diff from scratch for each.

### 5. Confirm Before Reporting

Merge duplicate findings across lenses. Then confirm every candidate Blocker yourself with `/verification-evidence`: rerun its reproduction where possible, otherwise retrace its path line by line. A finding that does not survive confirmation is not reported; count it in one line ("N unconfirmed findings omitted") so the user can ask for them.

If validation or CI is failing, distinguish failures caused by the diff from ambient or infrastructure failures.

### 6. Rate Blocker or Hardening

Two levels only: **Blocker** (fix before merge) and **Hardening** (recorded under Residual Risk, no fix demanded). A Hardening item also needs a concrete trigger — who does what, under which real condition. "Could theoretically race" or "if someone later…" is not a trigger; drop the item.

State the trigger in one sentence, using only actions the product supports. A defect that occurs every time the path runs is a Blocker without further reachability analysis, subject to the impact gate below; a path nothing reaches is not a path. The rest of this section applies only where the trigger depends on ordering, coincidence, or a particular input.

For those, a Blocker's trigger arises without anyone arranging it — and you must name the evidence for that claim: the traffic pattern, deploy model, or operation you are relying on, and where in the repo, config, or docs you found it. Naming a generically supported operation is not evidence; nearly every product deploys, restarts, retries, and evicts caches. An assumed deployment fact makes it Hardening, with the unresolved question under Open Questions.

Impact gates both ends. A trigger that arises on its own but whose worst outcome is cosmetic or recoverable is Hardening. An arranged trigger that crosses a privilege boundary or loses data unrecoverably is a Blocker.

Where the repo, config, or docs place an untrusted party inside the threat model — an exposed route, an auth boundary, a documented tenancy split — that party is a normal actor: crafted input is their normal operation, and the only question is whether they can reach the path with privileges they can actually obtain. If nothing establishes that exposure, rate it Hardening, with the question under Open Questions.

Testability is not the filter. A determined reviewer can mock almost any scenario into a failing test, including ones nobody will ever hit.

Rate each finding independently against reachability, impact, and evidence. All findings may legitimately have the same rating; never promote or downgrade one to force a distribution.

### 7. Report Findings First

Findings holds Blockers only; Hardening goes under Residual Risk. Each Blocker should include:

- File and line, when available.
- The issue.
- The concrete trigger — who does what to hit it.
- Suggested fix or verification.

If there are no blockers, say the change passes and list only triggered Hardening items under Residual Risk. Do not manufacture a blocker to justify the review.

## Output

Use this structure:

```markdown
## Findings

## Open Questions

## Residual Risk (triggered Hardening only; end with the omitted-unconfirmed count)

## Validation Notes
```

Skip empty sections except when "no blockers" is the main result.

## Completion Criterion

The review is complete when every selected lens has reported, every reported Blocker was confirmed by rerunning or retracing it and carries its concrete trigger and lens evidence, every Hardening item names a concrete trigger, and unconfirmed findings appear only as an omitted count.

No blockers means the change passes. Stop there rather than opening another pass over code the review already covered.
