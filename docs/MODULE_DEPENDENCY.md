# AI-DOS Module Dependency

## 1. Quy ước

Dependency ở đây là dependency về context và contract giữa các module AI-DOS, không phải package dependency. Repository hiện tại không có runtime/package dependency.

- Mũi tên `A -> B` nghĩa là A cung cấp context/contract cho B.
- Module downstream không được tự định nghĩa lại contract của upstream.
- Adapter có thể phụ thuộc core; core không phụ thuộc adapter/vendor.
- Project overlay cung cấp dữ liệu cho core; không sửa policy core để mô tả một project.

## 2. Module hiện tại

| ID | Module | Files hiện tại | Cung cấp | Phụ thuộc trực tiếp |
|---|---|---|---|---|
| M01 | Project Context | `00-project/*` | Identity, stack, architecture, constraints | Repository code/external reality |
| M02 | Goal | `01-goal/GOAL.md` | Completion và stop semantics | M01, M06 |
| M03 | Execution Rules | `02-rules/*` | Lifecycle, Git, dependency, execution | M01, M02 |
| M04 | Development Policies | `03-development/*` | Engineering guardrails | M01, M03 |
| M05 | Quality Gates | `04-quality/*` | DoD, tests, review, production verification | M03, M04, M07 |
| M06 | Operations | `05-operations/*` | Manual action, risk, release, rollback, changelog | M03, M05, external capabilities |
| M07 | Planning | `06-roadmap/*`, `07-tasks/*` | Version, sprint, task, dependency graph | M01, M02, M03 |
| M08 | QA | `08-qa/*` | Smoke, regression, UAT templates | M04, M05, M06 |
| M09 | Prompt Entry Points | `09-prompts/*` | Agent invocation surfaces | M01–M08 |
| M10 | State Projection | `10-state/*` | Current execution state | M02, M03, M06, M07, M08 |
| M11 | Documentation | `README.md`, `docs/*` | Navigation, architecture, vision, dependency | M01–M10 |
| M12 | Core Reference Implementation | `core/contracts/*`, `core/state/*`, `core/validation/*`, `core/validate.js` | Canonical contracts, transitions, validation | M01–M07 |
| M13 | Core Tests | `test/*` | Executable contract/state/validation evidence | M12 |
| M14 | Read-order Manifest | `core/manifest/*`, `read_order.manifest` | Literal read order, required paths, safe resolution | M11, M12 |
| M15 | Conformance Boundary | `core/conformance/*`, `core/conformance.js` | Project validation, profile/evidence checks, active/blocked summary | M14, M12 |
| M16 | Projection Boundary | `core/projection/*`, `core/project.js` | Deterministic Markdown views and safe generated output | M15, M12 |
| M17 | Thin Prompt Orchestration | `09-prompts/*` | Agent entry points that reference canonical policy/tools | M02–M16 |

## 3. Dependency graph hiện tại

```text
Repository reality
        |
        v
M01 Project Context
        |
        +--> M02 Goal --------------------+
        |                                  |
        +--> M03 Execution Rules ----------+--> M07 Planning
        |          |                       |       |
        |          v                       |       v
        +--> M04 Development Policies ----> M05 Quality Gates
                   |                       |       |
                   +-----------------------+       v
                                           M06 Operations
                                             |
M07 Planning --> M09 Prompt Entry Points --> M10 State Projection
        \____________________ M08 QA __________/
```

Đồ thị này là logical dependency; nó chưa được machine-validated. `M09` phải là consumer cuối của policy, không nên trở thành nơi chứa policy mới. `M10` nên là projection từ các canonical records, nhưng hiện tại còn là file độc lập.

Có một coupling vòng tiềm ẩn cần xử lý: `01-goal/GOAL.md` dùng điều kiện Manual Action từ `M06`, trong khi `M03` và `M06` lại dùng goal/lifecycle để quyết định task có được tiếp tục hay kết thúc. Đây hiện là vòng tham chiếu trong tài liệu, chưa phải vòng runtime, nhưng vẫn làm agent khó xác định nguồn sự thật. Target nên tách một **Completion Contract** nhỏ, độc lập, để `M02`, `M03`, `M05` và `M06` cùng tham chiếu mà không phụ thuộc lẫn nhau.

## 4. Luồng execution theo dependency

```text
1. Load M01: project profile, stack, architecture, constraints
2. Load M02 + M03: goal, stop rules, lifecycle, dependency rules
3. Select M07: roadmap/sprint/task hợp lệ
4. Apply M04: policy liên quan theo category
5. Execute và validate bằng M05 + M08
6. Ghi M06: evidence, risk, manual action, release/rollback khi cần
7. Cập nhật M10: state canonical/projection
8. Dùng M09 làm entry point và M11 làm navigation/context handoff
9. Core M12 validates records/state; M14 defines read order; M15 conforms the project; M16 generates views; M13 proves behavior without external services
```

## 5. Boundary và hướng phụ thuộc bắt buộc

### Được phép

- `project -> core/policies`: project cung cấp values cho policy.
- `planning -> execution`: task sử dụng lifecycle và dependency semantics.
- `quality -> execution`: quality gate xác định transition hợp lệ.
- `operations -> quality/execution`: ghi evidence và xử lý exception.
- `adapter -> core`: adapter triển khai capability của core.
- `projection -> canonical state`: Markdown/JSON view được sinh hoặc cập nhật từ nguồn sự thật.

### Không được phép

- Core policy phụ thuộc Vercel, Firebase, Stitch, GitHub hoặc vendor cụ thể.
- Prompt tự tạo rule khác với policy canonical.
- QA tự thay đổi acceptance criteria của task.
- State projection trở thành nguồn sự thật thứ hai.
- Project-specific decision được ghi vào framework core.
- Adapter ghi trực tiếp vào nhiều module mà không qua evidence/state contract.

## 6. Target dependency graph

```text
                 +----------------------+
                 | Core contracts       |
                 | project/task/state   |
                 +----------+-----------+
                            |
       +--------------------+--------------------+
       v                    v                    v
  Policies             Lifecycle             Profiles
       |                    |                    |
       +----------+---------+----------+---------+
                  v                    v
             Validators           Prompt renderer
                  |                    |
                  +---------+----------+
                            v
             M14 Read-order Manifest
                            |
                            v
             M15 Conformance Boundary
                            |
              +-------------+-------------+
              v             v             v
       M16 Projections   M17 Prompts    Adapters/QA
              |             |             |
              +-------------+-------------+
                            v
                    Evidence + State
```

Core contract nằm ở đáy của mọi dependency. Profiles và policies mở rộng core qua composition. Adapters nằm ngoài lõi và có thể bị thiếu; khi thiếu, capability chuyển sang `WAITING_MANUAL` hoặc `NOT_APPLICABLE` tùy profile.

## 7. Dependency risks hiện tại

| Rủi ro | Biểu hiện | Tác động | Hướng xử lý đề xuất |
|---|---|---|---|
| Prompt duplication | `GOAL_PROMPT.md` lặp policy | Agent đọc mâu thuẫn | Prompt chỉ tham chiếu policy/index |
| State duplication | JSON và Markdown độc lập | Mất tính nhất quán | Một canonical state, các view được generate |
| Implicit file contract | Nhiều file gọi `PROJECT_INFO.md` nhưng không quy định schema | Project mới điền thiếu fields | Contract + required field validation |
| Production coupling | DoD/lifecycle mặc định deploy mỗi task | Không phù hợp library/offline | Project profile + capability matrix |
| Example ambiguity | Example task có `TODO` | Agent chạy nhầm workload | Namespace/example marker rõ |
| Unbounded extension | Tool policy chỉ là prose | Khó thay tool dài hạn | Adapter manifest + permissions |

## 8. Module ownership target

| Module | Owner | Change policy |
|---|---|---|
| Core contracts | Framework maintainer | SemVer, compatibility và migration bắt buộc |
| Policies | Framework maintainer + domain reviewers | Version riêng nếu policy thay đổi behavior |
| Project overlay | Project team | Không commit project facts vào core |
| Adapters | Adapter maintainer | Capability declaration và least privilege |
| State/evidence | Agent runtime/validator | Append/audit-friendly, không xóa lịch sử |
| Docs/index | Framework maintainer | Cập nhật cùng contract/module changes |

## 9. Kết luận dependency

Dependency đúng của AI-DOS là dependency theo contract, không phải dependency theo thứ tự thư mục. Số thứ tự hiện tại giúp onboarding, nhưng tương lai cần manifest/graph có thể validate. Mục tiêu là để thêm một project profile hoặc adapter mà không tạo edge ngược vào core. Phase 1 giữ hướng phụ thuộc một chiều: contracts → state/validation → CLI/tests; core không phụ thuộc project adapter.
