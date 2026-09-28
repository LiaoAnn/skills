# Process Skills

**Process** skills encode *how to move through a task*: understand, plan, implement, diagnose, review. They stay project-agnostic and orchestrate the work.

When a process step needs reusable craft judgment, reference a **principles** skill such as `/tdd`. When the work touches a specific framework, package, tool, or repo, reference the relevant **stacks** skill instead of inlining stack details.

## Skills Reference

Process skills also split by invocation — who can reach them.

**User-invoked** skills are reachable only when you type them. They act as entry points and orchestrators.

**Model-invoked** skills can be invoked by you *or* reached for automatically by the agent when the situation fits.

**User-invoked**

- **[ask-me](./ask-me/SKILL.md)** — Router. Type `/ask-me` when unsure which workflow fits. Maps your task to the right flow: change, bug, or review.

**Model-invoked**

- **[plan-it](./plan-it/SKILL.md)** — Plan from Why to How to What: user value first, an abstract approach in the current architecture, then ordered slices that each carry a real-system acceptance check.
- **[implement-plan](./implement-plan/SKILL.md)** — Run each slice through red, implement, green, mechanical checks, real-system acceptance, multi-lens review, and commit before the next.
- **[diagnose-bug](./diagnose-bug/SKILL.md)** — For unexplained behavior or errors: classify defect vs. intended design vs. environment, reproduce before editing, test hypotheses, and verify the fix with the same reproduction.
- **[review-change](./review-change/SKILL.md)** — Parallel fresh-context reviewers, one per lens (correctness, test quality, design fit, simplicity, security); every Blocker is confirmed before it is reported.

## Flows

These are routes, not mandatory ceremonies. Reuse existing understanding; a clear, low-risk implementation request can proceed with an inline plan. A handoff between skills is not a new user-approval checkpoint unless authority or design changes. Load independent review when it adds value.

**Change code**
`/plan-it` → `/implement-plan` → `/review-change`

**Fix a bug**
`/diagnose-bug` → `/plan-it` → `/implement-plan` → `/review-change`

**Review only**
`/review-change`

Not sure which to use? Run `/ask-me`.
