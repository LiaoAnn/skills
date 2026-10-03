---
name: sync-skills
description: Sync global skills installed with the skills.sh CLI with their sources, updating, installing new ones, and removing deleted ones.
disable-model-invocation: true
---

# Sync Skills

`npx skills update -g` updates changed skills and warns about skills deleted upstream, but run non-interactively (as an agent does) it skips the deletion. It also never installs skills a source added later. This skill does both: it installs new skills automatically from sources the user tracks in full, and removes deleted ones after confirmation.

## Rules

- Change installs only through `npx -y skills update` / `add` / `remove`. Never `rm` skill directories or edit `~/.agents/.skill-lock.json`.
- Skills whose `source` in `npx -y skills ls -g --json` is `local` or `null`, and anything that command does not list (such as `~/.claude/skills/synced/`), are out of scope.
- New skills install only from sources in the tracked list. Never list or offer the uninstalled skills of other sources; the user picked from those by hand.
- Remove only after the user confirms.

## Tracked List

`~/.agents/sync-skills.json` lists the sources to install in full:

```json
{ "installAll": ["<owner>/<repo>"] }
```

If the file is missing, ask once which in-scope sources to track (AskUserQuestion multi-select when there are at most four sources, otherwise list them in text), then write the file. An empty list is valid.

## Workflow

1. **Update.** Run `npx -y skills update -g -y 2>&1 | sed 's/\x1b\[[0-9;]*m//g'`. Record the updated skills, any source it "Failed to check", and each list under "appear to have been deleted upstream".
2. **Read the tracked list**, creating it as above if missing.
3. **Install new skills.** For each tracked source, run `npx -y skills add <source> -l 2>&1 | sed 's/\x1b\[[0-9;]*m//g'` (`--json` does not work with `-l`) and read the names under "Available Skills". Install every name missing from `ls -g`: `npx -y skills add <source> -g -s <name>... -y`. A failure for an agent the CLI says does not support global installs is not a failure of the skill. If the CLI skips a skill with a parse error, report it under Failed.
4. **Confirm removals.** If step 1 reported deleted skills, ask once with AskUserQuestion: **Remove all** (recommended), **Choose individually**, **Keep all**. Otherwise skip to step 6.
5. **Remove.** `npx -y skills remove -g <name>... -y`.
6. **Verify.** Run `npx -y skills ls -g --json`: every skill installed in step 3 is listed and no removed skill appears.

## Output

```
Updated:   <name>, ... | none
Installed: <name> (<source>), ... | none
Removed:   <name>, ... | none
Kept:      <name>, ... | none
Failed:    <source or name> — <error> | none
```

Mention that running agents need a new session to load the changes.

## Completion Criterion

Done when `npx -y skills update -g -y` has run, `~/.agents/sync-skills.json` exists, every skill offered by a tracked source appears in `npx -y skills ls -g --json`, no confirmed-removed skill appears there, and the output above was given.
