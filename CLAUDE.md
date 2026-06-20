# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This repo contains personal coding-agent skills organized by category. Skills are reusable workflow definitions that Claude Code and other agents can invoke.

## Structure

```
skills/
  <category>/
    README.md              ← lists every skill in this category
    <skill-name>/
      SKILL.md
.claude-plugin/
  plugin.json              ← lists all installable skills for skills.sh
```

Current categories: `global` (project-agnostic workflow skills).

Future categories will include technique-specific skills (e.g. `tdd`) and domain knowledge skills (e.g. `effect-ts`, `tree-shaking`).

## Adding a Skill

Three files must stay in sync — missing any one breaks installation or discoverability:

1. Create `skills/<category>/<skill-name>/SKILL.md`
2. Add an entry to `skills/<category>/README.md` under the correct invocation section
3. Add the path to `.claude-plugin/plugin.json` under `"skills"`

## SKILL.md Format

```yaml
---
name: skill-name          # kebab-case, matches the directory name
description: ...          # see Invocation section below
disable-model-invocation: true   # only present for user-invoked skills
---
```

Every skill must have a **Completion Criterion** section.

Skills that produce structured output must define their output format explicitly.

## Invocation Model

**Model-invoked** (default — omit `disable-model-invocation`): the agent sees the description every turn and can fire the skill autonomously. Write the description for the agent with rich trigger phrasing:

```
Use when the user wants to X, mentions Y, or reports Z.
```

**User-invoked** (`disable-model-invocation: true`): only the human can invoke it by typing its name. The description becomes human-facing — a plain one-line summary, no trigger phrases. Zero context load.

Rules:
- A user-invoked skill may invoke model-invoked skills.
- A user-invoked skill must never invoke another user-invoked skill.
- Use user-invoked for entry points and routers; model-invoked for the reusable discipline underneath.

## Skill Quality

**A good skill:**
- Does exactly one thing. If it's doing two, split it.
- Has a trigger the agent can reliably detect from the description alone (model-invoked), or a name the user will remember (user-invoked).
- States explicit off-ramps: when to stop, what to hand off, and to which skill.
- Defines output format when the output will be consumed by the user or another skill.
- Has a Completion Criterion that is binary — either met or not, no judgment required.
- Adds value the model wouldn't produce on its own. If a smart model handles it correctly without the skill, the skill is noise.

**A good skill avoids:**
- Fuzzy completion: "when the work looks good" is not a criterion.
- Missing guard conditions: if the skill assumes a plan exists, say so and name the fallback skill.
- Generic advice that applies to all coding (those belong in CLAUDE.md, not a skill).
- Describing the same trigger in both a model-invoked skill and a user-invoked router — double-firing wastes context.
- Accumulating scope across versions. When a skill grows beyond one responsibility, split rather than expand.
