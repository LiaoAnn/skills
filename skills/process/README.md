# Process Skills

**Process** skills encode *how to move through a task*: understand, plan, implement, diagnose, review, ship. They stay project-agnostic and orchestrate the work.

When a process step needs reusable craft judgment, reference a **principles** skill such as `/tdd` or `/architecture`. When the work touches a specific framework, package, tool, or repo, reference the relevant **stacks** skill instead of inlining stack details.

## Skills Reference

Process skills also split by invocation — who can reach them.

**User-invoked** skills are reachable only when you type them. They act as entry points and orchestrators.

**Model-invoked** skills can be invoked by you *or* reached for automatically by the agent when the situation fits.

**User-invoked**

- **[ask-me](./ask-me/SKILL.md)** — Router. Type `/ask-me` when unsure which workflow fits. Maps your task to the right flow: change, inquiry, bug, or review.

**Model-invoked**

- **[study-repo](./study-repo/SKILL.md)** — Understand a codebase or external package before acting. Separates facts, inferences, and unknowns.
- **[plan-it](./plan-it/SKILL.md)** — Plan a code change before touching anything. Produces a structured plan with validation criteria, a test-first decision, and a test behavior inventory. Stops early with a go/no-go for feasibility-only assessments.
- **[implement-plan](./implement-plan/SKILL.md)** — Execute an agreed plan in vertical slices: implement → validate → commit → next slice. References `/tdd` for test-first discipline.
- **[diagnose-bug](./diagnose-bug/SKILL.md)** — Diagnose product/runtime bugs before fixing. Builds a reproduction path, traces the code, generates ranked hypotheses, defines acceptance criteria.
- **[ci-triage](./ci-triage/SKILL.md)** — Classify failing CI/local validation checks, reproduce the cheapest reliable signal, apply safe bounded fixes, and hand off implementation or bug diagnosis when needed.
- **[review-change](./review-change/SKILL.md)** — Review a diff from a fresh reviewer perspective. Prefers a subagent or fresh context. Reports findings by severity.
- **[open-pr](./open-pr/SKILL.md)** — Write a PR description and open the pull request. Falls back to a standard structure if no project template exists.

## Flows

**Change code**
`/study-repo` → `/plan-it` → `/implement-plan` → `/review-change` → `/open-pr`

**Fix a bug**
`/diagnose-bug` → `/plan-it` → `/implement-plan` → `/review-change`

**Triage failing checks**
`/ci-triage` → (if non-mechanical code change needed) `/implement-plan` or `/plan-it`; if product behavior bug, `/diagnose-bug`

**Understand before acting**
`/study-repo` → (if change needed) `/plan-it`

**Review only**
`/review-change`

Not sure which to use? Run `/ask-me`.
