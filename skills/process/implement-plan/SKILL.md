---
name: implement-plan
description: Use when executing an accepted implementation plan through validation.
---

# Implement Plan

Carry the accepted plan through its slices, one at a time. A slice is done when its outcome has been demonstrated on the real system and reviewed — not when its checks turn green.

## Preconditions and Authority

- Start from an accepted plan with slices. A clear, low-risk request can carry a brief inline plan with a single slice; use `/plan-it` when the Why, the approach, or the slices are unresolved.
- Necessary in-scope source and test changes do not need per-file approval. Get specific approval before Git actions the plan did not authorize, destructive actions, or writes to shared or production systems, and before work outside the accepted scope or a new design decision.
- Preserve unrelated user work. Adapt details when new evidence preserves the accepted outcome and boundaries; stop for a decision when evidence invalidates a load-bearing choice.

## The Slice Loop

Run every slice through these steps in order. A failing step sends the slice back to implementation; do not advance past it.

1. **Red.** When `TDD: yes`, follow `/tdd`, working outside-in: the first failing test sits at the level of the slice's Acceptance (an integration test against the real route, the CLI invoked end to end, an e2e flow) wherever the test environment can reach it; narrower tests follow as the implementation needs them. [Test judgment](../../principles/tdd/test-judgment.md) decides when a slice is owed no new test; record that exemption instead of manufacturing one. For a bug, reproduce the failure first — a fix without a reproduction is a guess.

   For a **high-risk slice** — one that changes a public contract, persisted data, a shared module, or a production path — the tests come from a separate test-author subagent. Its brief holds only the plan's Why, the slice's Outcome and Acceptance, and the public interface — never the implementation approach. It writes the tests outside-in, runs them RED for the expected reason, and hands them back. The implementer must not edit those tests. If it believes one is wrong, it stops and returns the test with its reason to the test author or the user, who decides.
2. **Implement** the smallest change that delivers the slice's outcome within its boundary.
3. **Green.** Run the slice's tests and the tests near the change.
4. **Mechanical checks.** Run the project's typecheck, lint, format, and dead-code checks — the commands the project declares. They must pass.
5. **Acceptance.** Demonstrate the slice's outcome on the real system as the plan's Acceptance describes. Use the project's verify skill if it has one; otherwise drive it by surface: a web flow in a browser with screenshots of the changed screens, a CLI by running the command, a service by a real request, infrastructure by deploying and exercising it. Capture the command and output, or the screenshot. Tests that stub the boundary under change are not acceptance. If the real system cannot be reached, the result is **inconclusive** — say so and why; never report it as passed.
6. **Review.** Run `/review-change` on the slice's diff with the lenses it selects for the slice's risk. Fix confirmed Blockers and rerun steps 3–5 for what the fix touched.
7. **Commit** the slice as its own commit if the plan authorized per-slice commits; otherwise report it ready and continue.

If any step shows behavior nobody expected and its cause is not obvious, apply `/diagnose-bug` before editing further: reproduce, test a hypothesis, then fix and rerun the same signal. The behavior may also be intended design; confirm that before "fixing" it.

Then start the next slice. Progress notes are informational, not approval requests.

If a slice grows past its boundary, stop and re-cut it with the user rather than letting the diff absorb the extra work. When the last slice is done, run `/review-change` once over the whole feature with the finished-feature lenses.

## Output

Report per slice, then overall:

```markdown
### Slice <n>: <outcome>
- Tests: <author: implementer / test-author subagent>, <RED evidence or exemption reason>, <GREEN command and result>, <disputed tests and their resolution>
- Checks: <commands and results>
- Acceptance: <passed / failed / inconclusive> — <command, output, or screenshot path>
- Review: <lenses run>, <Blockers fixed>, <residual risk>
- Commit: <hash, or "not committed">
```

Close with remaining risks, deviations from the plan, and anything left inconclusive.

## Completion Criterion

Every slice has a recorded test result or exemption, high-risk slices were tested by a separate test author whose tests the implementer did not edit, passing mechanical checks, an acceptance result with captured evidence, and a review with no unresolved confirmed Blockers; the finished-feature review ran; each slice is committed or reported uncommitted per the plan; nothing inconclusive is reported as passed; no temporary debugging code remains; and every side effect stayed within approved authority.
