#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MAX_QUERY_CHARS = 20_000;
const DEFAULT_TIMEOUT_MS = 300_000;
const VALID_REASONING = new Set(["low", "medium", "high", "xhigh"]);

class SearchError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

async function readStdin() {
  if (process.stdin.isTTY) return "";
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function run() {
  const argumentQuery = process.argv.slice(2).join(" ").trim();
  const query = argumentQuery || (await readStdin()).trim();

  if (!query) throw new SearchError("provide a research question as arguments or stdin", 2);
  if (query.length > MAX_QUERY_CHARS) {
    throw new SearchError(`query exceeds ${MAX_QUERY_CHARS} characters`, 2);
  }

  const reasoning = (process.env.CODEX_SEARCH_REASONING || "low").toLowerCase();
  if (!VALID_REASONING.has(reasoning)) {
    throw new SearchError(
      "CODEX_SEARCH_REASONING must be low, medium, high, or xhigh",
      2,
    );
  }

  const timeoutMs = Number(process.env.CODEX_SEARCH_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 3_600_000) {
    throw new SearchError(
      "CODEX_SEARCH_TIMEOUT_MS must be an integer from 1000 to 3600000",
      2,
    );
  }

  const model = process.env.CODEX_SEARCH_MODEL?.trim();
  const codexBin = process.env.CODEX_SEARCH_BIN?.trim() || "codex";
  const workDir = await mkdtemp(join(tmpdir(), "pi-codex-search-"));
  const finalMessagePath = join(workDir, "final.md");

  const researchPrompt = `Conduct live web research to answer the question below.

Requirements:
- Search the live web; do not rely only on memory.
- Prefer primary and authoritative sources. For technical questions, prioritize official documentation and original repositories or papers.
- Cross-check consequential claims when practical.
- Return a concise, self-contained answer in the same language as the question.
- Cite claims with direct Markdown links to the supporting pages, not search-result pages.
- When recency matters, state relevant publication or event dates.
- Clearly label inference, uncertainty, and unresolved conflicts.
- Do not inspect local files, run project commands, or modify anything.

Question:
${query}`;

  const args = [
    "--search",
    "exec",
    "--ephemeral",
    "--sandbox",
    "read-only",
    "--skip-git-repo-check",
    "--ignore-user-config",
    "--ignore-rules",
    "--output-last-message",
    finalMessagePath,
    "-c",
    "shell_environment_policy.inherit=none",
    "-c",
    `model_reasoning_effort=${reasoning}`,
  ];

  if (model) args.push("--model", model);
  args.push(researchPrompt);

  let stderr = "";
  let timedOut = false;

  try {
    const exitCode = await new Promise((resolve, reject) => {
      const child = spawn(codexBin, args, {
        cwd: workDir,
        env: process.env,
        stdio: ["ignore", "ignore", "pipe"],
      });

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill("SIGTERM");
        setTimeout(() => child.kill("SIGKILL"), 5_000).unref();
      }, timeoutMs);

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString("utf8");
        if (stderr.length > 16_000) stderr = stderr.slice(-16_000);
      });
      child.once("error", reject);
      child.once("close", (code, signal) => {
        clearTimeout(timer);
        resolve(code ?? (signal ? 1 : 0));
      });
    });

    if (timedOut) throw new SearchError(`timed out after ${timeoutMs} ms`);
    if (exitCode !== 0) {
      const detail = stderr.trim() || `Codex exited with status ${exitCode}`;
      throw new SearchError(detail);
    }

    const finalMessage = (await readFile(finalMessagePath, "utf8")).trim();
    if (!finalMessage) throw new SearchError("Codex completed without a final answer");
    process.stdout.write(`${finalMessage}\n`);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new SearchError(`cannot find '${codexBin}'; install Codex CLI and sign in first`);
    }
    throw error;
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

try {
  await run();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`codex-search: ${message}\n`);
  process.exitCode = error instanceof SearchError ? error.exitCode : 1;
}
