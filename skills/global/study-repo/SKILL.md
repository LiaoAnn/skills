---
name: study-repo
description: Study a repository or code path to answer how it works, what it does, how a feature is implemented, or whether the user can use it in a specific way. Also use to investigate an external package's source code to understand its behavior, limitations, or bug causes. Use for repo understanding before planning or coding.
---

# Study Repo

Answer questions by reading the codebase, not by guessing from filenames.

## Process

### 1. Classify the Question

Identify which kind of answer the user needs:

- **System overview** — what the repo does and how it is organized.
- **Feature trace** — how a specific behavior is implemented.
- **Usage check** — whether the user can use an API, command, package, component, or pattern in a certain way.
- **Change readiness** — what must be understood before planning a change.

State the classification briefly.

### 2. Find the Anchors

Read the smallest set of primary sources that can answer the question:

1. Repo-level docs and package/config files for orientation.
2. Entry points, routes, commands, public exports, or tests related to the question.
3. Definitions and call sites for the relevant functions, types, components, or modules.
4. Existing tests or examples that show intended behavior.

Prefer semantic navigation and fast search. Treat docs as helpful, but verify behavior against code when possible.

### 3. Trace the Path

For feature questions, follow the behavior from the public entry point inward until the important state changes, IO, or domain decisions are visible.

For usage questions, verify:

- The public interface the user would call.
- Required inputs, configuration, ordering, or environment.
- Error modes and unsupported cases.
- Existing tests, examples, or docs that confirm the usage.

### 4. Separate Certainty Levels

Keep the answer honest:

- **Facts** — directly supported by code, tests, docs, or command output.
- **Inferences** — likely conclusions from structure or naming.
- **Unknowns** — things not proven from available sources.

Do not present an inference as a fact.

## Output

Return a concise answer with:

- **Short answer** — the direct answer first.
- **How it works** — the important path through the repo.
- **Code references** — files and symbols that support the answer.
- **Caveats** — unsupported cases, unknowns, or assumptions.
- **Next step** — if this should become a code change, recommend `/plan-change`.

## Completion Criterion

The study is complete when the user can tell:

- Where the relevant behavior lives.
- How the main flow works.
- What evidence supports the answer.
- What remains uncertain, if anything.
