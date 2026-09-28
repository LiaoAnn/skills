---
name: verification-evidence
description: Use when a workflow step requires evidence that a change works, a fix holds, or a reported problem is real.
---

# Verification Evidence

A claim that something works, is fixed, or is broken is worth what stands behind it. This skill defines what can stand behind a claim. The calling step decides which claims need it, how strong the evidence must be, and how its report presents the result.

## Name the Kind of Evidence

Evidence comes in kinds, strongest first:

1. **Observed** — the behavior itself, seen where it actually happens: the running system, the real endpoint, the deployed service.
2. **Executed** — a test or command that exercises the behavior in a controlled environment.
3. **Traced** — the code path followed step by step from input to result, without running it.

Anything else — a clean build, a plausible diff, an agent's summary, "it should work" — is not evidence for the claim; at most it points to where to look.

State which kind backs each claim. A claim whose evidence is weaker than the step requires — or that has none — is reported as falling short, using the calling step's label for that, never as settled. Never report a weaker kind as the stronger one.

## The Check Must Be Able to Fail

A check supports a claim only if it would have failed were the claim false. Decide what result counts as passing before running the check, not after seeing the result. Where the calling step leaves the choice of check open, prefer the one most likely to fail if the claim is wrong over the one most likely to pass. Ask of every check:

- A test that replaces the part under question with a stand-in cannot fail on that part.
- For a claim that a change produced new behavior, a check that passes with or without the change says nothing about it.
- A different signal from the one that showed the problem does not show the problem is gone.

The surest way to show a check can fail is to have seen it fail: a test that ran red before the implementation, a reproduction that showed the bug before the fix. Where that happened, keep it. Where it did not — acceptance run after the work, a refactor whose existing checks still pass — the check still counts if it plainly exercises the claimed behavior and would break without it.

## Make It Repeatable

Record enough for another person or agent to recheck the claim: what was run or done, against what, and what came back — or, for a trace, the path with file and line. Keep failed, flaky, or inconsistent results alongside the passing ones; one pass among several runs does not settle a claim, so report the runs and their outcomes in whatever form the calling step's report allows.

## State What Was Not Checked

A claim holds only as far as its evidence reaches. Name the conditions the evidence does not cover — inputs, environments, or cases left untested — in whatever form the calling step's report allows. How far to test is the calling step's decision; stating the edge is not.

## Claims Are Leads Until Checked

A claim received from a reviewer, a subagent, a log, an earlier diagnosis, or your own suspicion is unchecked. This applies most to your own work: a change you made is the claim you are most inclined to accept. Check it before presenting it as fact; otherwise it stays unchecked, presented however the calling step specifies.

## Completion Criterion

Every claim the calling step presents as settled names its kind of evidence and a record someone could recheck, each supporting check has either a record of failing before the change or a stated reason it would fail without the claimed behavior, no failed or inconsistent run of those checks is omitted, and conditions known to be left uncovered are stated. Every other claim is reported under the calling step's label for falling short, not as settled.
