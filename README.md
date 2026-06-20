# My Coding Agent Skills

My personal workflow skills for Claude Code and other coding agents.

## Installation

```bash
npx skills@latest add liaoann/skills
```

Or manually copy the `skills/` directory into your agent's skills folder.

## Architecture

Skills split into three categories:

- **process** — workflows and orchestration: how to move through a task.
- **principles** — cross-cutting concepts and standards: how to judge whether work is good.
- **stacks** — stack-, tool-, or repo-specific practices: how to apply principles in a concrete environment.

Process skills reference principles when they need general craft judgment. Stack skills build on principles, then add the specific patterns, pitfalls, APIs, and conventions for a package, framework, tool, or repo.

```
skills/
  process/     ← workflows: study, plan, implement, diagnose, review, ship
  principles/  ← cross-cutting craft: tdd, architecture
  stacks/      ← concrete stacks/tools/repos: e.g. frontend performance, Drizzle ORM, Effect TS
```

**[process](./skills/process/README.md)** encodes task flows and stays project-agnostic. **[principles](./skills/principles/README.md)** holds reusable craft judgment such as TDD and architecture. **[stacks](./skills/stacks/README.md)** holds concrete guidance for specific packages, frameworks, tools, and repos. A process skill like `/implement-plan` calls `/tdd`; `/review-change` checks boundaries against `/architecture`; a future stack skill like `drizzle-orm` should apply those principles to Drizzle-specific APIs and pitfalls.
