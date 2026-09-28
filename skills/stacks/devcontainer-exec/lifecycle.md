# Devcontainer Lifecycle

Read before starting, creating, stopping, or removing containers. Starting, creating, stopping, or removing a container needs approval; being reversible or labeled agent-owned does not override user or harness restrictions.

## No Container Running

1. **A stopped one exists** (`docker ps -a` with the workspace filters). Prefer restarting it over creating another. If it carries `com.docker.compose.project`, start the known project with `docker compose -p <project> start` so database sidecars start too; otherwise use `docker start <container>`. Verify the compose project/config and authority before affecting its services. Either direct startup skips `postStartCommand`/`postAttachCommand`; inspect their effects before running them, or restart through `devcontainer up` when appropriate.
2. **Create an agent-owned one.** Obtain approval for the persistent environment and its lifecycle hooks, then:

   ```bash
   npx --yes @devcontainers/cli up --workspace-folder "$ROOT" \
     --id-label agent.workspace_folder="$ROOT" --id-label devcontainer.owner=agent
   ```

3. **Raw `docker compose up -d`** is a last resort. Explain that it skips features and `postCreateCommand` and may leave tools missing; obtain any required approval before running it.

Never silently use the host because the container is down. Host toolchains differ and do not validate the required environment.

## Ownership and Teardown

Never remove a container without asking for that specific container by name. Its `devcontainer.owner=agent` label is reporting metadata, not removal authority or proof of sole ownership.

For a compose devcontainer, the CLI resolves by compose project and service, with a name derived from the folder path. The editor may attach to a container the agent created despite custom labels; removing it can kill the user's live session.

Image/Dockerfile containers can be isolated by id-labels, but two containers on the same bind mount can race on `node_modules`, run duplicate `postCreateCommand` hooks, or clash on fixed host ports. If an editor container appears for the same workspace, resolve this conflict before further execution. Stop an agent container only when it is confirmed safe and within authority; otherwise ask.

When teardown is authorized, prefer `stop` to `rm`. Leaving a container running at session end is valid; do not invent cleanup authority to make the environment look tidy.

## Suggested Project Declaration

```markdown
## Environment

This project runs in a Dev Container. Use the `devcontainer-exec` skill before
project execution to resolve its container, user, and workspace. Run project
commands there; edit on the host only when the source is bind-mounted.
```

A declaration can separately authorize known-safe local tests only when their disposable fixtures and lack of production access have been established.
