# Global Skills

**Process** skills — they encode *how to move through a task*: understand, plan, implement, diagnose, review, ship. Project-agnostic. They reference **practice** skills (`techniques/`, `domain/`) for *how to do the work well* at each step.

## Skills Reference

Skills split on one axis — who can invoke them.

**User-invoked** skills are reachable only when you type them. They act as entry points and orchestrators.

**Model-invoked** skills can be invoked by you *or* reached for automatically by the agent when the situation fits.

**User-invoked**

- **[ask-me](./ask-me/SKILL.md)** — Router. Type `/ask-me` when unsure which workflow fits. Maps your task to the right flow: change, inquiry, bug, or review.

**Model-invoked**

- **[study-repo](./study-repo/SKILL.md)** — Understand a codebase or external package before acting. Separates facts, inferences, and unknowns.
- **[plan-change](./plan-change/SKILL.md)** — Plan a code change before touching anything. Produces a structured plan with validation criteria. Stops early with a go/no-go for feasibility-only assessments.
- **[implement-plan](./implement-plan/SKILL.md)** — Execute an agreed plan in vertical slices: implement → validate → commit → next slice. References `/tdd` for test-first discipline.
- **[diagnose-bug](./diagnose-bug/SKILL.md)** — Diagnose before fixing. Builds a reproduction path, traces the code, generates ranked hypotheses, defines acceptance criteria.
- **[review-change](./review-change/SKILL.md)** — Review a diff from a fresh reviewer perspective. Prefers a subagent or fresh context. Reports findings by severity.
- **[open-pr](./open-pr/SKILL.md)** — Write a PR description and open the pull request. Falls back to a standard structure if no project template exists.

## Flows

**Change code**
`/study-repo` → `/plan-change` → `/implement-plan` → `/review-change` → `/open-pr`

**Fix a bug**
`/diagnose-bug` → `/plan-change` → `/implement-plan` → `/review-change`

**Understand before acting**
`/study-repo` → (if change needed) `/plan-change`

**Review only**
`/review-change`

Not sure which to use? Run `/ask-me`.
