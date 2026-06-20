---
name: architecture
description: Module-boundary and dependency-hygiene principles for organizing a codebase. Use when placing new files, deciding where logic belongs, adding cross-module imports, or reviewing whether a change respects existing boundaries.
---

# Architecture

Principles for keeping a codebase navigable as it grows. Apply against the project's own conventions — these are defaults, not overrides for a repo that already has a documented structure.

## Organize by Domain, Not by Layer

Group code by the capability it serves, so one feature can be understood by exploring one area:

```
features/
  bookings/      ← services, data access, UI, tests for bookings
  availability/  ← services, data access, UI, tests for availability
```

Avoid top-level technical layers (`controllers/`, `services/`, `repositories/`) when they scatter one domain change across many directories. Local technical subfolders inside a feature are fine when they make that feature easier to navigate.

## Communicate Through Public APIs

A feature imports another feature only through its public entry point, never by reaching into internal files:

```typescript
// ❌ reaching into internals
import { calculateSlots } from "features/availability/services/internal/slotCalculator";

// ✅ through the public API
import { getAvailability } from "features/availability";
```

Put domain-agnostic utilities (logging, auth, generic helpers) in a shared low-level module; put shared UI primitives in a shared UI module. Enforce import boundaries with lint rules where the toolchain allows.

## Keep the Dependency Graph Acyclic

Dependencies should flow one direction, from lower-level shared code toward higher-level application entry points:

```
shared utils → shared domain modules → features → transport/API → app entry
```

Lower layers must not import higher ones. A utility that imports a feature, or two features that import each other, is a cycle — it causes build failures, type errors, and a structure that no longer reflects what depends on what. Break cycles by extracting the shared piece downward.

## Keep Transport Thin

HTTP handlers, RPC routers, CLI commands, queue consumers, and UI event handlers are delivery mechanisms. They should validate input, adapt it into application data, call the domain/application code, and adapt the result back out.

Do not let a transport boundary become the place where business decisions, persistence details, or complex orchestration accumulate. If the same behavior would be needed from another transport, move it behind a domain-facing interface.

## Place Authorization on the Request Path

This is a placement decision like the rest of this skill: a guard belongs at the boundary it actually protects, not one level out where coverage is assumed but not guaranteed.

Put the authorization check on the path every request provably passes — the handler that guards the resource itself. A shared outer shell (an inherited layout, a wrapping decorator, a middleware some entry points skip) is bypassable whenever a request can reach the protected resource without traversing it. Validate identity and role **before** any restricted data is read, and fail closed: deny by default, redirect or return early for the unauthorized.

## Completion Criterion

The change respects existing boundaries: new files sit with the capability they serve, cross-module imports go through public entry points, no import introduces a cycle or points from a lower layer to a higher one, transport code stays thin, and any authorization check sits on the protected request path rather than in a bypassable wrapper. A single violation means it is not met.
