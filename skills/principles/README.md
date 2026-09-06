# Principles

**Principles** skills encode cross-cutting concepts, standards, and judgment for doing work well. They are independent of any single repo, framework, package, or tool.

Process skills in `process/` reference these at the relevant step (e.g. `/implement-plan` calls `/tdd`). Stack-specific skills in `stacks/` should build on these principles, then add concrete APIs, conventions, and pitfalls for that stack.

## Skills Reference

**Model-invoked**

- **[tdd](./tdd/SKILL.md)** — Test-first red-green-refactor in vertical slices. For test necessity or coverage without TDD, read [test judgment](./tdd/test-judgment.md) directly; it links to verification placement, quality examples, and mocking guidance.
- **[architecture](./architecture/SKILL.md)** — Module-boundary and dependency-hygiene principles: organize by domain, communicate through public APIs, keep the dependency graph acyclic, keep transport thin, authorize at the request boundary.
- **[engineering-quality](./engineering-quality/SKILL.md)** — Maintainable-code principles for decisions about clarity, comments, error context, small local refactors, and algorithmic shape.
- **[agentic-change-governance](./agentic-change-governance/SKILL.md)** — Agent authority and scope-control principles for deciding whether a change is permitted by the user, plan, and system rules.
- **[persistent-side-effects](./persistent-side-effects/SKILL.md)** — Scope-based approval contract: necessary implementation files and known-safe validation are covered; Git actions, destructive or external effects, and optional artifacts need specific approval.
- **[codebase-stewardship](./codebase-stewardship/SKILL.md)** — Codebase-coherence principles for fitting new work into existing patterns, naming, extension points, and domain vocabulary.
- **[contracts](./contracts/SKILL.md)** — Contract-design principles for APIs, schemas, events, jobs, module exports, configuration, and other cross-boundary interfaces.
- **[reviewable-change](./reviewable-change/SKILL.md)** — Diff hygiene principles for keeping behavior changes, refactors, renames, formatting, generated output, and tests separable.
- **[property-based-testing](./property-based-testing/SKILL.md)** — Property-based testing discipline for using generated inputs to search for unknown counterexamples to stated behavioral properties.
- **[agent-instruction-files](./agent-instruction-files/SKILL.md)** — Keep necessary global guidance, relocate useful local facts, and delete obsolete or unhelpful instructions with a reason. Includes placement and pointer rules for `AGENTS.md`, `CLAUDE.md`, and equivalents.
