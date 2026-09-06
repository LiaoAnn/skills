---
name: agent-instruction-files
description: Use when adding, relocating, or pruning guidance in agent instruction files such as AGENTS.md or CLAUDE.md.
---

# Agent Instruction Files

An instruction file carries only what an agent must know **before opening any file**. Everything that explains a specific line belongs next to that line.

## Why It Accumulates

Writing to the instruction file is always the cheaper move. The right comment location has to be found; the instruction file is a single known path that appends cleanly and never conflicts with surrounding code. Any agent will take that path, and nothing pushes back — type checkers and dead-code tools catch unused symbols, never a repeated paragraph.

The cost arrives later. A duplicated explanation has two copies and only one of them moves when the code moves, so the instruction file drifts first — usually into a wrong path or a renamed symbol. A nearby comment is easier to update alongside the code, but can still drift; verify its accuracy rather than assuming proximity makes it current.

## Apply the Placement Test

First check whether the paragraph is accurate, necessary, and adds guidance the model would otherwise lack. Remove obsolete, duplicate, or unhelpful advice with a reason; do not relocate it merely to preserve its words. Keep unresolved policy questions in place until clarified. For useful content, answer three yes/no questions about the paragraph.

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
- **Preserve necessary facts, not every paragraph.** When useful guidance is relocated, write or verify the destination in the same change. When guidance is obsolete, redundant, or unhelpful, deletion needs a reason, not a new comment.

Report before editing: one line per paragraph leaving the file, with its destination (comment, documentation, or pointer) or the reason for deletion. For a corrected policy, state the replacement and why. Follow `/persistent-side-effects`: an accepted audit rewrite covers in-scope edits, but new policy decisions need approval. Do not re-ask for the same approved rewrite.

If preserving a fact would require changing product behavior or structure rather than instructions, comments, or documentation, hand off to `/plan-it`. Do not broaden an instruction audit into product implementation.

## Completion Criterion

For every paragraph decided: useful guidance sits where the test sends it, necessary relocated facts remain available at a verified destination, and obsolete, duplicate, or unhelpful guidance is deleted with a reason. A split's reasoning is not duplicated; retained paths, symbols, and versions resolve. Corrected policies have the required approval; comments are checked for accuracy too.

Deciding one paragraph settles that paragraph. A whole file is settled once every paragraph has been decided or reported as an open question and left in place, and the report lists every paragraph that left the file.
