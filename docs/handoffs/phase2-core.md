# Phase 2 Core Handoff

## Delivered

- `read_order.manifest` contract and deterministic safe read plan.
- `core/conformance/` project-level validation with profile, state, dependency,
  active/blocked task, and required evidence diagnostics.
- `core/projection/` pure Markdown renderers and safe generated writer.
- `core/conformance.js` and `core/project.js` local CLI boundaries.
- Explicit execution profiles and structured evidence check kinds.
- Manifest-first thin goal/review/bugfix prompts and Phase 2 migration guide.
- Profile-aware execution rules, Definition of Done and task template.
- Framework release metadata `1.1.0` with backward-compatible contract schema `1.0`.

## Read this next

1. `docs/PHASE2_CORE_SPEC.md`
2. `docs/PHASE2_MIGRATION_GUIDE.md`
3. `docs/PHASE2_AUDIT.md`
4. `core/manifest/README.md`
5. `core/conformance/README.md`
6. `core/projection/README.md`

## Commands

```text
node --test
node core/conformance.js --manifest .ai-dos/manifest.json
node core/project.js --manifest .ai-dos/manifest.json --out .ai-dos/generated
```

Conformance exits `0` when valid, `1` when the project is non-conforming, and
`2` for CLI/input usage errors. Projection output is generated-only and the
writer rejects legacy `00-*` through `10-*` roots and paths outside the project.

## Verification and commits

- Manifest module: `139e02e` — `node --test` 28 passing at that slice.
- Conformance module: `dc3a332` — `node --test` 33 passing at that slice.
- Projection module: `946b4a8` — `node --test` 37 passing at that slice.
- Prompt/docs integration: `de35dfe` — `node --test` 40 passing at that slice.
- Self-review policy and path-safety refactor: `201864e` — `node --test` 41 passing.
- Completion-audit hardening and version alignment: follow-up — `node --test` 45 passing.

All commits were pushed to `origin/main`. The final verification must rerun the
full suite and confirm a clean branch before handoff.

## Next phase boundary

Phase 3 may add adapters for Git, CI, deployment, browser, design and tools.
Adapters must consume these core contracts, declare capabilities and permissions,
and never make core import vendor assumptions.
