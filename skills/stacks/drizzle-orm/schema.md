# Drizzle Schema Guidance

Read when changing schema definitions, JSON columns, or timestamps. For changes to database structure, also read [migrations.md](migrations.md).

## Type JSON Columns with `.$type<T>()`

A JSON column is a contract. Prefer an explicit domain type over a bare `Record<string, unknown>` or `Record<string, any>` that erases its shape:

```ts
interface Preferences { theme: 'light' | 'dark'; locale: string }

// SQLite / D1
preferences: text('preferences', { mode: 'json' }).$type<Preferences>().notNull(),
// Postgres
preferences: jsonb('preferences').$type<Preferences>().notNull(),
```

`.$type<T>()` provides compile-time read/write types, not runtime validation: existing rows and external input can still violate `T`. Use boundary validation when that risk matters.

## Preserve Automatic Timestamp Maintenance

Do not replace existing schema-level defaults or `$onUpdate`/`$onUpdateFn` with per-call-site assignments:

```ts
createdAt: integer('created_at', { mode: 'timestamp' })
  .notNull()
  .default(sql`(unixepoch())`),
updatedAt: integer('updated_at', { mode: 'timestamp' })
  .notNull()
  .$onUpdate(() => new Date()),
```

Drizzle maintains `$onUpdate` client-side; a raw driver update bypasses it. When testing this behavior, use [testing.md](testing.md) to choose caller-level or direct coverage.
