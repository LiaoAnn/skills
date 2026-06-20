# Techniques

**Practice** skills — they encode *how to do a kind of work well*, independent of any single repo or stack. Process skills in `global/` reference these at the relevant step (e.g. `/implement-plan` calls `/tdd`).

Cross-cutting craft lives here; practices tied to a specific stack or repo live in `domain/`.

## Skills Reference

**Model-invoked**

- **[tdd](./tdd/SKILL.md)** — Red-green-refactor in vertical slices: one test, one implementation, repeat. Test through public interfaces. Includes test quality, mocking, and refactor guidance.
- **[architecture](./architecture/SKILL.md)** — Module-boundary and dependency-hygiene principles: organize by domain, communicate through public APIs, keep the dependency graph acyclic, authorize at the request boundary.
