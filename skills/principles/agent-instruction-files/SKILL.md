---
name: agent-instruction-files
description: Placement rules for agent instruction files (AGENTS.md, CLAUDE.md, .cursorrules, .github/copilot-instructions.md) and their relationship to code comments. Use when deciding whether a fact belongs in one of those files or in a comment next to the code, before adding or expanding a paragraph in one, or when such a file has grown long, repetitive, or stale.
---

# Agent Instruction Files

An instruction file carries only what an agent must know **before opening any file**. Everything that explains a specific line belongs next to that line.

## Why It Accumulates

Writing to the instruction file is always the cheaper move. The right comment location has to be found; the instruction file is a single known path that appends cleanly and never conflicts with surrounding code. Any agent will take that path, and nothing pushes back — type checkers and dead-code tools catch unused symbols, never a repeated paragraph.

The cost arrives later. A duplicated explanation has two copies and only one of them moves when the code moves, so the instruction file drifts first — usually into a wrong path or a renamed symbol. A comment cannot drift, because it travels with the code it describes.

## Apply the Placement Test

Answer three yes/no questions about the paragraph.

1. **Is there a single file that could carry this as a comment, and would an agent open that file while doing the work the paragraph concerns?** Both halves must hold to answer yes. Answer **no** when no single file owns the fact, when the agent needs it before it knows which file to open, or when the owning file cannot carry a comment at all — a lockfile, a manifest without comment syntax, a generated artifact, a binary.
2. **Is it a prohibition rather than an explanation?** "Never translate between protocols" is a prohibition: an agent must know it before choosing an approach, and choosing an approach happens before any file is opened. "This request is form-encoded because the endpoint rejects JSON" is an explanation.
3. **Does seeing it require two or more files?** Directory conventions, cross-module invariants, dispatch maps, and the testing strategy qualify. Anything visible in one file does not.

Then apply the answers directly:

- **No to 1, and yes to 2 or 3** → the instruction file, in full.
- **Yes to 1, and no to 2** → a comment. Delete it from the instruction file; the code already carries it.
- **Yes to 1, and yes to 2** → split. The prohibition goes in the instruction file as one line; its reasoning goes in the comment and nowhere else. This is the only paragraph the file may hold that answers yes to question 1.
- **No to 1, 2, and 3** → neither. It is background, not an instruction. Project documentation is its home if it has one.

Build commands, the package manager, and required local setup answer **no** to question 1 even though a manifest or lockfile records them: the agent needs them before it opens anything, and those files cannot carry a comment. They stay.

For what a comment may and may not contain once content lands there, use `/engineering-quality`.

## Keep Only These Categories

- How to run things: install, build, test, a single test, typecheck, lint, dead-code, codegen, migrations.
- Environment traps: broken global tools, package manager choice, required local setup, generated files that must not be hand-edited.
- Layout and placement conventions: where a new file goes, what does not exist by design.
- Invariants stated as prohibitions, with the consequence but not the implementation.
- Cross-file maps: routing tables, ownership of data, secret storage locations.
- Testing strategy: what each layer can and cannot reach, and why.

## Write Pointers, Not Copies

Naming a path, symbol, or version is not the problem — several categories above cannot be written without one. Restating what lives at that path is. A paragraph the test admits is written in full **unless** a comment at that path already explains it; then it collapses to a pointer. A paragraph the test does not admit is deleted outright — an existing comment makes it redundant, not pointer-worthy.

A pointer has exactly three parts: the location, the reason it needs care, and the instruction to read the comments there first. A copy is the paragraph those comments already contain — the interface shape, the specific values, the sequence of steps.

A pointer stays correct when the explanation changes. A copy does not, and nothing will tell you it went stale.

## Auditing an Existing File

A file that has grown long is fixed by comparing it against the code, not by compressing its prose. Run the test over every paragraph, and observe four rules the test alone does not give you:

- **Look for the comment, not just the file header.** A paragraph that names no file is the most likely duplicate, not the least — search the repo for its distinctive terms before treating it as original, and check inline comments, not only headers.
- **Deleting and pointing are different outcomes.** Both leave a paragraph the code already explains, but only one leaves a line behind. A pointer is right when the test still admits the paragraph — the agent must be warned before it opens anything. Otherwise delete outright. A file rewritten entirely as pointers drifts exactly like the prose it replaced.
- **Never resolve doubt by deleting.** An ambiguous paragraph stays, and is reported as an open question.
- **Write the comment before removing the paragraph.** A fact must never be absent from both places at once. When no comment carries it yet, writing that comment is part of the same change.

Report before editing: one line per paragraph leaving the file, saying what it said and either the `path:line` of the comment that already carried it or the comment being written to carry it. That list is what proves nothing load-bearing was lost. Get approval for the rewrite and the new comments together — see `/persistent-side-effects`.

If the pass turns up work larger than adding comments, that is a code change. Hand off to `/plan-it`.

## Completion Criterion

For every paragraph decided: it sits where the test sends it; a split's reasoning appears in the comment and not in the file; every path, symbol, or version it names resolves and is not followed by a restatement of what lives there; and nothing was removed without a comment — existing or written in the same change — that carries it.

Deciding one paragraph settles that paragraph. A whole file is settled once every paragraph has been decided or reported as an open question and left in place, and the report lists every paragraph that left the file.
