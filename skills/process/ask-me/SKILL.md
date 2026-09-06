---
name: ask-me
description: Choose the smallest workflow for the task.
disable-model-invocation: true
---

# Ask Me

Choose the smallest workflow that fits the situation.

A **workflow** is a path through the skills. Most coding-agent work starts with understanding, then moves through planning, implementation, and review. Bug work starts with diagnosis before planning.

## Main Flow: Change Code

Use this route when the user wants to add, modify, or remove behavior.

1. **`/plan-it`** — understand the goal, inspect the relevant code, identify affected modules, choose an approach, and define validation.
2. **`/implement-plan`** — make the agreed changes in small steps, run the appropriate checks, and keep fixing until the validation passes or a real blocker is found.
3. **`/review-change`** — use an independent review when requested or when the diff's risk warrants it.

For a clear, low-risk implementation request, use a brief inline plan and proceed without an extra approval round. Use the full planning workflow when scope, design, or risk needs a decision. Load inquiry or review skills only when they add evidence the task needs.

## Inquiry Flow: Understand Before Acting

Use **`/study-repo`** when the user asks what a repo does, how a feature is implemented, where behavior lives, or whether the repo can be used in a certain way.

If the inquiry turns into a code change, move to **`/plan-it`** after the answer is clear.

## Bug Flow: Symptom → Diagnosis → Fix

Use this route when the user reports broken, failing, confusing, slow, or unexpected behavior.

1. **`/diagnose-bug`** — restate the symptom, build or identify a reproduction path, trace the relevant code path, explain the likely root cause, and define acceptance criteria for the fix.
2. **`/plan-it`** — plan the fix once the cause and validation path are clear.
3. **`/implement-plan`** — implement the fix and run the validation loop.
4. **`/review-change`** — review from fresh context when requested or warranted by the fix's risk.

Establish the cause before editing. If the user requested a fix and the cause, scope, and validation are clear, continue through a brief plan and implementation without asking again. Stop after diagnosis when diagnosis alone was requested.

## Review Flow

Use **`/review-change`** when the work is done, there is a diff to inspect, or the user asks for review.

Prefer reviewing against a fixed point such as `main`, a branch, a commit, or a supplied diff.

## CI Failure Flow

Use **`/ci-triage`** when CI, typecheck, lint, build, or tests fail and the user needs to know whether the current change caused it.

Classify failures before fixing them: introduced by this change, pre-existing, infrastructure/environmental, flaky, or unknown. Apply only low-risk bounded fixes inside `/ci-triage`; use `/implement-plan` for non-mechanical code changes and `/diagnose-bug` for product behavior bugs.

## Instruction File Flow

Use **`/agent-instruction-files`** when a fact is about to be written into `AGENTS.md`, `CLAUDE.md`, or an equivalent, or when such a file has grown long, repetitive, or stale and needs a pass against the code.

## Context Hygiene

Keep planning and implementation connected while the plan is still active. When reviewing, prefer a fresh context or subagent so the reviewer is not anchored by the implementer's reasoning.

If work must continue later, provide a short conversational handoff with goal, current state, validation, and remaining risks. Persist a handoff file only under `/persistent-side-effects` approval.
