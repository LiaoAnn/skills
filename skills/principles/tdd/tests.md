# Good and Bad Tests

## Good Tests

**Integration-style**: test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

- Tests behavior callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test
- **Deterministic**: pin timezone, locale, and random seed so a test passes or fails the same way locally and in CI

## Bad Tests

**Implementation-detail tests**: coupled to internal structure.

```typescript
// BAD: tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags: mocking internal collaborators, testing private methods, asserting on call counts/order, test breaks on refactor without behavior change, name describes HOW not WHAT.

```typescript
// BAD: bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Declaration tests**: restate a shape instead of exercising a decision. No plausible bug flips them red — changing the declaration changes the test in lockstep. See [Is This Test Worth Writing](test-judgment.md#is-this-test-worth-writing).

```typescript
// BAD: restates the schema — a tautology, kills no mutant
const User = Schema.Struct({ name: Schema.String, age: Schema.Number });
test("User schema has a name field of type string", () => {
  expect(User.fields.name).toBeDefined();
});

// GOOD: tests behavior at the schema boundary — decode rejects bad input
test("decoding rejects a negative age", () => {
  const result = Schema.decodeUnknownEither(User)({ name: "Alice", age: -1 });
  expect(Either.isLeft(result)).toBe(true);
});

// GOOD: a transform round-trips
test("encode then decode preserves the date", () => {
  const iso = "2026-01-02T00:00:00.000Z";
  const decoded = Schema.decodeSync(DateFromString)(iso);
  expect(Schema.encodeSync(DateFromString)(decoded)).toBe(iso);
});
```

If a schema is a plain passthrough with no refinement or transform, there is no decision to catch — do not write a test for it.

The same trap dressed up as behavior — a database constraint tested directly instead of through the code that relies on it:

```typescript
// BAD: the test below subsumes it. Drop the index and the upsert's conflict
// clause has nothing to match, so the behavior test fails on the same change —
// this one buys nothing. (Note what does NOT justify skipping it: a CI drift
// check compares schema.ts to its generated output, so it never sees an index
// missing at runtime.)
test("email column is unique", async () => {
  await db.insert(users).values({ email: "a@example.com" });
  await expect(db.insert(users).values({ email: "a@example.com" })).rejects.toThrow();
});

// GOOD: tests the application behavior that depends on that index
test("registering an existing email updates the profile instead of duplicating", async () => {
  await registerUser({ email: "a@example.com", name: "Alice" });
  await registerUser({ email: "a@example.com", name: "Alicia" });
  expect(await listUsers()).toEqual([expect.objectContaining({ name: "Alicia" })]);
});
```
