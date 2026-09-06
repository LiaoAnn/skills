---
name: devcontainer-exec
description: Use before running project commands when the project requires a Dev Container.
---

# Devcontainer Exec

Resolve the container once, then run project commands through it. **Edit on the host, execute in the container** when the source is bind-mounted. A `.devcontainer/` directory is a cue to check the project's environment policy, not a reason to run unrelated container work.

Host: file tools, `git`, `gh`, `docker`. Container: install, build, test, lint, typecheck, codegen, migrations, app run.

## Resolve and Verify

```bash
ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
docker ps --filter "label=devcontainer.local_folder=$ROOT" --format '{{.ID}}\t{{.Names}}'
```

VS Code and the devcontainer CLI set this label on the dev container, not compose sidecars. If there is no exact match, read [resolution.md](resolution.md). Multiple matches require asking, never guessing; a shared bind mount alone does not prove identity.

Inspect the selected container:

```bash
docker inspect -f '{{index .Config.Labels "devcontainer.metadata"}}' <container>
docker inspect -f '{{range .Mounts}}{{.Type}} {{.Source}} -> {{.Destination}}{{"\n"}}{{end}}' <container>
```

- **User:** explicit `remoteUser`/`containerUser` in current `devcontainer.json`; otherwise the last `remoteUser` (else `containerUser`) in the metadata fragments; otherwise `.Config.User`; otherwise root. Metadata is a JSON array or, on older containers, an object. Do not assume `.Config.User` reflects the editor's user: running as root can leave root-owned files on the host.
- **Workdir:** derive from the bind mount containing the repo: `Destination + (host_path − Source)`. Do not assume `/workspaces/<repo>` or trust an empty `.Config.WorkingDir`. Verify with `docker exec -u <user> -w <container_path> <container> ls`.
- **Volume-backed workspace:** stop and report; the host copy is not the container's source of truth.

## Execute

```bash
docker exec -i -u <user> -w <container_path> <container> bash -lc '<command>'
```

Use `-i`, never `-t` in a non-TTY tool. Pass environment variables with `-e KEY=value`, use container-relative paths, and quote the entire pipeline as one shell command. Long-running commands still run through `docker exec`.

If shell/PATH resolution fails, read [resolution.md](resolution.md#shell-and-exec-failures). Re-resolve if the container disappears or stops, not before every command.

## Lifecycle and Safety Boundaries

If none is running, or starting, creating, stopping, or removing a container is needed, read [lifecycle.md](lifecycle.md) **before acting**. Do not fall back to the host. Apply `/persistent-side-effects` to environment changes and command effects; container execution does not establish test isolation or authorize production access.

Never remove a container without approval naming that container. An `agent` ownership label is not removal authority and does not prove exclusive use; the editor may share a compose container.

## Output

Report once before the first project command:

```text
Devcontainer: <name> (<short-id>)
Workspace:    <host_path> → <container_path>
Exec:         docker exec -i -u <user> -w <container_path> <name> bash -lc '<cmd>'
```

## Completion Criterion

All project execution used a verified container, user, and workspace—or no command ran and the blocker is stated. No host fallback, ambiguous target selection, volume-backed source mismatch, or unapproved container removal occurred.
