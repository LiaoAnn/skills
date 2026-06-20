# My Coding Agent Skills

My personal workflow skills for Claude Code and other coding agents.

## Installation

```bash
npx skills@latest add liaoann/skills
```

Or manually copy the `skills/` directory into your agent's skills folder.

## Architecture

Skills split on one axis: **process** (how to move through a task) vs **practice** (how to do the work well). Process skills reference practice skills at the relevant step.

```
skills/
  global/      ← process: study, plan, implement, diagnose, review, ship
  techniques/  ← practice (cross-cutting craft): tdd, architecture
  domain/      ← practice (stack/repo-specific): e.g. Effect TS, a given monorepo
```

**[global](./skills/global/README.md)** encodes the process and stays project-agnostic. **[techniques](./skills/techniques/README.md)** holds craft that applies anywhere. **[domain](./skills/domain/README.md)** holds practices bound to a specific stack or repo. A process skill like `/implement-plan` calls `/tdd`; `/review-change` checks boundaries against `/architecture`.
