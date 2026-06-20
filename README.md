# My Coding Agent Skills

My personal workflow skills for Claude Code and other coding agents.

## Installation

```bash
npx skills@latest add liaoann/skills
```

Or manually copy the `skills/global/` directory into your agent's skills folder.

## Architecture

```
skills/
  global/     ← workflow skills that apply to any project or codebase
```

**Global skills** encode the process: how to study a repo, plan a change, implement it, diagnose a bug, review the result, and open a PR. They are project-agnostic and composable. See [skills/global](./skills/global/README.md) for the full reference.

Future layers will add technique-specific skills (e.g. TDD, vertical slice) and domain knowledge rules (e.g. Effect TS, tree shaking).
