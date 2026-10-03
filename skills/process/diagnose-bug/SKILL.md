---
name: diagnose-bug
description: Use when observed behavior or an error contradicts expectations and its cause is not yet verified — including pasted errors or logs, "why does X happen" questions, and a reported fix that did not resolve the symptom.
---

# Diagnose Bug

Do not jump from symptom to fix. First establish what is actually happening, whether it is a defect at all, and why.

## Gates

These four are the point of the skill; the process below exists to pass them.

1. **Reproduce before editing.** No product edit until the symptom has been observed through a repeatable signal. If it cannot be reproduced, say what was tried and what is needed — do not fix by guess.
2. **Hypothesis before change.** Each candidate cause is stated as a falsifiable prediction and tested before any fix is written.
3. **Verify with the same signal.** A fix is confirmed by rerunning the reproduction and seeing the symptom gone. Apply `/verification-evidence`.
4. **Stay on this bug.** Other problems found along the way are reported, not fixed in the same change.

## Process

### 1. Restate the Symptom

Capture the report in concrete terms: what happened, what was expected, where, and the inputs, environment, timing, or recent changes known. Separate observed facts from guesses. A pasted error or log with no request attached is still a report; restate what it shows.

### 2. Classify: Defect, Design, or Environment

Before hunting for a cause, check the expectation itself. The reported behavior may be the system working as built.

- **Design** — the code, docs, configuration, or an earlier accepted plan intend this behavior (an auth gate that blocks unauthenticated access, a rate limit, a gated model refusing download). Cite where the intent is established.
- **Environment or configuration** — the system is correct but the user's setup, credentials, deployment target, or data is not (a missing env var, a local-vs-remote database, a stale build).
- **Defect** — the behavior contradicts the intended design.
- **Unknown** — the intent cannot be established from the repository.

Design and environment findings end here with an explanation, the evidence, and what the user would change: their setup, or — if they want the design itself changed — a feature request for `/plan-it`. Do not "fix" intended behavior. Unknown intent is a question for the user, asked with the evidence, not a license to pick one.

### 3. Build a Feedback Loop

Find the fastest reliable signal that shows the user's exact symptom, not merely nearby code. When the symptom is on a surface the repo's verify skill drives, run its Doctor and reach the symptom through its Launch and Drive steps. Choose what fits; these are options, not a sequence:

1. Existing failing test or focused new regression test.
2. Minimal command, script, or CLI invocation.
3. HTTP request, UI interaction, or browser automation against the running system.
4. Replay of real input, logs, traces, payloads, or snapshots.
5. Throwaway harness around the relevant module.
6. Repeated or generated inputs when the symptom is intermittent.
7. Manual reproduction steps when automation is not yet possible.

Creating a test or harness is a file change; make it only when the request authorizes edits. Reading, running, and querying do not need that authority, but writes to shared or production systems always need approval, even to reproduce.

### 4. Reproduce and Minimize

Run the loop and confirm the symptom. Then reduce the scenario until the remaining inputs, config, and steps are all load-bearing. A symptom that does not reproduce may be environmental or already fixed — say which evidence points where.

### 5. Trace and Hypothesize

Follow the behavior through the relevant entry points, state changes, IO, and error paths. Rank plausible causes, each as:

```text
If <cause> is true, then <probe or change> should show <result>.
```

Test the strongest first, one variable at a time. When the user asks whether an earlier diagnosis was wrong, treat that diagnosis as a hypothesis and test it again rather than defending it.

### 6. Fix and Verify

When a fix was requested and the cause is confirmed, make the smallest change that removes it, then rerun the step 3 signal and show the symptom is gone. Keep a regression test when one can catch the cause. If the repo has a verify skill, update in the same diff every feature file whose `Where it lives` paths the fix touches, and any launch step or gotcha this diagnosis discovered. If the fix needs a design decision or reaches beyond this bug, stop and hand off to `/plan-it`.

## Output

```markdown
- Symptom: <restated>
- Classification: <defect / design / environment / unknown> — <evidence>
- Reproduction: <signal and result, or what blocked it>
- Cause: <confirmed hypothesis and the evidence>
- Fix: <change made, or "diagnosis only">
- Verification: <same signal rerun, its evidence kind, runs and results, uncovered conditions — or "unverified" with why it could not be rerun or did not settle>
- Other issues found: <reported, not fixed>
- Verify skill: <what this diagnosis had to discover about running the project, and — if a fix was made — the feature-file updates in the fix's diff; or "nothing new">
```

## Completion Criterion

The report classifies the behavior with evidence. For design or environment, the explanation and next step are stated and no product code changed. For a defect: the symptom was reproduced (or the blocker is stated), the cause is a tested hypothesis, and — if a fix was requested — the same reproduction was rerun after the fix and no longer shows the symptom, the verify skill was updated as step 6 requires, and any other issues are reported but not fixed.
