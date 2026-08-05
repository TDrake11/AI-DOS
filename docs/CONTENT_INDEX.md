# AI-DOS Content Index

## 1. Mục đích

Đây là bản đồ nội dung của AI-DOS và là điểm bắt đầu cho agent hoặc maintainer. File này phân biệt file framework, file project overlay, file vận hành, core reference implementation và file trạng thái. Inventory gồm skeleton baseline, Core Phase 1 và Phase 2 agent-experience tooling đã triển khai.

## 2. Read order chuẩn

### Bootstrap / onboarding

1. `README.md`
2. `docs/AI_DOS_VISION.md`
3. `docs/ARCHITECTURE_ANALYSIS.md`
4. `docs/MODULE_DEPENDENCY.md`
5. `.ai-dos/manifest.json` (nếu project đã migrate)
6. `docs/PHASE2_MIGRATION_GUIDE.md` (nếu project chưa có manifest)
7. `00-project/PROJECT_INFO.md`
8. `00-project/ARCHITECTURE.md`
9. `00-project/TECH_STACK.md`

### Execution một goal

1. Manifest entry order (nếu có), bắt đầu bằng `node core/conformance.js`
2. `01-goal/GOAL.md`
3. Toàn bộ `02-rules/`
4. Policy liên quan trong `03-development/`
5. Toàn bộ `04-quality/`
6. `05-operations/MANUAL_ACTION_QUEUE.md`
7. `06-roadmap/ROADMAP.md`
8. Task và sprint liên quan trong `07-tasks/`
9. QA liên quan trong `08-qa/`
10. `10-state/PROJECT_STATE.json` và `10-state/TASK_STATUS.md` nếu là legacy overlay
11. Entry point cần dùng trong `09-prompts/`

Read order chỉ là context order; nó không thay thế việc agent phải inspect source code thật của project.

## 3. Content map

### Root

| File | Vai trò | Tính chất |
|---|---|---|
| `README.md` | Tóm tắt framework, nguyên tắc, setup | Framework + onboarding |

### `00-project` — Project context

| File | Vai trò | Tính chất |
|---|---|---|
| `PROJECT_INFO.md` | Identity, repository, deployment, services, constraints | Project overlay |
| `ARCHITECTURE.md` | Architecture snapshot sau audit | Project overlay / evidence |
| `TECH_STACK.md` | Stack hiện tại và decision rule | Project overlay |

Đây là lớp project-dependent quan trọng nhất. Không được sao chép giá trị của một project vào framework core.

### `01-goal` — Completion semantics

| File | Vai trò | Tính chất |
|---|---|---|
| `GOAL.md` | Điều kiện kết thúc, stop behavior, production completion | Framework policy |

### `02-rules` — Execution rules

| File | Vai trò |
|---|---|
| `DEPENDENCY_RULES.md` | Dependency bắt buộc, blocked task, parallel safety |
| `EXECUTION_RULES.md` | Trước/trong/sau task, manual action, evidence |
| `GIT_WORKFLOW.md` | Branch, commit, push và pre/post-commit |
| `STOP_RULES.md` | Khi nào được dừng toàn bộ |
| `TASK_EXECUTION.md` | State machine và transition |

### `03-development` — Development policies

| File | Concern |
|---|---|
| `API_RULES.md` | API security, validation, compatibility, documentation |
| `CODING_STANDARDS.md` | Code quality, errors, duplication, comments |
| `DATABASE_RULES.md` | Migration, rollback, index, seed, data safety |
| `DESIGN_TOOL_POLICY.md` | Design tool use và adaptation |
| `MCP_PLUGIN_POLICY.md` | Tool/plugin selection, permissions, changelog |
| `PERFORMANCE_RULES.md` | Measurement, query, bundle, mobile performance |
| `SECURITY_RULES.md` | Input, auth, secrets, headers, audit |
| `UI_UX_RULES.md` | Reuse, responsive, accessibility, UI states |

Policies được chọn theo task category. Không phải project nào cũng áp dụng toàn bộ như nhau; profile tương lai phải biểu diễn applicability.

### `04-quality` — Quality gates

| File | Vai trò |
|---|---|
| `CODE_REVIEW_POLICY.md` | Checklist review trước commit |
| `DEFINITION_OF_DONE.md` | Điều kiện chuyển task sang DONE |
| `PRODUCTION_POLICY.md` | Deploy và production verification |
| `TESTING_POLICY.md` | Phát hiện test command và phạm vi test |

### `05-operations` — Operations and handoff

| File | Vai trò |
|---|---|
| `CHANGELOG.md` | Quyết định/tool/release history |
| `MANUAL_ACTION_QUEUE.md` | Human-only action và retest protocol |
| `RELEASE_CHECKLIST.md` | Release gate |
| `RISK_REGISTER.md` | Risk ownership và mitigation |
| `ROLLBACK_GUIDE.md` | Application/database/flag rollback |
| `TECH_DEBT.md` | Deferred improvements |

### `06-roadmap` — Planning

| File | Vai trò |
|---|---|
| `ROADMAP.md` | Version objective, sprint, global graph, completion rule |

### `07-tasks` — Work items

| File | Vai trò |
|---|---|
| `templates/TASK_TEMPLATE.md` | Task contract và evidence |
| `templates/SPRINT_README_TEMPLATE.md` | Sprint contract |
| `examples/sprint-01/README.md` | Example namespace |
| `examples/sprint-01/SPR01-001-example-audit.md` | Example audit task |

`examples/` không phải active workload. Khi formalize schema cần có marker để validator loại khỏi execution set.

### `08-qa` — Verification records

| File | Vai trò |
|---|---|
| `QA_CHECKLIST.md` | Functional, UI, non-functional coverage |
| `REGRESSION.md` | Sprint regression scope |
| `SMOKE_TEST.md` | Production critical flows |
| `UAT.md` | Persona, scenario, sign-off |

### `09-prompts` — Agent entry points

| File | Vai trò |
|---|---|
| `GOAL_PROMPT.md` | Thin manifest-first goal execution entry point |
| `BUGFIX_PROMPT.md` | Root-cause bugfix entry point |
| `DESIGN_PROMPT_TEMPLATE.md` | UI design prompt template |
| `REVIEW_PROMPT.md` | Diff/task review entry point |

Prompt là interface tiện dụng cho agent; policy canonical vẫn nằm ở các module rules/quality/operations.

### `10-state` — Execution state

| File | Vai trò | Tính chất |
|---|---|---|
| `PROJECT_STATE.json` | Machine-readable current project state | State projection |
| `TASK_STATUS.md` | Human-readable task summary | State projection |

### `docs` — Framework architecture and evolution

| File | Vai trò |
|---|---|
| `AI_DOS_VISION.md` | Tầm nhìn, ranh giới và maturity model |
| `ARCHITECTURE_ANALYSIS.md` | Current architecture, gaps và target structure |
| `MODULE_DEPENDENCY.md` | Logical module graph và dependency rules |
| `FRAMEWORK_ROADMAP.md` | Phase roadmap, versioning và expansion plan |
| `PHASE1_CORE_SPEC.md` | Phase 1 contract foundation spec |
| `PHASE2_CORE_SPEC.md` | Phase 2 manifest, conformance, profile, evidence and projection spec |
| `PHASE2_MIGRATION_GUIDE.md` | Bootstrap path from numbered Markdown overlay to manifest-first execution |
| `PHASE2_AUDIT.md` | Phase 2 self-audit, resolved drift and intentional limits |
| `COMPATIBILITY_MATRIX.md` | Reader policy và legacy mapping |
| `MIGRATION_GUIDE.md` | Manual migration procedure |
| `handoffs/phase1-core.md` | Technical handoff for the Phase 1 implementation |
| `handoffs/phase2-core.md` | Technical handoff for the Phase 2 implementation |

### `core` — Phase 1/2 reference implementation

| Path | Vai trò | Tính chất |
|---|---|---|
| `core/contracts/` | Schemas, vocabulary, compatibility matrix | Canonical contract |
| `core/state/` | Pure state factory và transition model | Core behavior |
| `core/validation/` | Schema subset, placeholder và graph checks | Core behavior |
| `core/validate.js` | Reproducible JSON validation entry point | CLI boundary |
| `core/manifest/` | Manifest loader and deterministic safe read plan | Agent context boundary |
| `core/conformance/` | Project-level record/profile/evidence conformance | Quality boundary |
| `core/projection/` | Pure Markdown renderers and safe writer | Generated view boundary |
| `core/conformance.js` | Conformance CLI with stable exit codes | CLI boundary |
| `core/project.js` | Conformance-first projection CLI | CLI boundary |
| `test/` | Node built-in contract/state/validation/conformance/projection tests | Conformance evidence |

## 4. Project replacement contract

Mục tiêu user-facing là project mới có thể thay:

- `00-project/PROJECT_INFO.md`;
- `06-roadmap/ROADMAP.md`;
- active task set trong `07-tasks/`.

Tuy nhiên để contract này đúng trong thực tế, các file sau phải được khởi tạo/điền theo project: `00-project/ARCHITECTURE.md`, `00-project/TECH_STACK.md`, operations records, QA records và `10-state/*`. Đây là gap hiện tại cần giải quyết bằng profile/bootstrap contract, không nên che giấu bằng việc nói chỉ có ba vị trí thay đổi.

Sau Phase 2, project nên expose một `.ai-dos/manifest.json` trỏ tới canonical records và policy entries. Ba nhóm Markdown trên là bootstrap/legacy overlay; manifest và canonical JSON là execution source of truth khi đã migrate.

## 5. Source of truth hiện tại và target

| Data | Hiện tại | Target |
|---|---|---|
| Project identity | Markdown placeholders | Canonical project profile + Markdown view |
| Task definition | Task file | Canonical `task` record |
| Task status | Task file + `TASK_STATUS.md` | Canonical `project.state.taskStatuses` |
| Project state | `PROJECT_STATE.json` | Canonical state schema + views |
| Dependency graph | Prose/table/code block | Validated graph model |
| Policy | Markdown | Versioned policy documents + metadata |
| Prompt | Full duplicated instructions | Thin prompt referencing policy/index |
| Read order | Implicit numbered folders | Literal-path `read_order.manifest` |
| Evidence | Prose/checklist | Structured evidence checks |

## 6. Ownership và update trigger

| Thay đổi | Files cần xem cùng |
|---|---|
| Core rule/lifecycle | `02-rules`, `01-goal`, `09-prompts`, `10-state`, roadmap docs |
| New quality gate | `04-quality`, `08-qa`, `07-tasks/templates` |
| New project | `00-project`, `06-roadmap`, `07-tasks`, `05-operations`, `08-qa`, `10-state` |
| New tool/adapter | `03-development/MCP_PLUGIN_POLICY.md`, operations changelog, capability/evidence contract |
| Version change | README, state, changelog, migration/compatibility docs |

Phase 1 design and compatibility references:

- `docs/PHASE1_CORE_SPEC.md`
- `docs/COMPATIBILITY_MATRIX.md`
- `docs/MIGRATION_GUIDE.md`
- `docs/PHASE2_CORE_SPEC.md`
- `docs/PHASE2_MIGRATION_GUIDE.md`
