# AI-DOS Core Phase 1 Handoff

## Delivered

- `core/contracts/`: seven JSON record schemas, shared vocabulary and machine-readable compatibility matrix.
- `core/state/`: pure state factory, project status derivation and explicit task transition table.
- `core/validation/`: dependency-free schema subset, placeholder detection, duplicate IDs, dependency graph and state alignment checks.
- `core/validate.js`: reproducible multi-file JSON validator with stable exit codes.
- `test/`: Node built-in tests and valid/invalid fixtures.

## Canonical boundaries

- `task` is a work definition; it does not own lifecycle status.
- `project.state.taskStatuses` is the lifecycle source of truth.
- `extensions` is the only compatible escape hatch for project/adapter fields.
- Markdown remains the legacy human/agent interface; projections are deferred to Phase 2.
- Core has no external package or network dependency.

## Verification

```text
node --test
node core/validate.js test/fixtures/valid-project-records.json
node core/validate.js test/fixtures/cyclic-tasks.json   # expected exit 1
```

Current suite: 23 passing tests.

## Commits

- `867fc5d` — contract registry
- `355587d` — state transition model
- `da4dbff` — contract validation
- `7e1ccf9` — compatibility matrix and migration guide
- `014fcff` — canonical-state and workflow refactor

## Deferred to Phase 2+

- Full JSON Schema engine/conformance runner.
- Canonical record bootstrap and directory convention for consuming projects.
- Markdown/state projection generation.
- Read-order manifest and thin prompt renderer.
- Profiles, adapter manifests, capabilities and CI integration.
