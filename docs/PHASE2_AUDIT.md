# AI-DOS Phase 2 Self-Audit

## Scope

This audit covers the Phase 2 objective: manifest-first agent context,
project-level conformance, safe projections, explicit execution profiles,
structured evidence, and thin prompts. It does not claim that adapters, CI,
deployment providers, browser tools, or ecosystem governance are complete.

## Acceptance review

| Area | Result | Evidence |
|---|---|---|
| Deterministic read order | PASS | `read_order.manifest`, `core/manifest/`, path/duplicate tests |
| Required/optional inputs | PASS | Stable missing-path diagnostics; warnings do not fail alone |
| Project conformance | PASS | `core/conformance/`, record/state/dependency checks |
| Active and blocked work | PASS | Conformance summary derives IDs from canonical state |
| Evidence coverage | PASS | Required `TEST`, `DEPLOY`, `PRODUCTION` check kinds |
| Execution profiles | PASS | Explicit profiles plus warned legacy inference |
| Generated summaries | PASS | Pure renderers and deterministic Markdown writer |
| Legacy safety | PASS | Writer rejects outside paths, legacy roots and unsafe symlinks |
| Prompt drift | PASS | Goal/review/bugfix prompts delegate to manifest, rules and tools |
| Rule/template drift | PASS | Execution rules, DoD and task template are profile-aware |
| Verification | PASS | `node --test`: 45 passing; syntax and diff checks pass |

## Decisions retained after review

1. Keep numbered directories as a compatibility overlay. Moving them now would
   create migration cost without improving the contract boundary.
2. Keep canonical JSON as source of truth and Markdown as a generated or legacy
   view. This removes the state duplication that existed between task files,
   `PROJECT_STATE.json`, and `TASK_STATUS.md`.
3. Keep conformance separate from record validation. Record validation answers
   whether loaded records are valid; conformance answers whether the project
   is complete, applicable, and readable as a set.
4. Keep the runtime dependency-free. Node standard library is sufficient for
   deterministic local checks; vendor capabilities belong to Phase 3 adapters.
5. Treat missing required evidence as a conformance error. A commit alone is
   never a deployment or production proof.

## Findings resolved during self-review

- Prompts previously repeated lifecycle and unconditional production steps;
  they now reference canonical rules and the execution profile.
- Rule/template files still implied deploy/production for every task; they now
  use applicability and explicit `NOT_APPLICABLE` evidence.
- Manifest output directory was declared but not validated; manifest and
  projection now share one safe-path policy.
- Duplicate paths could differ by `./` or Windows casing; normalized path keys
  are now checked.
- Compatibility text still said projection was deferred; it now documents the
  generated-only Phase 2 writer.
- Evidence `kind` was initially made required in the shared `1.0` schema; it is
  now optional for Phase 1 compatibility while conformance requires structured
  kinds to satisfy applicable Phase 2 coverage.
- Framework release metadata was still `1.0.0` after additive Phase 2 work; it
  is now aligned at `1.1.0` while preserving contract schema version `1.0`.

## Remaining intentional limits

- The validator implements the supported deterministic JSON Schema subset, not
  every JSON Schema keyword.
- Conformance does not execute arbitrary project commands; agents record
  command evidence from their test/build/deploy workflows.
- No adapter registry, permission scopes, CI integration, deployment provider,
  browser/design integration, or network-backed service is part of Phase 2.

These are Phase 3+ boundaries, not unresolved Phase 2 defects.
