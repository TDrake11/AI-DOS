# Execution Rules

## Trước khi làm

1. Đọc `PROJECT_INFO.md`, roadmap, task và code liên quan.
2. Kiểm tra trạng thái hiện tại thay vì dựa trên mô tả cũ.
3. Xác định dependency, rủi ro, API, DB, UI và test bị ảnh hưởng.
4. Tạo kế hoạch ngắn trong task log.

## Trong khi làm

- Thay đổi nhỏ, có kiểm soát.
- Tái sử dụng code hiện có.
- Không tạo component, service hoặc helper trùng lặp.
- Giữ backward compatibility khi có thể.
- Mọi thay đổi DB phải có migration.
- Mọi API mới phải có validation, authorization và documentation.
- Mọi trang phải có loading, empty, error và success state khi phù hợp.
- Không ghi secret vào source.

## Sau mỗi task

1. Chạy validation theo `04-quality/TESTING_POLICY.md`.
2. Sửa mọi lỗi liên quan.
3. Cập nhật task status.
4. Commit riêng cho task.
5. Push.
6. Theo dõi deploy theo `04-quality/PRODUCTION_POLICY.md`.
7. Test production.
8. Nếu production lỗi:
   - điều tra,
   - sửa,
   - commit,
   - push,
   - deploy lại,
   - test lại.
9. Chỉ sau đó chuyển task sang `DONE`.

## Khi thiếu quyền hoặc cấu hình

- Tạo mục trong `MANUAL_ACTION_QUEUE.md`.
- Đánh dấu task là `WAITING_MANUAL` hoặc `PARTIAL`.
- Tiếp tục task độc lập.
- Định kỳ kiểm tra lại queue.
