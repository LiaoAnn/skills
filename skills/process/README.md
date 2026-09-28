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

- **[plan-it](./plan-it/SKILL.md)** — Resolve outcome, scope, approach, and validation before implementation. Scales from an inline plan to a structured design. Feasibility-only requests end at go/no-go.
- **[implement-plan](./implement-plan/SKILL.md)** — Carry accepted work through relevant validation and inspection without per-slice or per-file approval. Stop for unresolved blockers or new authority/design decisions; Git and other protected actions need specific approval. Uses `/tdd` only when test-first was selected.
- **[diagnose-bug](./diagnose-bug/SKILL.md)** — Diagnose product/runtime bugs before fixing. Builds a reproduction path, traces the code, generates ranked hypotheses, defines acceptance criteria.
- **[review-change](./review-change/SKILL.md)** — Review a diff from a fresh reviewer perspective. Prefers a subagent or fresh context. Separates blockers from hardening and defaults unknowns to hardening.

## Flows

These are routes, not mandatory ceremonies. Reuse existing understanding; a clear, low-risk implementation request can proceed with an inline plan. A handoff between skills is not a new user-approval checkpoint unless authority or design changes. Load independent review when it adds value.

**Change code**
`/plan-it` → `/implement-plan` → `/review-change`

**Fix a bug**
`/diagnose-bug` → `/plan-it` → `/implement-plan` → `/review-change`

**Review only**
`/review-change`

Not sure which to use? Run `/ask-me`.
