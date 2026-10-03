---
name: sync-skills
description: Sync global skills installed with the skills.sh CLI with their sources, updating, installing new ones, and removing deleted ones.
disable-model-invocation: true
---

# Sync Skills

`npx skills update -g` updates changed skills and warns about skills deleted upstream, but run non-interactively (as an agent does) it skips the deletion. It also never installs skills a source added later. This skill does both, installing and removing only what the user picks.

## Rules

- Change installs only through `npx -y skills update` / `add` / `remove`. Never `rm` skill directories or edit `~/.agents/.skill-lock.json`.
- Skills whose `source` in `npx -y skills ls -g --json` is `local` or `null`, and anything that command does not list (such as `~/.claude/skills/synced/`), are out of scope.
- Install or remove only what the user picked in this run.

## Workflow

1. **Update.** Run `npx -y skills update -g -y 2>&1 | sed 's/\x1b\[[0-9;]*m//g'`. Record the updated skills, any source it "Failed to check", and each list under "appear to have been deleted upstream".
2. **Find new skills.** For each in-scope source, run `npx -y skills add <source> -l 2>&1 | sed 's/\x1b\[[0-9;]*m//g'` (`--json` does not work with `-l`) and read the names under "Available Skills". Names not in `ls -g` are new.
3. **Ask.** If there are new or deleted skills, ask once with AskUserQuestion: one multi-select question listing new skills as `<name> (<source>)` to install, and one listing deleted skills to remove; mark "all of them" as the recommended choice for removals. Otherwise skip to step 6.
4. **Install.** Per source: `npx -y skills add <source> -g -s <name>... -y`. A failure for an agent the CLI says does not support global installs is not a failure of the skill.
5. **Remove.** `npx -y skills remove -g <name>... -y`.
6. **Verify.** Run `npx -y skills ls -g --json`: every picked skill is installed and no removed skill appears.

## Output

```
Updated:   <name>, ... | none
Installed: <name>, ... | none
Removed:   <name>, ... | none
Skipped:   <name> (<source>), ... | none   # new or deleted, not picked
Failed:    <source> — <error> | none
```

Mention that running agents need a new session to load the changes.

## Completion Criterion

Done when `npx -y skills update -g -y` has run, every skill the user picked to install appears in `npx -y skills ls -g --json`, no confirmed-removed skill appears in `npx -y skills ls -g --json`, and the output above was given.
