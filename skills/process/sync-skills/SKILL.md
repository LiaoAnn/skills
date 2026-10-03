---
name: sync-skills
description: Update global skills installed with the skills.sh CLI and remove those deleted from their source.
disable-model-invocation: true
---

# Sync Skills

`npx skills update -g` updates changed skills and warns about skills deleted upstream, but run non-interactively (as an agent does) it skips the deletion. This skill finishes that job with the user's consent.

## Rules

- Change installs only through `npx -y skills update` / `remove`. Never `rm` skill directories or edit `~/.agents/.skill-lock.json`.
- Skills whose `source` in `npx -y skills ls -g --json` is `local` or `null`, and anything that command does not list (such as `~/.claude/skills/synced/`), are out of scope.
- Remove only after the user confirms.

## Workflow

1. **Update.** Run `npx -y skills update -g -y 2>&1 | sed 's/\x1b\[[0-9;]*m//g'`. Record the updated skills, any source it "Failed to check", and each list under "appear to have been deleted upstream".
2. **Confirm.** If skills were reported deleted, ask once with AskUserQuestion: **Remove all** (recommended), **Choose individually**, **Keep all**. Otherwise skip to step 4.
3. **Remove.** `npx -y skills remove -g <name>... -y`.
4. **Verify.** Run `npx -y skills ls -g --json`; no removed skill may appear.

## Output

```
Updated: <name>, ... | none
Removed: <name>, ... | none
Kept:    <name>, ... | none
Failed:  <source> — <error> | none
```

Mention that running agents need a new session to load the changes.

## Completion Criterion

Done when `npx -y skills update -g -y` has run, no confirmed-removed skill appears in `npx -y skills ls -g --json`, and the output above was given.
