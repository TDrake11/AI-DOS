# AI-DOS Phase 2 Migration Guide

Phase 2 introduces a manifest-first agent entry point while preserving the
numbered Markdown overlay as a migration source. A project may adopt the
canonical records incrementally; legacy Markdown is not overwritten by core
commands.

## Bootstrap order

1. Keep project facts in `00-project/PROJECT_INFO.md`, roadmap in
   `06-roadmap/ROADMAP.md`, and active work in `07-tasks/` while migrating.
2. Create canonical `project.profile`, `roadmap`, `sprint`, `task`,
   `project.state`, and applicable `evidence` records.
3. Add `.ai-dos/manifest.json` using literal relative paths and declared entry
   order. Set `outputDirectory` to `.ai-dos/generated` unless the project has
   a documented safe alternative.
4. Add an explicit `executionProfile` to the project profile:
   `production_required`, `deployment_optional`, or `not_applicable`.
5. Add structured evidence checks with `kind`, `name`, `status`, and command or
   artifact details when applicable.
6. Run conformance before implementation and after each meaningful task.

## Verification commands

```text
node core/conformance.js --manifest .ai-dos/manifest.json
node core/project.js --manifest .ai-dos/manifest.json --out .ai-dos/generated
```

Conformance is local and deterministic. Missing required paths, invalid
records, dependency/state drift, profile contradictions, and missing required
evidence fail the check. Optional paths and inferred legacy profiles produce
warnings. Generated summaries are disposable views; edit canonical records or
the legacy overlay, then regenerate.

## Rollback

Removing the manifest and generated directory returns the project to the
legacy prompt flow; no `00-*` through `10-*` source file is modified by the
Phase 2 projection writer. Keep canonical records in version control so the
migration can be resumed without reconstructing task history.
