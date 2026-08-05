# AI-DOS Vision

## 1. Tầm nhìn

AI-DOS là một operating system dạng tài liệu và contract dành cho AI Coding Agent. Nó cung cấp context, quy tắc, lifecycle, quality gates, trạng thái và điểm mở rộng để một agent có thể phát triển nhiều loại phần mềm một cách nhất quán, kiểm chứng được và có thể bàn giao cho agent khác.

AI-DOS không phải là template của một sản phẩm ứng dụng. Nó là lớp điều phối nằm bên trên repository ứng dụng. Project cụ thể cung cấp context riêng; AI-DOS cung cấp cách đọc context, ra quyết định, thực thi, xác minh và ghi lại bằng chứng.

## 2. Sứ mệnh

Biến mỗi coding agent từ một phiên hội thoại tự phát thành một thành viên có quy trình của một engineering team:

- hiểu đúng project trước khi thay đổi;
- làm việc theo dependency và scope;
- ưu tiên correctness, security và backward compatibility;
- chỉ tuyên bố hoàn thành khi có evidence;
- biết khi nào cần con người và không chặn công việc độc lập;
- để lại context đủ tốt cho agent hoặc kỹ sư tiếp theo.

## 3. Nguyên tắc thiết kế dài hạn

Mọi quyết định của AI-DOS phải được đánh giá theo thứ tự ưu tiên sau:

1. **Khả năng mở rộng:** thêm loại project, agent, tool, workflow hoặc policy mà không phải viết lại lõi.
2. **Khả năng tái sử dụng:** một contract dùng được cho frontend, backend, data, mobile, infrastructure và monorepo.
3. **Độc lập với project:** project overlay chứa sự thật của ứng dụng; framework không chứa giả định EduAI, framework, cloud provider hoặc ngôn ngữ cụ thể.
4. **Khả năng bảo trì nhiều năm:** boundary rõ, nguồn sự thật duy nhất, versioning và migration có chủ đích.
5. **Trải nghiệm AI Coding Agent:** read order rõ, context nhỏ nhưng đủ, trạng thái máy đọc được, task có acceptance criteria và evidence.

Các tiêu chí này quan trọng hơn việc tối ưu cho số lượng file ít nhất hoặc cách triển khai ban đầu dễ nhất.

## 4. Những gì AI-DOS cung cấp

### 4.1 Context contract

Framework quy định project phải khai báo identity, stack, architecture snapshot, môi trường, constraint, roadmap và task. Agent không được dùng placeholder hoặc tài liệu cũ thay cho code thực tế.

### 4.2 Execution contract

Agent đi theo lifecycle:

```text
LOAD CONTEXT
    -> VERIFY CURRENT STATE
    -> RESOLVE DEPENDENCIES
    -> PLAN ONE TASK
    -> IMPLEMENT MINIMAL CHANGE
    -> VALIDATE
    -> COMMIT
    -> DEPLOY / VERIFY WHEN APPLICABLE
    -> RECORD EVIDENCE
    -> UPDATE STATE
```

### 4.3 Governance contract

Rules, Definition of Done, security, API/database, QA, rollback và Manual Action Queue tạo thành hàng rào để agent không đánh đồng “đã viết code” với “đã hoàn thành”.

### 4.4 Extension contract

Trong tương lai, tool adapter, agent adapter, domain policy, validator và renderer phải có thể thêm vào qua interface/manifest ổn định thay vì sửa prompt lõi.

## 5. Ranh giới trách nhiệm

| AI-DOS chịu trách nhiệm | Project chịu trách nhiệm |
|---|---|
| Quy tắc đọc và thực thi | Business domain và product decisions |
| Lifecycle task và trạng thái | Source code ứng dụng |
| Contract cho context, task, evidence | Stack và cách triển khai thực tế |
| Quality gates tổng quát | Test command cụ thể |
| Dependency semantics | Dependency package cụ thể |
| Manual action protocol | Credentials, account, DNS và approval |
| Extension points | Adapter/provider được chọn |

AI-DOS không cấp quyền mà môi trường không cấp, không thay thế CI/CD provider và không tự biến một project chưa cấu hình thành project production-ready.

## 6. Mô hình người dùng

- **Primary user:** AI Coding Agent cần context có cấu trúc và quyết định ít mơ hồ.
- **Reviewer:** kỹ sư hoặc tech lead cần review scope, evidence, dependency và risk.
- **Operator:** người xử lý secrets, approval, deploy, DNS hoặc production action.
- **Maintainer:** người phát triển chính framework, chịu trách nhiệm contract, compatibility và migration.

## 7. Maturity model

| Level | Năng lực | Đặc điểm |
|---|---|---|
| 0 — Skeleton | Tài liệu nền | Placeholder, chưa có project contract hoàn chỉnh |
| 1 — Guided | Agent có quy trình | Read order, task template, rules, QA và prompt |
| 2 — Verified | Có evidence đáng tin | Schema validation, state consistency, dependency validation |
| 3 — Extensible | Có adapter | Tool/agent/provider/policy mở rộng qua contract ổn định |
| 4 — Governed | Vận hành lâu dài | Compatibility, migrations, audit trail, release channels |
| 5 — Ecosystem | Tái sử dụng quy mô lớn | Profiles, registry, conformance suite và cộng đồng |

Baseline hiện tại là giữa Level 0 và Level 1. Mục tiêu dài hạn là Level 4 trước khi tối ưu cho Level 5.

## 8. Tiêu chí thành công

AI-DOS được xem là đạt mục tiêu khi:

- project mới chỉ cần thay project overlay đã quy định, không phải sửa framework core;
- agent mới có thể bắt đầu từ một read order duy nhất;
- cùng một task contract hoạt động cho nhiều stack và loại repository;
- trạng thái Markdown và machine-readable không mâu thuẫn;
- mọi quyết định quan trọng có rationale và version compatibility;
- task độc lập vẫn chạy được khi một Manual Action bị chặn;
- một agent khác có thể tiếp quản mà không cần hỏi lại toàn bộ lịch sử hội thoại.

## 9. Vision statement

> AI-DOS là lớp operating system có contract ổn định, giúp mọi AI Coding Agent làm việc trên mọi software project với context đúng, hành động có kiểm soát và kết quả có thể kiểm chứng.
