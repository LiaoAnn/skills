# When to Mock

Mock at **system boundaries** only: external APIs, databases (prefer a test DB), time/randomness, file system.

Don't mock your own classes/modules, internal collaborators, or anything you control.

## Designing for Mockability

**1. Dependency injection** — pass external dependencies in rather than constructing them internally:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. SDK-style interfaces over generic fetchers** — one specific function per operation, no conditional logic inside the mock:

```typescript
// GOOD: each function independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```
