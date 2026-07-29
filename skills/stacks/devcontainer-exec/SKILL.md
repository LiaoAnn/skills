---
name: devcontainer-exec
description: Use when a project is developed inside a Dev Container — the repo has a `.devcontainer/` directory, or CLAUDE.md/AGENTS.md states the project runs in a devcontainer — and any install, build, test, lint, typecheck, script, or app-run command must execute inside the container rather than on the host.
---

# Devcontainer Exec

Resolve the container once, then run every project command through it. **Edit on the host, execute in the container** — files are bind-mounted.

Host: file tools, `git`, `gh`, `docker`. Container: install, build, test, lint, typecheck, codegen, migrations, app run.

## Process

### 1. Resolve the Container

```bash
ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
docker ps --filter "label=devcontainer.local_folder=$ROOT" --format '{{.ID}}\t{{.Names}}'
```

VS Code and the `devcontainer` CLI set `devcontainer.local_folder` on the dev container only — compose sidecars (`postgres`, `redis`) have it empty.

If empty, in order:

1. Retry with `$(pwd -P)` and `$(pwd)` — symlinks and subdirectories defeat exact match.
2. Agent-created containers use a different key: `--filter label=devcontainer.owner=agent --filter label=agent.workspace_folder=$ROOT`.
3. Scan `docker ps --format '{{.ID}}\t{{.Names}}\t{{.Label "devcontainer.local_folder"}}\t{{.Label "devcontainer.config_file"}}'` and accept an ancestor/descendant `local_folder`, or a `config_file` inside `$ROOT`.
4. Unlabeled containers (manual `docker compose up`) are findable only by bind mount — but devcontainer compose files often mount the *parent* dir (`../..:/workspaces`), so one project's container mounts every sibling. Confirm with the user; never auto-select.
5. Still nothing → check `docker context ls` for another daemon. A non-default current context (`orbstack`, `colima`, remote) is usually correct, not a fault; only look elsewhere when `docker ps` errors or another context plausibly owns the workspace.

More than one match — including an agent container and an editor container for the same `$ROOT` — is an ask, not a guess.

### 2. Resolve User and Workdir

```bash
docker inspect -f '{{index .Config.Labels "devcontainer.metadata"}}' <container>
docker inspect -f '{{range .Mounts}}{{.Type}} {{.Source}} -> {{.Destination}}{{"\n"}}{{end}}' <container>
```

**User** — in precedence order: an explicit `remoteUser`/`containerUser` in the current `devcontainer.json` (newer than the container if the config changed since build); else the **last** `remoteUser` (else `containerUser`) in the `devcontainer.metadata` label — a JSON array of merged config fragments, or a bare object on older containers; else `.Config.User`; else root. Never stop at `.Config.User`: the effective user usually comes from image or feature metadata, so a container reporting `root` commonly wants `vscode` or `node`, and running as root writes root-owned files into the host mount.

**Workdir** — `.Config.WorkingDir` is often empty, and `/workspaces/<repo-name>` is not a safe assumption. Derive from the bind mount containing the repo: `container_path = Destination + (host_path − Source)`. Verify with `docker exec -u <user> -w <container_path> <container> ls` — a wrong path fails loudly.

If the workspace resolves through a `volume` rather than a `bind`, the host copy is not the container's source of truth — stop and report.

### 3. Exec

```bash
docker exec -i -u <user> -w <container_path> <container> bash -lc '<command>'
```

- `-lc` — login shell, or profile PATH (nvm, pnpm, mise) is missing and commands "don't exist". If a tool is installed but still not found, retry with `-lic`: `~/.local/bin` (pipx, uv, poetry) is only added by an interactive shell. Ignore the `no job control in this shell` warning on stderr. Minimal images (Alpine) may have no `bash` — fall back to `sh -lc`.
- `-i`, never `-t` — with no TTY, `-t` fails outright with `cannot attach stdin to a TTY-enabled container`. That error means the flag, not a broken container.
- Env via `-e KEY=value`. One quoted `bash -lc` string per command; don't split a pipeline across args.
- Container-relative paths only. Long-running commands go in a background Bash call, still via `docker exec`.

### 4. No Container Running

1. **Stopped one exists** (`docker ps -a`, same filters). If it carries `com.docker.compose.project`, start the whole project — `docker compose -p <project> start` — or the app comes up with its database unreachable. Otherwise `docker start <container>`. Either path skips `postStartCommand`/`postAttachCommand`, so if `devcontainer.json` defines them, run them yourself after starting or restart through `devcontainer up` instead. Reversible; the editor reattaches later. Prefer this over creating anything.
2. **Create an agent-owned one.** Persistent side effect — approve per `/persistent-side-effects`, then:

```bash
npx --yes @devcontainers/cli up --workspace-folder "$ROOT" \
  --id-label agent.workspace_folder="$ROOT" --id-label devcontainer.owner=agent
```

3. **Raw `docker compose up -d`** — last resort; skips features and `postCreateCommand`, so the container comes up missing tools. Say so if proposing it.

Never fall back to the host because the container is down. Host toolchains differ; a green result there proves nothing.

### 5. Teardown

**Never remove a container without asking for that specific container by name.** The `devcontainer.owner=agent` label annotates the report; it does not authorize removal.

The label is not proof of sole ownership. For a **compose** devcontainer the CLI resolves containers by compose project + service — a name derived from the folder path — so the editor will attach to a container the agent created, `--id-label` notwithstanding. Removing an "agent-owned" compose container can therefore kill the user's live session.

For an image/Dockerfile devcontainer the id-labels do isolate, at the cost of a second container on the same bind mount: two `node_modules` writers, two `postCreateCommand` runs, and a port clash if `appPort`/`forwardPorts` binds a fixed host port. Once an editor container appears for the same `$ROOT`, stop the agent-owned one.

Default teardown is `stop`, not `rm`. Leaving a container running at session end is correct.

## Output

Report once, before the first command:

```
Devcontainer: <name> (<short-id>)
Workspace:    <host_path> → <container_path>
Exec:         docker exec -i -u <user> -w <container_path> <name> bash -lc '<cmd>'
```

Re-resolve only on "No such container" / "is not running".

## Project Declaration

```markdown
## Environment

This project runs in a Dev Container. Use the `devcontainer-exec` skill to
resolve the container and run all install/build/test/lint/run commands inside
it. Edit files on the host.
```

## Completion Criterion

Every install, build, test, lint, typecheck, or run command ran via `docker exec` into a container resolved by step 1 and verified by step 2 — or nothing ran and the blocker was reported (no container plus options, ambiguous match, wrong docker context, or volume-backed workspace). No project command was silently run on the host, and no container was removed without the user naming it.
