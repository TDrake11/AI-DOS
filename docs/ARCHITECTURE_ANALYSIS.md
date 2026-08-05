# AI-DOS Architecture Analysis

## 1. Phạm vi và bằng chứng

Phân tích này dựa trên toàn bộ repository tại baseline commit `9b79945` (`feat: initialize universal AI-DOS framework`). Repository có 43 file tracked, tất cả là Markdown hoặc JSON; không có source code ứng dụng, package manifest, CI workflow, CLI, schema validator hay runtime service.

Sau baseline đó, Phase 1 và Phase 2 đã bổ sung reference implementation trong `core/`, package metadata và tests trong `test/`. Các mục Current bên dưới mô tả skeleton ban đầu; phần `## 11` và `## 12` ghi nhận trạng thái triển khai hiện tại.

Kết luận trong tài liệu này phân biệt rõ:

- **Current:** những gì repository thực sự có hôm nay.
- **Gap:** vấn đề hoặc rủi ro quan sát được.
- **Target:** hướng thiết kế đề xuất, chưa phải tính năng đã triển khai.

## 2. Kiến trúc hiện tại

AI-DOS hiện là một **documentation-driven operating model** với 11 lớp được đánh số:

```text
README.md
  -> 00-project       Project context và snapshot
  -> 01-goal          Completion/stop goal
  -> 02-rules         Execution, Git, dependency, lifecycle
  -> 03-development   Coding/API/DB/security/UI/tool policies
  -> 04-quality       DoD, testing, review, production policy
  -> 05-operations    Risk, release, rollback, manual actions, changelog
  -> 06-roadmap       Version/sprint/dependency planning
  -> 07-tasks         Task contract, sprint template, example
  -> 08-qa            Smoke, regression, UAT, checklist
  -> 09-prompts       Goal, bugfix, design, review entry points
  -> 10-state         JSON state và task status projection
```

Đây là một pipeline điều phối bằng context và prompt, không phải dependency graph runtime. Các file được agent đọc và cập nhật thủ công; repository chưa có cơ chế tự kiểm tra thứ tự đọc, schema, link hoặc consistency.

## 3. Inventory theo lớp

| Lớp | Nội dung hiện có | Vai trò |
|---|---|---|
| `00-project` | `PROJECT_INFO.md`, `ARCHITECTURE.md`, `TECH_STACK.md` | Project overlay và architecture snapshot |
| `01-goal` | `GOAL.md` | Điều kiện kết thúc và stop behavior |
| `02-rules` | 5 policy/lifecycle docs | Cách agent thực thi và xử lý dependency |
| `03-development` | 8 policy docs | Guardrails theo engineering concern |
| `04-quality` | DoD, testing, review, production | Quality gates |
| `05-operations` | 6 operational docs | Rủi ro, release, rollback, human handoff |
| `06-roadmap` | `ROADMAP.md` | Version, sprint và global graph template |
| `07-tasks` | 2 templates và 1 example sprint/task | Work item contract |
| `08-qa` | 4 QA templates | Verification evidence |
| `09-prompts` | 4 prompts | Entry points cho agent |
| `10-state` | JSON và Markdown state | Current execution projection |
| `core` | Contracts, state machine, validation, manifest, conformance, projection CLIs | Phase 1/2 reference implementation |
| `test` | Node built-in tests và JSON fixtures | Contract/state/validation evidence |
| Root | `README.md` | Onboarding và quick orientation |

## 4. Điểm mạnh

### 4.1 Phân lớp dễ hiểu

Việc đánh số tạo read order và cho thấy lifecycle từ context đến state. Đây là nền tốt cho agent mới, đặc biệt khi repository chưa có tool hỗ trợ.

### 4.2 Có tư duy production

Rules không dừng ở implementation: chúng bao gồm dependency, rollback, manual action, security, QA, production smoke/regression và evidence.

### 4.3 Tách governance khỏi task

Task template chứa objective, scope, acceptance criteria, tests, production verification và completion evidence. Đây là contract tốt để giảm suy diễn của agent.

### 4.4 Có cơ chế không chặn toàn bộ roadmap

Manual Action Queue và `BLOCKED_DEPENDENCY` phân biệt việc cần con người với task độc lập. Đây là điểm quan trọng cho agent vận hành dài phiên.

### 4.5 Có ý thức universal

`PROJECT_INFO.md`, `TECH_STACK.md`, roadmap và task đều dùng placeholder; framework không chứa code EduAI hay một stack cụ thể.

## 5. Những gì còn thiếu

### 5.1 Thiếu canonical contract

Chưa có schema chính thức cho project profile, roadmap, task, manual action, evidence, state hoặc module manifest. Markdown hiện là nguồn duy nhất; JSON chỉ có vài trường state và chưa liên kết với task table.

### 5.2 Boundary framework/project chưa đủ rõ

README nói chỉ cần thay ba nhóm file, nhưng `ARCHITECTURE.md`, `TECH_STACK.md`, operational records, QA và state cũng là project-specific khi chạy thực tế. Chưa có khái niệm rõ ràng về **core**, **project overlay**, **generated projection** và **local evidence**.

### 5.3 Chưa có validation hoặc conformance check

Không có cơ chế phát hiện placeholder còn sót, link sai, task ID trùng, dependency vòng, status không hợp lệ, state lệch với task hoặc thiếu section bắt buộc.

### 5.4 State dễ lệch

`10-state/PROJECT_STATE.json` và `10-state/TASK_STATUS.md` là hai projection độc lập. Prompt yêu cầu cập nhật nhiều file sau roadmap nhưng không chỉ ra nguồn sự thật hay thứ tự đồng bộ.

### 5.5 Prompt chứa nhiều policy trùng lặp

`GOAL_PROMPT.md` lặp lại lifecycle, Manual Action, deploy, plugin và completion rules đã nằm trong các policy khác. Khi policy đổi, prompt có thể trở thành bản lỗi thời.

### 5.6 Versioning chưa thành contract

Có `1.0.0` ở README và JSON, nhưng chưa có SemVer policy, compatibility matrix, migration guide, deprecation lifecycle hoặc distinction giữa framework version và project target version.

### 5.7 Ví dụ có thể bị hiểu là workload thật

`07-tasks/examples/sprint-01/SPR01-001-example-audit.md` là example nhưng có status `TODO`, có thể bị agent coi là task cần chạy. Chưa có marker/namespace để phân biệt example và active project task.

### 5.8 Architecture snapshot chưa có nguồn dữ liệu

`00-project/ARCHITECTURE.md` là template rỗng, yêu cầu agent cập nhật sau audit, nhưng chưa có format đủ chi tiết để mô tả module, interface, runtime boundary, ownership hoặc confidence/evidence.

### 5.9 Assumption về production quá mạnh

Lifecycle mặc định yêu cầu push, deploy và production verification cho mỗi task. Điều này phù hợp web production nhưng chưa được profile hóa cho library, CLI, mobile, data pipeline, offline, regulated hoặc project chưa có deployment.

### 5.10 Chưa có extension boundary

MCP/plugin, design tool, deployment provider và test runner được mô tả bằng policy prose. Chưa có adapter contract, capability declaration, permission scope hoặc failure isolation.

## 6. Những gì nên refactor

| Ưu tiên | Refactor | Lý do dài hạn | Không nên làm ngay vì |
|---|---|---|---|
| P0 | Định nghĩa core/overlay/projection | Giữ độc lập project và tránh drift | Cần thống nhất contract trước |
| P0 | Chọn canonical source cho task/state | Loại bỏ mâu thuẫn Markdown/JSON | Tác động mọi workflow |
| P0 | Chuẩn hóa read order và required files | Cải thiện agent UX, giảm context sai | Cần giữ backward compatibility |
| P1 | Tạo schema + validator/conformance check | Biến policy thành kiểm chứng được | Phải tránh khóa framework vào một tool |
| P1 | Tách prompt thành thin entry point | Tránh policy duplication | Cần có rule registry ổn định |
| P1 | Profile hóa deployment/verification | Dùng được cho mọi loại project | Cần mô hình capability rõ |
| P2 | Manifest cho module/extension/tool | Mở rộng không sửa lõi | Chỉ có giá trị sau khi core contract ổn định |
| P2 | Migration/deprecation process | Bảo trì nhiều năm | Cần version policy trước |

## 7. Những gì nên tách thành module

### Core modules

- **Context:** project identity, stack, architecture, constraints.
- **Planning:** goal, roadmap, sprint, task, dependency.
- **Execution:** lifecycle, stop rules, task transitions, commit evidence.
- **Quality:** DoD, testing, review, QA, production verification.
- **Operations:** risk, manual action, release, rollback, changelog, debt.
- **State:** canonical state plus generated human-readable projections.
- **Prompt orchestration:** entry points chỉ tham chiếu contract, không chứa policy lặp lại.

### Optional modules

- **Adapters:** Git provider, CI/CD, browser, design tool, MCP/plugin, issue tracker.
- **Project profiles:** web app, library, CLI, mobile, data/ML, infrastructure, regulated.
- **Policy packs:** security baseline, API, database, UI, performance.
- **Conformance tooling:** schema validation, graph validation, link/placeholder checks.

Tách module theo capability, không tách theo tool vendor. Ví dụ `deployment` là core capability; Vercel, Docker hay VPS chỉ là adapter.

## 8. Phương án kiến trúc mục tiêu

### Phương án A — Chỉ dùng Markdown tự do

- Ưu: dễ đọc, dễ copy, không cần tooling.
- Nhược: không thể kiểm chứng consistency, khó migrate, dễ drift.
- Đánh giá: phù hợp prototype nhưng không đủ cho sản phẩm nhiều năm.

### Phương án B — Schema-first với Markdown làm giao diện

- Ưu: có contract máy đọc được; Markdown vẫn tốt cho con người/agent; dễ validate và generate projection.
- Nhược: cần thêm schema/tooling và quy định nguồn sự thật.
- Đánh giá: **lựa chọn đề xuất** vì cân bằng mở rộng, tái sử dụng, bảo trì và trải nghiệm agent.

### Phương án C — Một CLI/runtime điều khiển mọi thứ

- Ưu: tự động hóa mạnh, state nhất quán.
- Nhược: coupling vào runtime, platform và permission; khó dùng ở môi trường tối giản; dễ biến AI-DOS thành tool vendor-specific.
- Đánh giá: chỉ nên là optional implementation của Phương án B, không phải kiến trúc lõi.

### Quyết định thiết kế

Chọn **B làm foundation**, cho phép **C là adapter tùy chọn**. Contract là stable boundary; Markdown là human/agent interface; machine-readable model là canonical data; CLI/CI chỉ là consumer/validator. Quyết định này tối ưu cho khả năng bảo trì dài hạn thay vì tốc độ tạo skeleton.

## 9. Cấu trúc chuyên nghiệp đề xuất

```text
ai-dos/
├── core/                         # Contract và policy versioned của framework
│   ├── contracts/                # schema: project, task, roadmap, state, evidence
│   ├── policies/                 # rules, quality, security baseline
│   ├── lifecycle/                # transitions và stop conditions
│   └── profiles/                 # web, library, CLI, mobile, ...
├── adapters/                     # Optional integrations by capability
│   ├── git/
│   ├── ci/
│   ├── deployment/
│   ├── browser/
│   └── design/
├── project/                      # Project overlay, do project author sở hữu
│   ├── PROJECT_INFO.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   ├── ROADMAP.md
│   └── TASKS/
├── operations/                   # Project execution records
├── prompts/                      # Thin entry points và prompt templates
├── state/                        # Canonical state + generated projections
├── docs/                         # Architecture, vision, index, dependencies
└── tests/conformance/            # Framework contract tests
```

Đây là target structure, không phải refactor được thực hiện trong commit này. Cấu trúc đánh số hiện tại có thể giữ ở compatibility layer trong một hoặc nhiều major version.

## 10. Kết luận

Ở baseline phân tích, AI-DOS có nền governance tốt nhưng chưa phải framework có contract thực thi. Phase 1 xử lý foundation; Phase 2 đã xử lý manifest, project conformance, profiles, evidence, projections và prompt drift. Adapter governance và ecosystem tooling vẫn được giữ cho Phase 3+.

## 11. Phase 1 implementation

Phase 1 đã biến các khuyến nghị P0/P1 nền tảng thành reference implementation:

- `core/contracts/`: seven record schemas, vocabulary, compatibility matrix và extension boundary;
- `core/state/`: immutable state factory, transition table và project status derivation;
- `core/validation/`: schema subset, placeholder, duplicate ID, dependency cycle và state alignment checks;
- `core/validate.js`: CLI reproducible với exit code `0`/`1`;
- `test/`: 23 Node built-in tests không network/dependency ngoài.

Một quyết định refactor quan trọng trong quá trình triển khai: task record là work definition; `project.state.taskStatuses` là canonical lifecycle source of truth. Điều này loại bỏ status duplication giữa task và state. Adapter registry và CI conformance thuộc Phase 3+.

## 12. Phase 2 implementation

Phase 2 đã chuyển các rủi ro agent-experience chính thành boundary có thể kiểm chứng:

- `read_order.manifest` khai báo literal paths, thứ tự đọc, required/optional và output directory;
- `core/manifest/` load contract và chặn duplicate/path escape/absolute path;
- `core/conformance/` kết hợp manifest plan với Phase 1 record validation, state/profile/evidence checks;
- `core/projection/` render Markdown thuần và chỉ ghi generated output an toàn;
- `09-prompts/GOAL_PROMPT.md` và review prompt là thin orchestrators, policy vẫn nằm trong rules/quality;
- `docs/PHASE2_MIGRATION_GUIDE.md` mô tả adoption từ numbered Markdown overlay.

Canonical dependency flow hiện tại là `contracts -> manifest -> conformance -> projections`, trong khi prompts chỉ consume các boundary này. Legacy `00-*` đến `10-*` vẫn được giữ làm compatibility overlay; projection writer không sửa chúng.
