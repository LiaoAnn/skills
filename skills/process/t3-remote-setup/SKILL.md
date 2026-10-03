---
name: t3-remote-setup
description: Prepare a remote SSH host so the T3 Code desktop app can add it as an SSH environment on the first try.
argument-hint: "<ssh-host-or-alias>"
disable-model-invocation: true
---

# T3 Remote Setup

Prepare `$ARGUMENTS` (an SSH host or alias) so the user can open **Settings → Connections → Add environment → SSH** in the T3 Code desktop app and connect once, with the right name, without reconnecting.

## Principles

- **The desktop app owns the server.** Never start `t3 serve` yourself. A server you start is adopted as `managed=external`: the app will not restart or clean it up, and removing the environment leaves it running. The app downloads a server matching the client version to `~/.t3/runtime` and launches it on first connect.
- **Name before connect.** The server reads its environment label only at startup. Set the name before the user adds the environment, so no restart or reconnect is needed.
- **Leave no SSH connections behind.** Run every remote command as one short-lived `ssh` call. Never use `ssh -f`, `-L`, `-N`, `nohup` through SSH, or ControlMaster. Never pipe a background SSH into another command. Pass `-o ControlMaster=no -o ControlPath=none -o BatchMode=yes -o ConnectTimeout=15` on every call.
- **Kill only by PID.** Never use `pkill`, or `pgrep | kill`. Stop a process only by a PID you just read and showed the user, and only after the user agrees.
- Some SSH wrappers, such as Coder, print version-mismatch notices on stderr. Mention a notice once, then filter it out of later output.
- Talk to the user in their language.

## Workflow

### 1. Resolve inputs

If `$ARGUMENTS` is empty, ask for the SSH host. Then use AskUserQuestion to ask, in one call:

- **Environment name.** The label T3 Code shows for this environment. Offer the current hostname, which you get in step 2, as one option; the user may type their own.
- **Install the `t3` CLI.** Recommended: it provides `t3 pair`, `t3 connect`, and `t3 update` on the host. The SSH environment works without it. If preflight finds it already installed, show its version and offer **Keep as is** (recommended) or **Update to latest** instead.

Ask only for the host first if it is missing, run step 2, then ask the rest, so the questions can show the current name and CLI version. Running this skill again on a host that is already set up is supported: steps that are already satisfied are skipped, not redone.

### 2. Preflight (one SSH call)

```bash
ssh <opts> <host> 'uname -sm; id -un; hostname; cat /etc/machine-info 2>/dev/null; command -v curl wget tar sha256sum shasum sudo; ls ~/.t3/ssh-launch 2>/dev/null; cat ~/.t3/ssh-launch/*/managed 2>/dev/null; ~/.local/bin/t3 --version 2>/dev/null; ps -eo pid,etime,args 2>/dev/null | grep "[t]3 serve"'
```

Check:

- **Platform.** It must be Linux (x86_64 or arm64) or macOS on arm64. Stop on anything else; Intel Macs cannot host the prebuilt server.
- **Download tools.** `curl` or `wget`, plus `tar`, plus `sha256sum` or `shasum`. Report anything missing and stop.
- **Current name.** Note the current label: `PRETTY_HOSTNAME` if set, otherwise the hostname.
- **Existing server.** If a `t3 serve` is running, check `~/.t3/ssh-launch/*/managed`. If it is `external`, or there is no launch record, it was started by hand. Show the PID and its command line, and ask whether to stop it so the app can manage its own server. If the value is `managed`, the app already owns the server. Leave it alone unless the name changes in step 3.

### 3. Set the environment name

If the chosen name equals the current label, skip this step entirely: no write, no restart, no reconnect.

The server label resolves in this order: Linux `/etc/machine-info` `PRETTY_HOSTNAME`, then `hostnamectl --pretty`, then the system hostname. On macOS it uses `scutil --get ComputerName`. See `apps/server/src/environment/ServerEnvironmentLabel.ts` in the t3code repo.

- **Linux.** Write only the display name, not the system hostname. Keep other keys already in the file:
  ```bash
  ssh <opts> <host> 'f=/etc/machine-info; S=; [ "$(id -u)" = 0 ] || S="sudo -n"; { grep -v "^PRETTY_HOSTNAME=" "$f" 2>/dev/null; echo "PRETTY_HOSTNAME=\"<name>\""; } > /tmp/mi.$$ && $S cp /tmp/mi.$$ "$f" && rm /tmp/mi.$$ && cat "$f"'
  ```
  If the user is not root and passwordless `sudo` fails, give the user the command to run themselves; do not prompt for a password over SSH.
- **macOS.** `scutil --set ComputerName` renames the whole Mac, so confirm with the user first, and it needs `sudo`.
- **Containers.** In Coder, Docker, or devcontainers, `/etc` is often reset when the workspace is rebuilt. Tell the user the name may revert. To keep it, add the same write to the workspace startup script.

If the user chose to stop an existing server in step 2, stop it now by its PID, then confirm that `ps` no longer shows it.

If the name changed while an app-managed server is running, it keeps the old label until it restarts. Ask whether to stop it by PID now. If the user agrees, tell them to reconnect the environment once in the app; if they decline, the new name appears the next time the app launches the server.

### 4. Install the `t3` CLI (if chosen)

Skip this step if the CLI is installed and the user chose **Keep as is**. For **Update to latest**, run `~/.local/bin/t3 update --yes` instead of the installer.

```bash
ssh <opts> <host> 'curl -fsSL https://t3.codes/install.sh | sh && ~/.local/bin/t3 --version'
```

Use `wget -qO-` if `curl` is missing. Do not run `t3`, `t3 serve`, or `t3 service install` afterwards. A version mismatch with the desktop app is fine, because the app launches its own matching runtime.

### 5. Check providers

```bash
ssh <opts> <host> 'sh -lc "for c in claude codex cursor-agent opencode grok gemini; do printf \"%s: \" \$c; command -v \$c || echo missing; done"'
```

The app runs providers from a non-interactive login shell, so this check uses `sh -lc` to match it. Report which providers were found. Do not install or log in to providers for the user: credentials are theirs. Mention that each provider CLI must be signed in on the host.

### 6. Verify that no SSH connections were left open

```bash
ps -axo pid,etime,command | grep -E "[s]sh .*<host>"
```

Anything listed that this skill started is a bug: report it. Leave connections owned by the desktop app (they include `-L <port>:127.0.0.1:...` with `ServerAliveInterval`) and the user's own sessions alone.

### 7. Hand off

Tell the user:

1. In the T3 Code desktop app, open **Settings → Connections → Add environment → SSH**, and enter `<host>`. The host must be the same alias that works with `ssh <host>` from this machine.
2. The first connect downloads the server to `~/.t3/runtime`, so it takes longer than later connects.
3. The environment appears as `<name>`.

After the user says they are connected, you may confirm on request: `cat ~/.t3/ssh-launch/*/managed` should print `managed`, and `ps` should show `~/.t3/runtime/versions/<ver>/t3 serve`.

End with a short summary covering: the platform, the name and whether it persists, the CLI version, which providers were found, and any server you stopped. Mark each step as done or skipped (already satisfied), and say whether the user needs to reconnect.

## Completion Criterion

Done when all of these hold, or preflight stopped on an unsupported platform or missing tool and the user was told why:

- The remote label equals the chosen name, or the user was given the command to set it themselves.
- No `t3 serve` started by hand is still running unless the user chose to keep it.
- The CLI is at the version the user chose, or was not requested.
- Step 6 lists no SSH connection started by this skill.
- The hand-off and summary were given to the user.
