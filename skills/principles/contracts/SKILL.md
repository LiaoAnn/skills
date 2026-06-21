---
name: contracts
description: Contract-design principles for APIs, schemas, events, jobs, module exports, configuration, and other cross-boundary interfaces. Use when defining, changing, or reviewing a public interface or data shape that other code, users, services, jobs, or future versions may depend on.
---

# Contracts

Treat cross-boundary interfaces as promises that outlive the current edit.

## Identify the Contract

Before changing a boundary, name the contract and its consumers:

- HTTP, RPC, GraphQL, or CLI request and response.
- Database schema, migration output, or persisted data shape.
- Event, queue message, webhook, or background job payload.
- Public module export or package API.
- Config, environment variable, feature flag, or file format.
- UI route, URL shape, or externally visible behavior.

If callers may exist outside the current repo, assume compatibility matters.

## Classify the Change

Classify contract changes before implementation:

- **Additive**: adds optional fields, new endpoints, new enum values, or new capabilities without changing existing meaning.
- **Narrowing**: rejects inputs, removes states, tightens validation, or reduces accepted behavior.
- **Breaking**: removes, renames, retypes, reorders, or changes the meaning of existing fields or behavior.
- **Semantic**: keeps the shape but changes observable meaning.

Additive changes are usually safest. Narrowing, breaking, and semantic changes require an explicit migration or compatibility plan.

## Preserve Compatibility

Prefer compatibility-preserving paths:

- Add before removing.
- Read old and new shapes during migration windows.
- Write new shape only after old readers are gone.
- Version externally consumed APIs when behavior cannot remain compatible.
- Keep unknown fields tolerated unless strictness is part of the contract.
- Document defaults and absent-field behavior.

Do not update only the producer or only the consumer unless the other side is proven unaffected.

## Test the Boundary

Validate contracts at the boundary where consumers observe them:

- Contract tests for public APIs and events.
- Migration tests for persisted data.
- Round-trip tests for encode/decode or import/export.
- Compatibility fixtures for old payloads or schemas.
- Type or schema checks where the toolchain supports them.

Internal unit tests are not enough to prove a contract remains compatible.

## Completion Criterion

The contract is named, consumers are considered, the change is classified, compatibility or migration handling is explicit for narrowing/breaking/semantic changes, both producer and consumer impact are checked, and validation covers the boundary observable by dependents.
