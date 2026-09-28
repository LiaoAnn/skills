---
name: drizzle-orm
description: Use when changing or reviewing Drizzle schemas, migrations, or database-test setup.
---

# Drizzle ORM

Apply Drizzle-specific guidance only to the affected surface. Pure application logic with no Drizzle surface does not need this skill. These rules complement the accepted implementation or review workflow, not replace it.

## Choose the Relevant Guidance

- **Schema definitions, JSON columns, or timestamps:** read [schema.md](schema.md).
- **Schema changes that require migrations, or edits to the migration chain:** read [migrations.md](migrations.md). Preserve generated SQL and snapshot consistency.
- **Database-test setup, isolation, atomic writes, or schema-test decisions:** read [testing.md](testing.md).

A schema change that alters database structure needs both schema and migration guidance. Do not load testing setup merely because a column's TypeScript type changes.

Use [test judgment](../../principles/tdd/test-judgment.md) when deciding coverage. Invoke `/tdd` only if test-first implementation was selected. Driver limitations and project configuration still matter; do not assume all drivers behave alike.

## Completion Criterion

The applicable documents' checks are satisfied: generated migration state stays consistent where changed, JSON shapes are explicit, existing timestamp automation is preserved, and affected database tests use the real migration chain without redundant resets or declaration-restating tests. Unaffected surfaces require no incidental edits.
