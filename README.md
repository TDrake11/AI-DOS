# Universal AI Development Operating System (AI-DOS)

Phiên bản: `1.0.0`

AI-DOS là bộ quy tắc vận hành dành cho Codex hoặc coding agent làm việc như một nhóm gồm:

- Senior Software Engineer
- Tech Lead
- QA Engineer
- DevOps Engineer
- UI/UX Reviewer
- Project Manager

Bộ này không phụ thuộc dự án cụ thể. Với một dự án mới, chỉ cần cập nhật:

1. `00-project/PROJECT_INFO.md`
2. `06-roadmap/ROADMAP.md`
3. `07-tasks/`

Sau đó dùng prompt trong `09-prompts/GOAL_PROMPT.md`.

## Nguyên tắc cốt lõi

- Đọc code thực tế trước khi lập kế hoạch.
- Không giả định màn hình đang dùng mock nếu chưa kiểm tra.
- Không đổi stack khi dự án đã có giải pháp phù hợp.
- Không dừng toàn bộ roadmap vì một việc cần con người xử lý.
- Ghi việc cần con người vào `05-operations/MANUAL_ACTION_QUEUE.md`.
- Tiếp tục task độc lập.
- Sau mỗi task: kiểm tra → commit → push → theo dõi deploy → test production.
- Nếu production lỗi: tự sửa, commit, deploy và test lại.
- Chỉ kết thúc khi mọi task hoàn thành hoặc chỉ còn việc chờ con người.

## Cấu trúc

- `00-project`: thông tin dự án cần điền.
- `01-goal`: mục tiêu vận hành chung.
- `02-rules`: quy tắc thực thi, Git, dependency và stop conditions.
- `03-development`: coding, API, database, bảo mật, UI/UX, MCP/plugin.
- `04-quality`: Definition of Done, test, review, production.
- `05-operations`: manual queue, technical debt, changelog, release, risk.
- `06-roadmap`: roadmap từng phiên bản.
- `07-tasks`: task theo sprint và template.
- `08-qa`: smoke, regression, UAT.
- `09-prompts`: prompt dùng với `/goal`, bugfix, review, design.
- `10-state`: trạng thái máy có thể đọc.

## Khởi tạo dự án mới

1. Sao chép toàn bộ thư mục AI-DOS vào repository.
2. Điền các placeholder trong `00-project`.
3. Thêm roadmap phiên bản vào `06-roadmap/ROADMAP.md`.
4. Thêm task vào `07-tasks/sprint-XX`.
5. Kiểm tra `10-state/PROJECT_STATE.json`.
6. Chạy prompt trong `09-prompts/GOAL_PROMPT.md`.

## Lưu ý

AI-DOS không cấp cho agent những quyền mà môi trường không có. Nếu agent không thể:

- truy cập VPS,
- đọc trạng thái deploy,
- mở website production,
- cài MCP/plugin,
- truy cập Stitch/Figma,
- thêm secret hoặc DNS,

thì phải ghi rõ vào Manual Action Queue và tiếp tục các công việc khác.
