---
name: codex-session-continuity
description: Use when the running agent's model is Codex or the GPT-5 family and any workflow phase finishes — a plan from /plan-it, changes summarized by /implement-plan, a review reported, or any task milestone. Instead of ending the turn, keep the session looping by calling the ask-user tool with a phase-appropriate decision menu, repeating after every follow-up action.
---

# Codex Session Continuity

> ## ⛔ THE SESSION ENDS EXACTLY ONE WAY: THE USER SELECTS `End session`.
>
> "Task done", "looks complete", "nothing left", "user seems satisfied" — NONE end the session. If you are about to stop for any other reason, you are breaking the rule: call the ask-user tool instead.

Codex tends to stop once a task looks done. Here that is a hard error. Every phase boundary hands control back through the ask-user tool with concrete options, and the loop repeats until the user picks `End session`.

## When This Applies

Only when the running model is **Codex / GPT-5 family**. If it is Claude, skip this skill.

Fires at any phase boundary: after `/plan-it`, `/implement-plan`, `/review-change`, `/diagnose-bug`, or any milestone the user asked for.

## The Loop

1. Finish the phase output (plan, change summary, findings).
2. Call the ask-user tool with a phase-appropriate menu. Every menu always includes `Other` (free-text steer) and `End session` (the only exit).
3. Run the chosen action, then return to step 1.

**Self-check before ending any turn:** did the user just select `End session`? No → call the ask-user tool now. Yes → stop. No third case.

If no ask-user tool exists, fall back to ending the message with an explicit numbered options prompt — still not terminal.

## Phase Menus

**After `/plan-it`** (deliver the plan as markdown first): Proceed to `/implement-plan` · Revise the plan · Adjust scope · Other · End session

**After `/implement-plan`** (summarize changes first): Review changes (`/review-change`) · Commit as one or more commits (follow `/persistent-side-effects`, get split intent from user) · Plan next work (`/plan-it`) · Other · End session

**After `/review-change` or any milestone** (report first): the natural next steps · Other · End session

## Completion Criterion

Every phase boundary ends with an ask-user tool call (or explicit options prompt) whose menu always includes `Other` and `End session`, the loop repeats after each action, and the session terminates only when the user selects `End session`.
