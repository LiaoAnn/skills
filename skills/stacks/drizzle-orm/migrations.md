# Drizzle Migrations

Read when changing database structure or migration artifacts.

## Generate Migrations; Preserve the Snapshot Baseline

Change the schema, then run the project's configured `drizzle-kit generate` command, for example:

```bash
drizzle-kit generate --config drizzle.config.ts
```

Let the generator own SQL and snapshot updates in `drizzle/meta/`. A from-scratch hand-written schema migration leaves the snapshot baseline stale, so a later generation can duplicate or misrepresent the change.

Under this skill's policy, hand-edit only a generated migration for cases the differ cannot express, such as a data backfill, custom index, or tricky column move. Do not silently change this policy or the project's migration workflow to proceed.

## Verify the Right Concern

A CI check that `drizzle-kit generate` leaves the migration directory unchanged detects schema-to-snapshot drift. It does not inspect hand-edited SQL, because the differ compares against the snapshot rather than the SQL file. Review such SQL separately and test its behavior where applicable.

`drizzle-kit check` is not a replacement for this drift check: it checks generated migrations for collisions and cross-branch races, not against `schema.ts`.

For backfills or destructive changes, validate the effect on populated, representative data. Clean-database application alone does not prove data preservation; see [test judgment](../../principles/tdd/test-judgment.md).
