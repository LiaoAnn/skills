# Container Resolution and Exec Troubleshooting

Read when exact workspace-label lookup fails or the verified container cannot run a command. These are fallbacks, not checks to repeat on every invocation.

## No Exact Running Match

1. Retry workspace labels with `$(pwd -P)` and `$(pwd)`; symlinks and subdirectories defeat exact matching.
2. Check agent-created containers with `--filter label=devcontainer.owner=agent --filter label=agent.workspace_folder="$ROOT"`.
3. Inspect workspace/config labels:

   ```bash
   docker ps --format '{{.ID}}\t{{.Names}}\t{{.Label "devcontainer.local_folder"}}\t{{.Label "devcontainer.config_file"}}'
   ```

   Check candidates whose workspace label is an ancestor/descendant or whose config file is inside the repo. Verify which actually serves this workspace; do not choose among multiple plausible matches.
4. Unlabeled containers from manual compose startup require inspecting bind mounts. A mount such as `../..:/workspaces` includes siblings too; confirm with the user rather than auto-selecting.
5. Look at `docker context ls` only if `docker ps` fails or another daemon plausibly owns the workspace. A non-default current context such as OrbStack, Colima, or a remote daemon is not itself a fault.

If only stopped containers exist or a new one is needed, read [lifecycle.md](lifecycle.md). Return to [SKILL.md](SKILL.md#resolve-and-verify) to verify user and workdir after finding a target.

## Shell and Exec Failures

- `bash -lc` loads login-profile PATH for tools such as nvm, pnpm, or mise. If an installed tool is still absent, retry `bash -lic`; some profiles add pipx/uv/poetry paths only interactively. The resulting `no job control in this shell` warning is harmless.
- Minimal images may lack Bash. Use `sh -lc` instead.
- `cannot attach stdin to a TTY-enabled container` means remove `-t`; it is not evidence the container is broken.
- `No such container` or `is not running` requires re-resolution, not host execution.
