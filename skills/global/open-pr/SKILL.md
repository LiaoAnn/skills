---
name: open-pr
description: Write a PR description and open the pull request. Use when the user asks to open a PR, write a PR description, or prepare a pull request for review.
---

# Open PR

Write a PR description that gives reviewers enough context to review efficiently, without requiring them to read every commit.

## Process

### 1. Determine the Scope

Identify the base branch (usually `main` or `master`) and the current branch. Read:

- All commits on the current branch since it diverged from the base.
- The full diff against the base.

### 2. Find a Template

Check for a PR template in this order:

1. `.github/PULL_REQUEST_TEMPLATE.md`
2. `.github/pull_request_template.md`
3. `.github/PULL_REQUEST_TEMPLATE/` directory

If a template exists, follow its structure exactly. Fill every section; do not delete sections unless they are explicitly marked optional and genuinely do not apply.

If no template exists, use the fallback structure below.

### 3. Fallback Template

Use this structure when no project template is found. It follows the conventions of large open-source projects:

```markdown
## Summary

<!-- One or two sentences: what this PR does and why. -->

## Changes

<!-- Bulleted list of the meaningful changes. Group related items. Skip mechanical/trivial changes unless they carry risk. -->

## Testing

<!-- How the changes were verified: unit tests, integration tests, manual steps, or reproduction of a bug fix. -->

## Risks and Notes

<!-- Anything a reviewer should watch for: behavior changes, migration requirements, known limitations, follow-up work. Omit if none. -->
```

### 4. Write the Description

Write from the reviewer's perspective. A good description answers:

- What problem does this solve or what behavior does it add?
- What is the intended approach and why?
- What should the reviewer pay most attention to?
- Is there anything tricky, incomplete, or deferred?

Do not repeat the commit list verbatim. Synthesize intent.

### 5. Open the PR

Use `gh pr create` with the written description. Set base branch explicitly.

If the branch has not been pushed, push it first.

Confirm the PR URL after creation.

## Completion Criterion

The PR is open, the description is filled according to the template or fallback structure, and the URL has been reported to the user.
