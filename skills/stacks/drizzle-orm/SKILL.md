---
name: drizzle-orm
description: Use when working with Drizzle ORM on any SQL driver (Cloudflare D1, Postgres, MySQL, SQLite, LibSQL) — writing or editing a schema, adding or changing migrations, declaring column types (especially JSON columns), setting up timestamps, or testing Drizzle-backed code with Vitest — and when reviewing such a change. Mentions of drizzle, drizzle-kit, `.sql` migrations, or `drizzle/meta` are triggers.
---

# Drizzle ORM

How to use Drizzle ORM well, driver-agnostic — the same rules hold whether the backing store is Cloudflare D1, Postgres, MySQL, SQLite, or LibSQL. Apply the general [[tdd]], [[contracts]], and [[codebase-stewardship]] principles; this skill names the Drizzle-specific patterns agents get wrong and the ones worth preserving.

## Scope

Use when the change touches a Drizzle schema file, a `drizzle/` migration folder, or a test that exercises a Drizzle-backed database. If the work is pure application logic with no Drizzle surface, this skill does not apply.

This is guidance to apply during planning, implementation, and review — not a standalone procedure. It does not replace `/tdd` or `/implement-plan`; it constrains how they play out with Drizzle.

## Schema and migrations

### Generate migrations; never hand-write them

**Symptom:** agent authors a `.sql` migration file by hand, or edits the schema and writes matching SQL manually.

**Why wrong:** `drizzle-kit generate` diffs the current schema against the stored snapshot in `drizzle/meta/` (`_journal.json` + per-migration snapshots) and emits SQL plus a new snapshot baseline. A hand-written migration leaves the snapshot untouched, so the next `generate` diffs against a stale baseline and produces wrong or duplicate SQL. The migration state desyncs from the schema.

**Do instead:** change the schema, then run `drizzle-kit generate` (config-driven, e.g. `drizzle-kit generate --config drizzle.config.ts`). Let it own the SQL and the snapshot. Only hand-edit a *generated* file for cases the differ cannot express (data backfill, custom index, tricky column move) — as an edit on top of the generated migration, never a from-scratch file.

### Type JSON columns with `.$type<T>()`

**Symptom:** a JSON/JSONB column declared without a concrete shape, or typed as a loose `Record<string, unknown>` / `Record<string, any>`.

**Why wrong:** the column is a [[contracts|contract]]. `Record<>` erases it — every read needs a cast or a guard, and nothing catches a shape change. Drizzle can carry the real type.

**Do instead:** declare an explicit interface/type and attach it with `.$type<T>()` (the column helper varies by dialect — `jsonb(...)` on Postgres, `text({ mode: 'json' })` on SQLite/D1 — but `.$type<T>()` is the same):

```ts
interface Preferences { theme: 'light' | 'dark'; locale: string }

// SQLite / D1
preferences: text('preferences', { mode: 'json' }).$type<Preferences>().notNull(),
// Postgres
preferences: jsonb('preferences').$type<Preferences>().notNull(),
```

Reads and writes are now checked against `Preferences`, not `unknown`.

### Preserve: timestamp columns with automatic maintenance

This is correct — do not "simplify" it into per-call-site timestamp assignment. Keep `created_at` / `updated_at` handled in the schema with `$onUpdate`/`$onUpdateFn` and SQL defaults:

```ts
createdAt: integer('created_at', { mode: 'timestamp' })
  .notNull()
  .default(sql`(unixepoch())`),
updatedAt: integer('updated_at', { mode: 'timestamp' })
  .notNull()
  .$onUpdate(() => new Date()),
```

## Testing Drizzle-backed code with Vitest

### Reset through the Drizzle client, not the raw driver

**Symptom:** code reaches past Drizzle to run raw SQL on the underlying driver — `env.DB.prepare("DELETE FROM ...").run()` (D1), `pool.query("...")` (Postgres), `connection.execute("...")` (MySQL) — commonly to reset data in `beforeEach`.

**Why wrong:** it abandons the type-safe, schema-driven layer the code under test actually uses, and drifts silently from the schema — a table or column rename won't be caught. For resets it is often redundant on top of that: a harness that isolates or rolls back storage per test already gives a clean baseline, so the manual reset is dead code. (Cloudflare's `@cloudflare/vitest-pool-workers` rolls back writes automatically; other setups use a transaction-per-test or truncate helper — know which is in play before adding anything.)

**Do instead:** go through the Drizzle client. When an explicit reset is genuinely needed, `await db.delete(table)`; for schema-shaped queries, use Drizzle's query builder, never the raw driver. Drop resets that duplicate what the harness already isolates.

### Preserve: apply real migrations via first-party tooling

This is correct — keep it. Build the test database by running the actual migration chain (the same SQL production applies), not a hand-rolled `CREATE TABLE` setup that can drift from it:

- **Cloudflare D1:** `@cloudflare/vitest-pool-workers` — `readD1Migrations()` (from `@cloudflare/vitest-pool-workers/config`, in Node) collects the migration array; `applyD1Migrations(db, migrations, migrationTableName?)` applies it in setup.
- **Node drivers (Postgres/MySQL/SQLite/LibSQL):** Drizzle's own `migrate()` helper from the matching `drizzle-orm/<driver>/migrator` against the migrations folder.

Do not replace first-party migration application with ad-hoc schema creation.

### Don't test the schema itself

**Symptom:** under a TDD workflow, the agent writes tests asserting "column X exists", "table has these fields", or that Drizzle maps a row the way Drizzle documents.

**Why wrong:** the schema is declarative configuration, not behavior. Asserting the column exists tests the framework and restates the schema. This is exactly what the [[tdd]] skill's test-necessity gate rejects — no behavior is being driven out.

**Do instead:** test behavior *built on* the schema — a query function, a validation rule, a migration's data effect, a constraint that must reject bad input. Let the type checker and `drizzle-kit` guard schema correctness.

## Completion Criterion

The change satisfies all of:
- Schema changes are accompanied by `drizzle-kit generate` output (SQL + updated `drizzle/meta/` snapshot), with no from-scratch hand-written migration.
- Every JSON column carries a concrete `.$type<T>()`, not a bare `Record<>`.
- Existing timestamp automation is preserved, not replaced.
- No test runs schema-shaped SQL through the raw driver; resets go through the Drizzle client, and resets duplicating the harness's storage isolation are removed.
- Tests apply the real migration chain via first-party tooling.
- No test asserts schema structure for its own sake; schema-dependent tests assert behavior.
