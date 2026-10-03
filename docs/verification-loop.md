# Verification Loop

Why the process skills demand real-system evidence and per-project verify skills.

## Findings (transcript audit, 2026-09-28)

Four projects, last 30 days:

- About 11 tasks were reported done on unit tests, typecheck, or dead-code checks alone and then failed the user's real check (browser, real CLI run, container restart, mounted volume). UI work got about one browser check across roughly ten tasks.
- Real change→verify loops happened only when done was stated in real-system terms and the agent drove the real system.
- Commits were cut only when the user said "commit"; branches grew to hundreds of files.
- Model-invoked guardrail skills never fired. Only user slash commands drove the skill set: `plan-it`, `implement-plan`, `review-change`, `tdd`, `devcontainer-exec`.
- Reviewer findings were relayed without being verified. An agent made unguarded writes to live provider endpoints.

## Decisions

- Make one agent trustworthy before going multi-agent: go deep first, then parallelize.
- Put evidence and slicing requirements into the skills that actually fire, not into principles that never trigger.
- Each project owns a verify skill. See the "Project Knowledge Lives in the Project" rule in [CLAUDE.md](../CLAUDE.md).
