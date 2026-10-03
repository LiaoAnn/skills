---
name: maintain-verification-skill
description: Audit a project's verify skill and feature map against the current code and running system, and ship proven corrections.
disable-model-invocation: true
---

# Maintain a Verification Skill

A feature map rots the moment the app changes. Day-to-day work writes back what it touches; this pass catches what it missed. The unit of rigor is the feature: every feature file is checked against source and every feature is driven live.

## Guard

- Find the target: the repo's complete `.claude/skills/verify-*/`. Several → ask which. None, or one a `/create-verification-skill` run left blocked → stop and point to `/create-verification-skill`, which resumes it.
- Edit only the verify skill's own directory (SKILL.md, `features/`, helper scripts it owns). Never change product code: behavior the map describes that the app no longer does is either map drift (fix the map) or a product regression (report it, do not paper over it).

## Outcome

Pick one and say which:

- **clean** — nothing to correct.
- **changed** — corrections to the map, the skill, or its helpers.
- **blocked** — coverage could not finish.

## Pass

1. **Index.** Read `features/README.md` and list the feature files. Note missing, extra, duplicate, or dead entries; fix them in Triage.
2. **Source wave.** One read-only subagent per feature file, in parallel. Each explains how the feature works from source, flags drift with `file:line` citations, and returns one live-verification recipe. Subagents never drive the system and never edit files.
3. **Reconcile.** Every feature file has a returned summary. Spot-check cited drift rather than re-proving clean claims. Re-inventory user-visible entry points from source and check each belongs to a feature's user task or is on the README's Unmapped list with a reason; do the same for external services and environments. Call one missing only with a concrete source path.
4. **Live pass.** Required even when source looks clean. You drive, following the skill's own Launch model. Exercise every feature at least once. Run Doctor before the first drive and again after any failed or surprising one, and follow the skill's Cleanup after every drive. A section the consumers read by name (Launch, Doctor, Drive, Cleanup, `Where it lives`, `Driving it`) that is missing or renamed is drift. A feature that cannot be reached is recorded as unreachable only with its concrete prerequisite (account, entitlement, OS, external state) and the route tried; if the map omits that prerequisite, that is drift.
5. **Triage.** Wrong or missing description → map drift, fix it. Working behavior the harness cannot drive → harness gap, fix it and re-drive the fix live. Broken app behavior → product gap, report it and keep it out of the change.
6. **Deliver.** For **changed**, leave the corrections as one uncommitted change unless the user authorized a commit. For **clean**, leave no edits. For **blocked**, keep only corrections already proven live, and report the rest as unproven.

## Output

```markdown
- Outcome: <clean / changed / blocked>
- Features: <each: covered / unreachable (prerequisite)>
- Drift fixed: <file — what changed, with its evidence>
- Harness fixes: <what, re-driven with evidence>
- Product gaps: <symptom and evidence, not fixed here — hand each to `/diagnose-bug`>
- Blocked by: <reason, or "none">
```

## Completion Criterion

An outcome is stated. For **clean** or **changed**: every feature file has a source summary and a live drive or a recorded unreachable prerequisite, and every correction was proven live before delivery. For **blocked**: the blocker and the coverage reached before it are reported, and any kept correction was proven live. In every case, no product code changed and product gaps are reported, not fixed.
