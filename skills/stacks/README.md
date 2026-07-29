# Stacks

**Stacks** skills encode how to do good work in a specific package, framework, tool, product domain, or repo.

They are the concrete sibling of `principles/`: start from the relevant general principles, then add the stack-specific APIs, patterns, constraints, sharp edges, and anti-patterns. For example, a `drizzle-orm` skill should apply architecture and testing principles, then explain Drizzle-specific query patterns, migrations, transaction boundaries, and pitfalls.

Process skills in `process/` reference these when the work touches the relevant stack.

## Skills Reference

- **[devcontainer-exec](./devcontainer-exec/SKILL.md)** — Resolve a project's Dev Container and route every build, test, lint, and run command through `docker exec` while editing files on the host.
- **[lean4-principle-check](./lean4-principle-check/SKILL.md)** — Use existing Lean 4 models or checks to validate whether a planned design conflicts with project principles before implementation.
- **[codex-session-continuity](./codex-session-continuity/SKILL.md)** — When the running model is Codex/GPT-5, keep the session looping at each phase boundary by calling the ask-user tool with a decision menu instead of ending the turn.
- **[drizzle-orm](./drizzle-orm/SKILL.md)** — Driver-agnostic guidance for using Drizzle ORM: generated migrations, typed JSON columns, timestamp automation, and testing Drizzle-backed code with Vitest (client-level resets, real migrations via first-party tooling, no schema-only tests).
