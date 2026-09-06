# Testing Drizzle-Backed Code

Read when changing database-test setup, isolation, atomic multi-write behavior, or deciding whether a schema rule needs coverage.

## Reset Through Drizzle, Only When Needed

Check the harness's isolation first. Cloudflare's `@cloudflare/vitest-pool-workers` can provide storage rollback; other setups use transaction-per-test or a truncate helper. Do not add resets that duplicate the configured isolation.

When an explicit reset is needed, use the Drizzle client, such as `await db.delete(table)`, rather than schema-shaped SQL through `env.DB.prepare`, `pool.query`, or `connection.execute`. Going through the schema-aware layer keeps renames visible to the type checker and exercises the same layer the application uses.

## Apply Real Migrations via First-Party Tooling

Build the test database with the actual migration chain, not a hand-rolled `CREATE TABLE` setup:

- **Cloudflare D1:** `readD1Migrations()` from `@cloudflare/vitest-pool-workers/config` collects migrations in Node; `applyD1Migrations(db, migrations, migrationTableName?)` applies them in setup.
- **Node drivers (Postgres/MySQL/SQLite/LibSQL):** use `migrate()` from the matching `drizzle-orm/<driver>/migrator` against the migrations folder.

Preserve existing first-party migration application rather than replacing it with ad-hoc schema creation.

## Atomic Multi-Write: Transaction vs Batch

`db.transaction()` works on the Node drivers. On D1 use `db.batch()`: D1 has no interactive transactions, and `db.transaction()` throws at runtime rather than producing a compile error. A batch runs its statements in an all-or-nothing transaction.

## Exercise Behavior, Not Schema Syntax

Use [test judgment](../../principles/tdd/test-judgment.md) to decide necessity. Do not assert merely that a column, table, or index exists, or retest Drizzle's documented mapping behavior.

Prefer the caller-level test: an upsert's conflict branch (`onConflictDoUpdate`, or `onDuplicateKeyUpdate` on MySQL), not a redundant assertion about its unique index. A direct schema-rule test is useful when no caller-level test reaches the same failure: a `CHECK`, partial unique index, row-security policy, or ORM-maintained timestamp.

Drizzle applies `$onUpdate` client-side, so the database engine does not enforce it and raw writes can bypass it. Likewise `.$type<T>()` does not validate stored values. Do not mistake type checking or generator drift detection for runtime coverage; read [migrations.md](migrations.md) if drift or hand-edited SQL is the concern.
