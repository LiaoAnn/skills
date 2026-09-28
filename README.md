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
  process/     ← workflows: plan, implement, diagnose, review
  principles/  ← cross-cutting craft: tdd
  stacks/      ← concrete stacks/tools/repos: e.g. Dev Containers, Drizzle ORM, Knip
```

**[process](./skills/process/README.md)** encodes task flows and stays project-agnostic. **[principles](./skills/principles/README.md)** holds reusable craft judgment such as TDD. **[stacks](./skills/stacks/README.md)** holds concrete guidance for specific packages, frameworks, tools, and repos. A process skill like `/implement-plan` calls `/tdd`; the `drizzle-orm` stack skill applies those principles to Drizzle-specific APIs and pitfalls.
