# Testing Policy

Agent phải tự phát hiện command từ repository. Không giả định mọi dự án đều có cùng script.

## Tối thiểu

- format/lint nếu có,
- typecheck/build,
- unit test liên quan,
- integration test liên quan,
- component test,
- E2E cho critical flow,
- smoke test production.

## Chọn phạm vi

Sau mỗi task:
- chạy test trực tiếp liên quan,
- chạy build toàn component bị ảnh hưởng.

Cuối sprint:
- chạy regression rộng hơn.

Cuối roadmap:
- chạy full QA/UAT theo khả năng môi trường.

## Khi test không thể chạy

Ghi:

- command,
- lý do,
- dependency thiếu,
- Manual Action liên quan,
- test thay thế đã thực hiện.
