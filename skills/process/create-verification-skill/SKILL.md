---
name: create-verification-skill
description: Generate a project-local verify skill that tells any coding agent how to run, drive, and prove behavior in this repo.
disable-model-invocation: true
---

# Create a Verification Skill

Generate `.claude/skills/verify-<repo-dir>/` inside the target repo, named after the repo's directory: how to start the system, drive it the way a user does, capture evidence, and which external services and environments it depends on. The reader is the next agent — Claude Code, Codex, Cursor — arriving cold, mid-task, having never seen the project.

## Guard

- Run from the target repo's root. If a complete `.claude/skills/verify-*` exists, stop and point to `/maintain-verification-skill`. If one exists that a previous run of this skill left **blocked**, resume it: keep what is valid and finish the missing parts.
- The skill must be tracked by git: check `git check-ignore -v .claude/skills/verify-<repo-dir>/SKILL.md`, resolving `.claude` first if it is a symlink. If it is ignored, stop and ask the user whether to un-ignore it.
- Files you may change: the generated skill directory, `AGENTS.md`, and the `@AGENTS.md` import in `CLAUDE.md` (step 5). Verification scaffolding is allowed if Cleanup removes it. Never change product code.
- Side effects outside the local environment need the user's go-ahead first: writes to shared or production data, messages to real people, applying infrastructure, and anything that costs money (say what it will cost). Reads and local runs need none.

## 1. Discover from the Repo

Answer from the codebase first; ask the user only what cannot be observed.

- **Surfaces.** What a user or caller actually touches: web UI, mobile app, CLI/TUI, HTTP/GraphQL API, worker or job, library, infrastructure. Pick the primary one; list the rest. In a monorepo, decide the scope with the user — one verify skill per app, or one root skill with a section per app.
- **Run.** The repo's own dev and build commands, with ports, env vars, auth, and how long builds take. Database migrations, seed data, and how to return to a clean state between drives. Which local config files the run reads.
- **External services.** Every system the code talks to beyond its own process — including those reached through MCP or CLI tool configuration. For each: which environment the code points at by default, how that is switched, and which operations the Guard gates.
- **Environment and drivers.** If the repo defines an execution environment (dev container, VM, nix shell, remote host), launch, drive, and capture inside it, at addresses valid there — never through ports forwarded to the host. Record which driver fits each surface, the repo's existing harness first. If a surface has no driver, propose one to the user; install driver tooling in the development environment's setup (such as a dev container's post-create step), never in product dependencies.
- **Isolation.** For anything long-running: can two instances run side by side (ports, data dirs, profiles, separate DB schema)? If not, the skill says so, and the agent refuses to double-drive a shared instance.

Anything you cannot determine — a credential, which environment is safe to touch, an account-gated feature — goes on the **Open items** list. Do not guess it.

## 2. Write the Skill

`SKILL.md` needs frontmatter (`name: verify-<repo-dir>`, a `description` naming the project, its surface, and when to reach for it — without it the skill never registers) and these sections, filled with this repo's real commands, not placeholders. Other skills read the section names **Launch**, **Doctor**, **Drive**, **Cleanup**, the feature map, and its `Where it lives` and `Driving it` headings by name: keep them exactly, and say so in the generated skill. A section that does not apply to this surface stays, with one line saying why.

- **Launch** — the exact start command, the ready signal, expected duration, and teardown. It runs the working tree's current code, including uncommitted changes, and never loads credentials or config that would trigger a side effect the Guard gates — if the repo's normal dev command would, Launch uses a safe variant. Adapt to the surface: a CLI builds once, then one isolated session per drive; a library builds the package, and Drive is a consumer script importing that build; a job runs on a sample input; infrastructure runs a plan, not an apply.
- **Doctor** — one read-only check answering "is this instance worth driving?": the running code is the current working tree, what it listens on is ours, gated credentials are not loaded, auth is valid, each external service is reachable in the intended environment. Run first, and again whenever anything looks off.
- **Drive** — the harness recipe with this repo's stable handles (ARIA labels, data attributes, routes, command names), not coordinates. Wait on observable end states, not fixed sleeps.
- **Evidence** — what to capture, saved inside the skill directory under a path its own `.gitignore` ignores and Cleanup never deletes. In this project:
  - Only the real user path counts. Name the shortcuts that do not: internal setters, test-only endpoints, debug hooks.
  - Capture the trigger, the resulting stable state, and the side effects this project produces: rows written, files changed, requests sent, a reload or restart round trip.
  - Name any dry-run or test mode and what it actually skips, observed rather than assumed.
  - Drive with throwaway data, and say which evidence files may hold secrets.
- **External services and environments** — one subsection each: what it is used for, how to reach the non-production instance, checks that serve as evidence, operations the Guard gates, and gotchas.
- **Cleanup** — tear down only what the run started, including scaffolding, by the process group or ID recorded at Launch; never kill by process name.
- **Open items** — what still needs a human: missing credentials, unconfirmed safe environments, missing drivers, unreachable features and why.

## 3. Seed the Feature Map

The map translates how people ask for work into the engineering behind it: engineers describe a change to an agent in user terms, and the map lets the agent find which feature that is, where it lives in the code, and how to prove it works.

Name who uses the system — end users, developers calling its API or library, operators — and the tasks each comes to do. Each task becomes a feature, named the way that user would name it. Then cross-check against source: inventory the user- or caller-facing entry points and confirm each belongs to some task; guards and fallbacks (auth redirects, not-found and method errors) are sub-features of the task they interrupt. The inventory finds gaps; it does not decide how the map is cut.

Create `features/README.md` — who the users are, shared preconditions, the rule that the relevant feature file defines the coverage set for a change, and an **Unmapped** list of user-visible behavior that belongs to no feature file, each with why. Then one file for each of the 3–5 tasks that matter most to users (all of them, if fewer). Each file opens with the feature's names and aliases, then has these five H2s:

- `Sub-features` — what the user can do or will see, one line each, with its source path.
- `How to get to it` — the user's path to it.
- `Where it lives` — entry points, implementing modules, data read and written, and covering tests, as source paths.
- `Driving it` — the runnable command or flow where a driver exists, and the observable end state that proves it works across the success, error, empty, and persistence paths worth checking. Each selector, message, or status code it relies on cites its source path.
- `Gotchas` — timing, flakiness, gating, prerequisites.

## 4. Prove the Generated Skill

Follow the generated skill end to end once: Launch, Doctor, drive one mapped feature, capture evidence, Cleanup. Fix whatever failed and rerun, running Cleanup after every failed attempt.

## 5. Point Other Agents at It

Add one line to the repo's `AGENTS.md` (create it if absent) naming `.claude/skills/verify-<repo-dir>/` as where to learn how to run and verify this project, and that new findings about running or verifying it are written back there, not kept in agent memory. If the repo has a `CLAUDE.md` that is a separate file (not a symlink to `AGENTS.md`), make sure it imports `@AGENTS.md`; Claude Code reads `AGENTS.md` on its own only when no `CLAUDE.md` exists.

## Output

The run ends **blocked** when the checkout does not build or start, or when no mapped feature can be driven without a missing credential or a side effect the user has not approved. Keep what was generated and record the blocker under Open items; a later run resumes it.

```markdown
- Outcome: <done / blocked — what blocked it>
- Skill: <path>
- Surfaces: <primary; others>
- External services and environments: <each, with its default environment and its gated operations>
- Features mapped: <each user task, with its aliases>
- Proof run: <feature driven> — <evidence path>, <passed / not run and why>
- Open items: <list, or "none">
```

## Completion Criterion

**Done**: every artifact from steps 2, 3, and 5 exists as specified, git does not ignore the skill, and step 4's drive passed with its evidence present after Cleanup. **Blocked**: the blocker is recorded under Open items and the Output says so. Either way, no product code changed, no scaffolding is left behind, and no gated side effect ran without the user's go-ahead.
