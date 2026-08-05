# Spec: AI-DOS Core — Phase 1 Contract Foundation

## Objective

Xây dựng lớp contract foundation cho AI-DOS để project profile, roadmap, sprint, task, manual action, evidence và project state có một mô hình machine-readable ổn định. Agent có thể dùng các record này để kiểm tra context, dependency và completion trước khi thực thi.

Phase 1 không xây CLI orchestration, adapter, generated Markdown projection, CI integration hoặc production deployment. Các phần đó thuộc Phase 2 trở đi.

## Design decisions

- **Runtime:** Node.js 20+ standard library, không thêm package dependency.
- **Canonical format:** JSON records; Markdown hiện tại vẫn là human/agent interface.
- **Contract format:** JSON Schema Draft 2020-12 subset, có `kind`, `schemaVersion`, `id` và `extensions` ở mọi record.
- **IDs:** ổn định, có namespace/prefix rõ, không tự sinh ngẫu nhiên trong validator.
- **Compatibility:** additive change là default; breaking change phải tăng major contract version và có migration note.
- **Applicability:** explicit `REQUIRED`, `OPTIONAL` hoặc `NOT_APPLICABLE`; không suy luận deployment từ việc file có URL hay không.
- **Dependencies:** chỉ task/sprint dependency mới tạo graph; validator phải phát hiện duplicate ID và cycle.
- **State:** `project.state.taskStatuses` là nguồn sự thật duy nhất cho lifecycle; task record là work definition và không lặp status.

## Commands

```text
Test: node --test
Test (contracts): node --test test/contracts.test.js
Test (state): node --test test/state.test.js
Test (validation): node --test test/validation.test.js
Validate a record: node core/validate.js <path-to-json>
```

## Project structure

```text
core/
  contracts/       JSON schemas, vocabulary and contract registry
  state/           canonical transition model
  validation/      record, graph and placeholder validation
  validate.js      minimal Phase 1 validation entry point
test/              Node built-in tests
docs/              specs, architecture and migration documentation
```

## Contract records

| Kind | Primary purpose | Required identity |
|---|---|---|
| `project.profile` | Project context and capabilities | `id`, `name`, `repositoryType`, `primaryBranch`, `targetVersion` |
| `roadmap` | Version objective and sprint references | `id`, `version`, `objective`, `sprintIds` |
| `sprint` | Ordered task group | `id`, `name`, `taskIds`, `status` |
| `task` | Atomic work definition | `id`, `title`, `objective`, `dependencies`, `applicability` |
| `manual_action` | Human-only action and retest protocol | `id`, `status`, `requiredAction`, `expectedResult` |
| `evidence` | Verification result attached to a task | `id`, `taskId`, `checks`, `result` |
| `project.state` | Current execution state and lifecycle source of truth | `projectId`, `status`, `currentTaskId`, `taskStatuses` |

## Code style

- ESM modules with named exports.
- Pure functions for validation and transition decisions.
- No mutation of caller-owned records.
- Error results are structured diagnostics; no exception for expected invalid input.
- Tests assert observable result and diagnostics, not implementation details.

## Testing strategy

- Node built-in `node:test` and `node:assert/strict` only.
- Unit tests cover vocabulary, schema loading, transitions and graph algorithms.
- Fixture tests cover valid and invalid records.
- No network, filesystem writes or external service calls in tests.
- Every invalid input test asserts stable diagnostic code, not only message text.

## Boundaries

- **Always:** preserve existing directory compatibility, validate at record boundaries, use stable diagnostic codes, keep core vendor-neutral.
- **Ask first:** changing an existing status, changing required fields, adding a runtime dependency, changing canonical source of truth, or changing a directory contract.
- **Never:** commit secrets, execute deployment from core, treat Markdown prose as validated state, silently migrate or delete project data.

## Phase 1 success criteria

- [ ] All seven record kinds have machine-readable schemas and registry metadata.
- [ ] Required fields, ID format, status vocabulary and applicability vocabulary are explicit.
- [ ] Canonical state transition rules reject invalid transitions and accept valid ones.
- [ ] Task definitions do not duplicate lifecycle status; state/task ID alignment is validated.
- [ ] Validator reports missing required fields, placeholders, duplicate IDs and dependency cycles.
- [ ] Compatibility matrix and first migration guide are committed.
- [ ] `node --test` passes without network or additional package installation.
- [ ] Existing project data remains untouched; framework onboarding/prompt/rule references may be updated to integrate the new core contract.

## Open questions deferred beyond Phase 1

- Whether canonical records should live under `.ai-dos/` or `core/project/` in a future compatibility layout.
- Whether JSON Schema should be promoted to full Draft 2020-12 support through an optional validator package.
- How Markdown projections should be generated and whether they are committed or derived.
- Which adapter capabilities are standard versus profile-specific.
