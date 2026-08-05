# Dependency Rules

## Quy tắc

- Không bắt đầu task nếu dependency bắt buộc chưa hoàn thành.
- Task độc lập được phép chạy tiếp.
- Không chạy song song các task cùng sửa migration, auth core, routing core hoặc deployment pipeline trừ khi đã tách rõ phạm vi.
- Nếu một task bị `WAITING_MANUAL`, chỉ các task phụ thuộc trực tiếp mới bị giữ lại.
- Cập nhật dependency graph khi phát hiện dependency mới.

## Mẫu

| Task | Depends on | Blocks | Parallel safe |
|---|---|---|---|
| SPR01-001 | None | SPR01-002 | Yes |
| SPR01-002 | SPR01-001 | SPR01-003 | No |
