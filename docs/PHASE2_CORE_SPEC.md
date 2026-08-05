# Spec: AI-DOS Core — Phase 2 Agent Experience and Validation

## Objective

Hoàn thiện lớp agent experience của AI-DOS để một agent mới có thể xác định deterministic read order, validate toàn bộ project record set, biết task/evidence nào active hoặc thiếu, và tạo Markdown summaries mà không sửa legacy source files.

Phase 2 mở rộng Phase 1 contracts nhưng không xây vendor adapter, CI integration, browser tool, deployment provider hay registry ecosystem.

## Assumptions

- Node.js 20+ và standard library là runtime reference.
- Canonical records là JSON; project-specific record paths được khai báo trong manifest.
- Manifest dùng path literal/entry references, không dùng glob ngầm định hoặc filesystem discovery không kiểm soát.
- Projections được ghi trong output directory riêng, mặc định `.ai-dos/generated/`; không ghi đè `00-*` đến `10-*`.
- Conformance là local, deterministic và không gọi network.
- Prompt là thin orchestrator; rules và contract docs là policy source of truth.

## Design decisions

### 1. Manifest-first read order

`read_order.manifest` là record mới mô tả:

- project profile path;
- canonical record paths;
- policy/document paths;
- prompt entry point;
- deterministic order, required flag và rationale;
- output directory cho generated summaries.

Mỗi path xuất hiện tối đa một lần. Required path thiếu là lỗi; optional path thiếu là warning có mã ổn định.

### 2. Conformance as a separate boundary

Phase 1 `validateRecords()` kiểm tra records đã load. Phase 2 thêm `conformance` boundary chịu trách nhiệm load manifest, resolve relative paths, validate record set, check profile applicability, evidence coverage và manifest/read-order invariants.

### 3. Safe projections

Projection functions là pure (`records -> markdown`). Writer chỉ ghi vào output directory được truyền rõ, tạo file deterministic và từ chối output path trùng legacy source path.

### 4. Explicit execution profiles

Project profile hỗ trợ:

- `production_required`: deployment và production verification bắt buộc;
- `deployment_optional`: deploy nếu capability có, không chặn completion nếu không có;
- `not_applicable`: production/deployment checks không áp dụng.

Profile được biểu diễn explicit khi có thể; legacy profile được inference có cảnh báo, không âm thầm coi là production-ready.

### 5. Structured evidence

Evidence check có `kind`, `name`, `status`, `command` và optional artifact/reference. Conformance chỉ đánh dấu task đủ evidence khi check áp dụng có kết quả hợp lệ; không suy diễn PASS từ việc có commit.

## Commands

```text
Test: node --test
Conformance: node core/conformance.js --manifest <path>
Generate projections: node core/project.js --manifest <path> --out <directory>
```

## Project structure

```text
core/
  manifest/        manifest schema, loader and deterministic read plan
  conformance/     project-level validation and evidence/profile checks
  projection/      pure Markdown renderers and safe writer
  conformance.js   local validation CLI
  project.js       projection generation CLI
test/
  manifest.test.js
  conformance.test.js
  projection.test.js
docs/
  PHASE2_CORE_SPEC.md
  PHASE2_MIGRATION_GUIDE.md
  handoffs/phase2-core.md
```

## Interface contracts

```js
loadManifest(manifestPath) -> { ok, manifest?, diagnostics }
buildReadPlan(manifest, projectRoot) -> { ok, entries, diagnostics }
conformProject({ manifestPath }) -> { ok, diagnostics, summary }
renderProjectSummary(records, context) -> string
writeProjections({ records, outputDir, projectRoot }) -> { ok, files, diagnostics }
```

Expected input errors return structured diagnostics. Filesystem failures are explicit `INPUT_ERROR`/`OUTPUT_ERROR`; no silent fallback to old documents.

## Testing strategy

- Node built-in test runner, no network and no external packages.
- Manifest unit tests cover ordering, duplicate entries, required/optional missing files and path escape.
- Conformance tests cover invalid records, profile applicability, task/state drift and evidence coverage.
- Projection tests assert deterministic content and writer safety against legacy path overwrite.
- CLI tests assert exit `0` for a valid project and non-zero for invalid/incomplete projects.

## Boundaries

- **Always:** preserve Phase 1 contract compatibility, use stable diagnostic codes, resolve paths under project root, keep projections deterministic.
- **Ask first:** changing canonical record locations, changing profile semantics, overwriting legacy files, adding dependencies or changing prompt behavior for existing users.
- **Never:** execute deployment, access secrets, fetch network content, treat generated Markdown as canonical state, or hide missing required inputs.

## Task breakdown

### Task 1 — Manifest and read plan

- Acceptance: manifest schema loads; read order is deterministic; duplicate/missing/escaped paths are diagnosed.
- Verify: `node --test test/manifest.test.js`.
- Files: `core/manifest/`, contract registry/schema, `test/manifest.test.js`.

### Task 2 — Conformance runner

- Acceptance: manifest and all listed records validate together; profile applicability, evidence coverage and state alignment are reported.
- Verify: `node --test test/conformance.test.js` and CLI fixtures.
- Dependencies: Task 1.

### Task 3 — Markdown projections

- Acceptance: summaries render deterministically; output cannot overwrite legacy source; CLI writes only declared output directory.
- Verify: `node --test test/projection.test.js` and generated fixture diff.
- Dependencies: Task 2.

### Task 4 — Thin prompts and workflow integration

- Acceptance: goal prompt references manifest/conformance/projection commands and no longer duplicates detailed policy; README/index/roadmap/handoff are aligned.
- Verify: prompt link/path audit and full `node --test`.
- Dependencies: Tasks 1–3.

## Phase 2 success criteria

- [ ] Agent can obtain one deterministic read plan from a manifest.
- [ ] Conformance CLI validates manifest, context/task/state records, dependency graph and applicability without network.
- [ ] Missing required input, duplicate entry, path escape and task/evidence inconsistency fail with stable diagnostics.
- [ ] Generated Markdown summaries are deterministic, readable and safe from legacy overwrite.
- [ ] Profiles explicitly distinguish production required, deployment optional and not applicable.
- [ ] Evidence has structured check kinds/status/commands and coverage is verifiable.
- [ ] Goal prompt is a thin orchestrator referencing canonical policy and commands.
- [ ] Full tests pass and each module has its own review/commit/push evidence.

## Deferred to Phase 3+

- Adapter manifests and capability discovery.
- CI/deployment/browser/design integrations.
- Policy registry, signed packs and ecosystem governance.
- Full JSON Schema implementation if the Phase 2 subset becomes insufficient.
