# AI-DOS Framework Roadmap

## 1. Mục tiêu roadmap

Roadmap này dành cho chính framework AI-DOS, không phải roadmap của project ứng dụng dùng AI-DOS. Nó mô tả hướng mở rộng dài hạn, dependency và release criteria. Đây là thiết kế đề xuất; commit hiện tại chỉ thêm tài liệu phân tích, chưa triển khai milestone nào.

## 2. Định hướng release

AI-DOS nên phát triển theo compatibility-first:

- **Patch:** sửa wording, link, typo hoặc validator bug mà không đổi contract.
- **Minor:** thêm field/module/adapter/policy tương thích; default cũ vẫn hoạt động.
- **Major:** đổi source of truth, lifecycle semantics, required field, directory contract hoặc behavior khiến project/agent hiện tại cần migration.

Phân biệt hai version:

- `ai_dos_version`: version của framework contract/policy.
- `target_version`: version mục tiêu của project đang được agent phát triển.

Không dùng `target_version` để quyết định compatibility của framework.

## 3. Baseline hiện tại

Repository đã chuyển từ framework baseline `1.0.0` sang Phase 2 reference release `1.1.0`. Contract schema vẫn là `1.0` vì các Phase 2 fields/modules mới đều additive; framework version và project target version tiếp tục là hai khái niệm độc lập.

### Baseline capabilities

- layered Markdown operating model;
- project placeholders;
- execution/dependency/stop rules;
- development and quality policies;
- task/sprint templates;
- operational and QA templates;
- prompt entry points;
- minimal JSON state.

### Baseline limitations before Phase 1

- chưa có schema/validator;
- chưa có canonical state/task source;
- chưa có profile/capability model;
- chưa có adapter contract;
- chưa có conformance test;
- chưa có migration/deprecation mechanism.

## 4. Roadmap theo phase

### Phase 0 — Baseline and documentation (current)

**Mục tiêu:** hiểu đúng skeleton, boundary và dependency trước khi thêm implementation.

**Deliverables:** architecture analysis, vision, content index, module dependency, framework roadmap.

**Exit criteria:** mọi file hiện tại có vị trí/owner rõ; current và target không bị trộn; không sửa project files ngoài scope.

### Phase 1 — Contract foundation (đề xuất: 1.x)

**Mục tiêu:** biến các giả định quan trọng thành contract ổn định.

**Phạm vi:**

- project profile contract;
- task, sprint, roadmap, manual action và evidence schema;
- trạng thái canonical và transition model;
- required fields, IDs, status vocabulary và applicability;
- compatibility matrix và migration guide đầu tiên.

**Dependency:** Phase 0.

**Implementation status:** Completed and self-reviewed in the current Phase 1 implementation. The core contract, state, validation, compatibility and migration artifacts are committed and tested.

**Exit criteria:** một project mới có thể validate context/task/state trước khi agent thực thi; phát hiện placeholder/duplicate ID/circular dependency bằng một quy trình reproducible.

**Verified evidence:** `node --test` passes the Phase 1 contract/state/validation tests, including a complete project/task/state fixture; `node core/validate.js` returns `0` for valid records and `1` for invalid dependency graphs. Phase 2 consumes this foundation for project-level conformance and projections.

### Phase 2 — Agent experience and validation (đề xuất: 1.x)

**Mục tiêu:** giảm context ambiguity và policy drift bằng manifest-first execution.

**Phạm vi:**

- canonical read order manifest;
- validator/conformance check;
- generated Markdown summaries từ canonical data;
- thin prompts;
- profile cho `production_required`, `deployment_optional`, `not_applicable`;
- structured evidence format.

**Dependency:** Phase 1.

**Implementation status:** Completed in the Phase 2 reference implementation. The manifest, conformance boundary, profile/evidence checks, safe projections, thin prompts and migration guidance are implemented and pushed in focused commits.

**Exit criteria:** agent mới có thể biết phải đọc gì, task nào active, task nào blocked và evidence nào còn thiếu mà không suy luận từ nhiều file mâu thuẫn.

**Verified evidence:** `node --test` passes the Phase 1/2 suite (47 tests); `core/conformance.js` returns `0` for a conforming manifest and `1` for missing evidence/profile contradictions; `core/project.js` generates deterministic summaries under `.ai-dos/generated` and rejects legacy/outside output paths. Full verification is recorded in `docs/handoffs/phase2-core.md`.

### Phase 3 — Extension architecture (đề xuất: 1.x/2.x)

**Mục tiêu:** mở rộng capability mà không sửa core.

**Phạm vi:**

- adapter manifest;
- capability discovery;
- permission scopes và least-privilege policy;
- Git/CI/deployment/browser/design/tool adapters;
- adapter failure isolation và Manual Action fallback;
- conformance tests cho adapter.

**Dependency:** Phase 1 và Phase 2.

**Exit criteria:** thêm một provider mới chỉ cần implement adapter contract; core không import hoặc chứa vendor assumption.

### Phase 4 — Multi-project profiles and governance (đề xuất: 2.x)

**Mục tiêu:** phục vụ nhiều loại software project và vận hành nhiều năm.

**Phạm vi:**

- profiles cho web app, library, CLI, mobile, data/ML, infrastructure và regulated project;
- policy composition và applicability;
- audit trail, release channels, deprecation và migration tooling;
- compatibility test suite;
- reusable handoff package.

**Dependency:** Phase 1–3.

**Exit criteria:** mỗi profile có context contract, quality gates và production semantics riêng mà vẫn dùng chung core lifecycle.

### Phase 5 — Ecosystem (dài hạn)

**Mục tiêu:** biến AI-DOS thành nền tảng có thể chia sẻ và kiểm chứng giữa tổ chức/agent.

**Phạm vi định hướng:**

- public registry cho profiles/adapters/policies;
- signed/verified policy packs;
- agent compatibility matrix;
- conformance badges và reference implementations;
- migration assistant giữa framework versions.

**Dependency:** Phase 4.

**Exit criteria:** ecosystem có governance, provenance, compatibility và security model; không mở registry trước khi trust boundary rõ.

## 5. So sánh các hướng triển khai

| Phương án | Mở rộng | Tái sử dụng | Độc lập project | Bảo trì dài hạn | Agent UX | Kết luận |
|---|---|---|---|---|---|---|
| Markdown-only | Thấp–vừa | Cao lúc đầu | Cao | Thấp do drift | Cao lúc đầu | Chỉ giữ làm human interface |
| Schema-first + Markdown views | Cao | Cao | Cao | Cao | Cao | **Lựa chọn nền tảng** |
| CLI/runtime bắt buộc | Vừa | Vừa | Thấp hơn | Vừa | Cao nếu cài được | Optional consumer, không là core |
| Vendor-specific integrations | Thấp | Thấp | Thấp | Thấp | Vừa | Chỉ qua adapter |
| Monolithic policy bundle | Vừa | Thấp | Vừa | Thấp | Thấp khi lớn dần | Tránh; dùng composition |

Lựa chọn schema-first không nhằm tạo thêm complexity sớm. Nó đặt stable boundary trước, rồi mới để tooling tăng dần theo nhu cầu. Markdown vẫn là giao diện chính cho agent và con người; schema làm nhiệm vụ kiểm chứng và generate, không thay thế khả năng đọc hiểu.

## 6. Dependency order của roadmap

```text
Phase 0 Documentation
        |
        v
Phase 1 Contracts + canonical state
        |
        v
Phase 2 Validation + agent experience
        |
        v
Phase 3 Adapters + capabilities
        |
        v
Phase 4 Profiles + governance
        |
        v
Phase 5 Ecosystem
```

Không nên bắt đầu bằng plugin marketplace, CLI lớn hoặc nhiều integration trước Phase 1. Những phần đó sẽ khuếch đại contract chưa ổn định và tạo migration cost lâu dài.

## 7. Quality gates cho mỗi framework release

- contract có schema/example và backward compatibility note;
- read order và content index không có link broken;
- dependency graph không có cycle ngoài các edge được chấp nhận;
- prompt không chứa policy mâu thuẫn;
- state/task projection nhất quán;
- profile applicability được test;
- security/permission boundary của adapter được review;
- migration path được ghi cho mọi breaking change;
- docs và handoff đủ để agent mới tiếp quản.

## 8. Rủi ro roadmap

| Rủi ro | Tác động | Mitigation |
|---|---|---|
| Over-engineer quá sớm | Framework khó dùng | Giữ Markdown interface; chỉ thêm tooling khi contract được chứng minh |
| Tool-first design | Coupling vendor | Capability-first adapter boundary |
| Backward compatibility bị xem nhẹ | Project cũ vỡ | SemVer, migration và deprecation trước major release |
| Quá nhiều policy | Agent quá tải context | Policy packs, applicability và thin prompts |
| State không đáng tin | Completion sai | Canonical source + validator + append evidence |
| Production assumption | Không dùng được ngoài web app | Profiles và `NOT_APPLICABLE` rõ ràng |
