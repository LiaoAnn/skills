# My Coding Agent Skills

My personal workflow skills for Claude Code and other coding agents — covering the full loop from understanding a codebase to shipping a pull request.

## Installation

```bash
npx skills@latest add liaoann/skills
```

Or manually copy the `skills/global/` directory into your agent's skills folder.

## Architecture

Skills are organized into two layers:

```
skills/
  global/     ← workflow skills that apply to any project or codebase
```

**Global skills** encode the process: how to study a repo, plan a change, implement it, diagnose a bug, review the result, and open a PR. They are project-agnostic and composable.

Future layers will add technique-specific skills (e.g. TDD, vertical slice) and domain knowledge rules (e.g. Effect TS, tree shaking) that inform *how* to write code within a specific context.

## Skills Reference

Skills split on one axis — who can invoke them.

**User-invoked** skills are reachable only when you type them (e.g. `/ask-me`). They act as entry points and orchestrators.

**Model-invoked** skills can be invoked by you *or* reached for automatically by the agent when the situation fits. They hold the reusable discipline.

### Global

**User-invoked**

- **[ask-me](./skills/global/ask-me/SKILL.md)** — Router. Type `/ask-me` when you're unsure which workflow fits the situation. Maps your task to the right flow: change, inquiry, bug, or review.

**Model-invoked**

- **[study-repo](./skills/global/study-repo/SKILL.md)** — Understand a codebase or external package before acting. Separates facts, inferences, and unknowns. Use before planning any change.
- **[plan-change](./skills/global/plan-change/SKILL.md)** — Plan a code change before touching anything. Reads the current system, compares approaches, and produces a structured plan with validation criteria. Stops early with a go/no-go if you only need a feasibility assessment.
- **[implement-plan](./skills/global/implement-plan/SKILL.md)** — Execute an agreed plan in vertical slices: write test → implement → validate → commit → next slice. Validates continuously and reports evidence before declaring done.
- **[diagnose-bug](./skills/global/diagnose-bug/SKILL.md)** — Diagnose before fixing. Builds a reproduction path, traces the code, generates ranked hypotheses, and defines acceptance criteria. Does not implement the fix.
- **[review-change](./skills/global/review-change/SKILL.md)** — Review a diff from a fresh reviewer perspective — not as the implementer defending the work. Prefers a subagent or fresh context. Reports findings by severity.
- **[open-pr](./skills/global/open-pr/SKILL.md)** — Write a PR description and open the pull request. Follows the repo's PR template if one exists; falls back to a standard reviewer-friendly structure (Summary / Changes / Testing / Risks) if not.

## Flows

Most work travels one of four paths:

**Change code**
`/study-repo` → `/plan-change` → `/implement-plan` → `/review-change` → `/open-pr`

**Fix a bug**
`/diagnose-bug` → `/plan-change` → `/implement-plan` → `/review-change`

**Understand before acting**
`/study-repo` → (if change needed) `/plan-change`

**Review only**
`/review-change`

Not sure which to use? Run `/ask-me`.
