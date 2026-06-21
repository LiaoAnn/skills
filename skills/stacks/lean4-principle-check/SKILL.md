---
name: lean4-principle-check
description: Use when a repo has Lean 4, Lake, .lean files, or proof/model artifacts for design principles, architecture rules, contracts, invariants, permission rules, or consistency constraints, especially when a plan's `Formal principle check: required` field names this skill or Lean 4 artifacts exist in the repo and a planned change might conflict with encoded principles.
---

# Lean 4 Principle Check

Use the repo's existing Lean 4 model to check whether a planned design conflicts with encoded principles before product implementation begins.

## Preconditions

Start from a concrete plan. If there is no plan, run `/plan-it` first.

Use existing Lean 4 artifacts or an explicit user request to create one. Do not introduce Lean 4 to an unrelated project as incidental cleanup.

Treat Lean as a formal design gate, not as a replacement for product tests. After this check passes, continue with `/tdd` or `/implement-plan`.

## Process

### 1. Locate the Lean Boundary

Find the Lean workflow before editing:

- Package/toolchain files: `lean-toolchain`, `lakefile.lean`, `lakefile.toml`, `lake-manifest.json`.
- Existing Lean models: `.lean` files that encode principles, architecture rules, contracts, invariants, or examples.
- Project docs, CI config, or scripts that name the intended command.
- Existing naming, namespace, module, theorem, `example`, `#guard_msgs`, and test conventions.

If multiple Lean workspaces exist, use the one tied to the affected system. Ask for direction only when the mapping is ambiguous.

### 2. Classify the Claim

Before writing Lean, state which kind of claim the plan needs checked:

- **Allowed design**: the proposed behavior satisfies existing principles.
- **Forbidden design**: a known-bad shape should be rejected or impossible.
- **Contract compatibility**: old and new shapes preserve an invariant.
- **Permission/state invariant**: a transition cannot reach an invalid state.
- **Model faithfulness**: a new Lean definition accurately represents the intended system concept.

Name the principle, invariant, or contract in plain language. If the formal statement would be too weak, vague, or disconnected from the plan, stop and update the plan instead of adding ceremonial Lean.

### 3. Encode the Smallest Useful Check

Represent only the design impact needed to check for conflicts.

Prefer the repo's existing style:

- Add a minimal `def`, `structure`, `inductive`, `example`, `theorem`, or test case where similar checks already live.
- Reuse existing vocabulary and imports instead of creating a parallel model.
- Put assumptions in the statement so reviewers can see the boundary being checked.
- For expected failures, use the repo's existing negative-test pattern; if none exists, prefer `#guard_msgs(error) in` around the command whose failure is the expected signal.
- Keep the theorem statement readable enough that the user can judge whether it matches the informal design.

Do not broaden the formal model, weaken existing theorems, remove failing cases, add custom `axiom`s, leave `sorry`/`admit`, or hide unresolved work behind placeholders.

### 4. Choose the Check Strength

Use the lowest check that actually proves the intended gate:

- **Focused module check**: `lake build +Module.Name` or a file target when one module contains the changed theorem.
- **Standalone file check**: `lake lean path/to/file.lean` when the project uses file-level checks.
- **Project check**: `lake build` when the affected declarations cross modules.
- **Configured tests/lints**: `lake test` and `lake lint` when the package defines test or lint drivers.
- **Axiom audit**: add or run `#print axioms DeclarationName` for any theorem that must be sorry-free or must not depend on custom axioms.
- **High-trust recheck**: use `lean4checker --fresh` only when the project already uses it, CI requires it, or the change is high assurance.

For ordinary agent work, a successful build is not enough if the new check relies on `sorry`, `admit`, or a custom axiom. Audit the declaration or report that the proof is only valid relative to those assumptions.

### 5. Run Before TDD

Run the chosen Lean command before writing failing product tests or production code.

Expected outcomes:

- **Pass**: record the command, checked declaration, and any axiom-audit result; continue to `/tdd` or `/implement-plan`.
- **Expected formal failure**: record the failing theorem/example and why the failure demonstrates the design conflict.
- **Unexpected conflict**: stop and update the plan before coding.
- **Tooling failure**: distinguish missing toolchain/dependencies from a real principle conflict.

If dependencies must be fetched or toolchains installed, request approval through the current harness instead of silently skipping the formal check.

### 6. Preserve the Model

When implementation changes the design, update the Lean model in the same vertical slice before final validation.

Do not delete, relax, or bypass Lean checks unless the accepted plan explicitly includes that design decision.

## Output

Report:

- Lean workspace and files touched.
- Claim type and principle/invariant/contract checked.
- Command run and result.
- Axiom/sorry status when relevant.
- Whether implementation may proceed, must be replanned, or is blocked by tooling.

## Completion Criterion

The planned design has been checked against or encoded in the existing Lean 4 model, the relevant Lean/Lake check has passed or produced a clearly reported expected failure, conflict, or tooling blocker, any required axiom/sorry audit has been reported, and implementation has not proceeded past the formal gate when the plan required it.
