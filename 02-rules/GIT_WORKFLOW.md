# Git Workflow

## Branching

Mặc định:

- làm trên branch được chỉ định trong `PROJECT_INFO.md`,
- hoặc tạo feature branch khi quy trình repository yêu cầu.

Không force push nhánh chia sẻ trừ khi được phép rõ ràng.

## Commit

Mỗi task có ít nhất một commit riêng.

Format khuyến nghị:

`<type>(<scope>): <summary>`

Ví dụ:

- `feat(admin): add user moderation dashboard`
- `fix(auth): handle expired Firebase session`
- `test(course): cover enrollment ownership`
- `docs(ai-dos): update manual action queue`

## Trước commit

- xem diff,
- loại bỏ file tạm,
- không commit `.env`,
- chạy test phù hợp,
- cập nhật task log.

## Sau commit

- push,
- ghi commit SHA,
- theo dõi deploy,
- test production.

## Không gộp

Không gộp nhiều task không liên quan vào một commit nếu có thể tránh.
