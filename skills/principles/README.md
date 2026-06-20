# Principles

**Principles** skills encode cross-cutting concepts, standards, and judgment for doing work well. They are independent of any single repo, framework, package, or tool.

Process skills in `process/` reference these at the relevant step (e.g. `/implement-plan` calls `/tdd`). Stack-specific skills in `stacks/` should build on these principles, then add concrete APIs, conventions, and pitfalls for that stack.

## Skills Reference

**Model-invoked**

- **[tdd](./tdd/SKILL.md)** — Red-green-refactor in vertical slices: one test, one implementation, repeat. Test through public interfaces. Includes test quality, mocking, and refactor guidance.
- **[architecture](./architecture/SKILL.md)** — Module-boundary and dependency-hygiene principles: organize by domain, communicate through public APIs, keep the dependency graph acyclic, keep transport thin, authorize at the request boundary.
- **[engineering-quality](./engineering-quality/SKILL.md)** — Maintainable-code principles for decisions about clarity, comments, error context, small local refactors, and algorithmic shape.
