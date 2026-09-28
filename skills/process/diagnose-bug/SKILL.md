---
name: diagnose-bug
description: Use when a product or performance bug needs reproduction and root-cause diagnosis.
---

# Diagnose Bug

Do not jump from symptom to fix. First make the bug observable.

## Process

### 1. Restate the Symptom

Capture the user's report in concrete terms:

- What happened.
- What was expected.
- Where it happened.
- Inputs, environment, timing, or recent changes if known.

Separate observed facts from guesses.

### 2. Build a Feedback Loop

Find the fastest reliable way to reproduce or detect the bug.

Choose the cheapest reliable signal for this symptom; these are options, not a required sequence. Creating a test or throwaway harness is a file change; make it only when the request authorizes edits, even during diagnosis:

1. Existing failing test or focused new regression test.
2. Minimal command, script, or CLI invocation.
3. HTTP request, UI interaction, or browser automation.
4. Fixture replay from real input, logs, traces, payloads, or snapshots.
5. Throwaway harness around the relevant module.
6. Property or fuzz loop when the symptom is "sometimes wrong output".
7. Manual reproduction steps when automation is not yet possible.

The loop should detect the user's exact symptom, not merely exercise nearby code.

### 3. Reproduce and Minimize

Run the loop and confirm the symptom. Then reduce the scenario until the remaining inputs, config, and steps are all load-bearing.

If the bug cannot be reproduced, state what was tried and what artifact or access is needed next.

### 4. Trace the Code Path

Follow the behavior through the relevant entry points, state changes, IO, and error paths.

Look for:

- Incorrect assumptions.
- Missing validation.
- Bad ordering.
- State that can become impossible or inconsistent.
- Integration mismatches.
- Race, caching, environment, or data-shape issues.

### 5. Form Hypotheses

Generate a short ranked list of plausible causes. Each hypothesis must make a falsifiable prediction.

Format:

```text
If <cause> is true, then <probe or change> should show <result>.
```

Test the strongest hypothesis first. Change one variable at a time.

### 6. Define the Fix Strategy

Once the cause is clear, produce:

- Root cause.
- Fix direction.
- Regression test or validation path.
- Contract, governance, or stewardship risk if the fix would change public behavior, system shape, ownership boundaries, or established patterns.
- Risks.
- Acceptance criteria.

If a fix was requested and the cause, scope, and validation are clear, continue with a brief plan and `/implement-plan`. Use `/plan-it` when material decisions remain; do not add a new approval round for already-authorized work.

## Completion Criterion

Diagnosis is complete when there is:

- A reproduced or well-bounded symptom.
- A traced code path.
- A credible root cause or a clear blocker.
- A validation path that can prove the fix.

A diagnosis-only request ends here. If the original request included fixing the bug, continue within that authority; ask only for a new design, scope, or safety decision.
