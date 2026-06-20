---
name: ask-me
description: Router for my global coding-agent workflows. Type /ask-me when unsure which workflow fits the situation.
disable-model-invocation: true
---

# Ask Me

Choose the smallest workflow that fits the situation.

A **workflow** is a path through the skills. Most coding-agent work starts with understanding, then moves through planning, implementation, and review. Bug work starts with diagnosis before planning.

## Main Flow: Change Code

Use this route when the user wants to add, modify, or remove behavior.

1. **`/plan-change`** — understand the goal, inspect the relevant code, identify affected modules, choose an approach, and define validation.
2. **`/implement-plan`** — make the agreed changes in small steps, run the appropriate checks, and keep fixing until the validation passes or a real blocker is found.
3. **`/review-change`** — review the finished diff from a fresh reviewer context before calling the work done.
4. **`/open-pr`** *(larger features)* — write a reviewer-friendly PR description and open the pull request.

Do not skip planning unless the user explicitly asks for a tiny direct edit.

## Inquiry Flow: Understand Before Acting

Use **`/study-repo`** when the user asks what a repo does, how a feature is implemented, where behavior lives, or whether the repo can be used in a certain way.

If the inquiry turns into a code change, move to **`/plan-change`** after the answer is clear.

## Bug Flow: Symptom → Diagnosis → Fix

Use this route when the user reports broken, failing, confusing, slow, or unexpected behavior.

1. **`/diagnose-bug`** — restate the symptom, build or identify a reproduction path, trace the relevant code path, explain the likely root cause, and define acceptance criteria for the fix.
2. **`/plan-change`** — plan the fix once the cause and validation path are clear.
3. **`/implement-plan`** — implement the fix and run the validation loop.
4. **`/review-change`** — review the diff from a fresh context.

Do not jump straight from symptom to code change unless the user explicitly asks for a speculative quick fix.

## Review Flow

Use **`/review-change`** when the work is done, there is a diff to inspect, or the user asks for review.

Prefer reviewing against a fixed point such as `main`, a branch, a commit, or a supplied diff.

## Context Hygiene

Keep planning and implementation connected while the plan is still active. When reviewing, prefer a fresh context or subagent so the reviewer is not anchored by the implementer's reasoning.

If the session is long and the work must continue later, leave a short handoff note with the goal, current state, changed files, validation commands, and remaining risks.
