# Stacks

**Stacks** skills encode how to do good work in a specific package, framework, tool, product domain, or repo.

They are the concrete sibling of `principles/`: start from the relevant general principles, then add the stack-specific APIs, patterns, constraints, sharp edges, and anti-patterns. For example, a `drizzle-orm` skill should apply testing principles, then explain Drizzle-specific query patterns, migrations, transaction boundaries, and pitfalls.

Process skills in `process/` reference these when the work touches the relevant stack.

## Skills Reference

- **[devcontainer-exec](./devcontainer-exec/SKILL.md)** — Resolve and verify the required Dev Container before project execution. Load [resolution troubleshooting](./devcontainer-exec/resolution.md) or [lifecycle guidance](./devcontainer-exec/lifecycle.md) only when needed; host editing requires a bind-mounted source.
- **[drizzle-orm](./drizzle-orm/SKILL.md)** — Routes to [schema](./drizzle-orm/schema.md), [migrations](./drizzle-orm/migrations.md), or [database testing](./drizzle-orm/testing.md) guidance. Preserves generated migration state, JSON types, timestamp automation, and behavior-focused coverage.
- **[knip](./knip/SKILL.md)** — Configuring Knip: `.jsonc` config with commented ignores, reporting exported types used only inside their own file, and the shadcn/ui + CSS-imported-dependency (`tailwindcss`, `tw-animate-css`) exceptions.
