# AI-DOS Compatibility Matrix

## 1. Canonical policy

The machine-readable source for this matrix is [`core/contracts/compatibility.json`](../core/contracts/compatibility.json). This document explains the policy for humans and agents.

AI-DOS distinguishes:

- **Framework version:** `1.0.0`, the release of core policies/runtime.
- **Contract version:** `1.0`, the version of record shapes and vocabulary.
- **Project target version:** the application version being developed; it does not control AI-DOS compatibility.

## 2. Reader policy

| Input | Policy | Reason |
|---|---|---|
| Same contract major and supported minor | Accept | Backward-compatible contract |
| Newer minor with unknown fields under `extensions` | Accept | Explicit extension boundary |
| Newer minor with unknown top-level fields | Reject or require migration | Prevent silent reinterpretation |
| Newer contract major | Reject with migration required | Breaking contract may change behavior |
| Unknown `kind` | Reject | Prevent accidental vendor records in core |
| Unknown `schemaVersion` | Reject | Prevent guessing field semantics |
| Placeholder value such as `<PROJECT_NAME>` | Reject for canonical records | Placeholder is not project truth |

## 3. Record matrix

| Record | Status | Legacy source | Phase 1 migration |
|---|---|---|---|
| `project.profile` | Supported | `00-project/PROJECT_INFO.md`, `TECH_STACK.md` | Map identity/capabilities; keep vendor details in `extensions` |
| `roadmap` | Supported | `06-roadmap/ROADMAP.md` | Map version, scope, sprints and release criteria |
| `sprint` | Supported | `07-tasks/**/README.md` | Map active sprint; exclude examples |
| `task` | Supported | `07-tasks/**/SPR*.md` | Preserve stable ID, status, acceptance and dependencies |
| `manual_action` | Supported | `05-operations/MANUAL_ACTION_QUEUE.md` | One record per human-only action; no secrets |
| `evidence` | Supported | task/QA/operations records | Extract command, result, commit and verification timestamp |
| `project.state` | Supported | `10-state/PROJECT_STATE.json`, `TASK_STATUS.md` | Rebuild from canonical task records |

## 4. Backward compatibility

The Phase 1 implementation is additive. Existing numbered directories, Markdown templates and prompts remain valid legacy inputs and are not rewritten automatically. New canonical JSON records can be introduced beside them and validated with:

```text
node core/validate.js <record.json> [more-records.json]
```

`10-state/TASK_STATUS.md` is treated as a human-readable legacy view, not an independent source of truth, once a canonical `project.state` record exists. Projection generation is intentionally deferred to Phase 2.

## 5. Breaking-change rules

A change is breaking when it:

- removes or changes the meaning of a required field;
- changes an enum/status meaning or transition;
- changes ID semantics;
- changes canonical source of truth;
- changes a top-level directory or read contract;
- makes a previously valid record invalid without a migration.

Breaking changes require a major contract version, a migration guide, compatibility tests and an explicit deprecation period where practical.
