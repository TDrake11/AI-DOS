# Production Deployment and Verification Policy

## Sau mỗi task

1. Commit và push.
2. Xác định deploy đã được trigger.
3. Theo dõi trạng thái deploy.
4. Không đánh dấu thành công chỉ vì push thành công.
5. Chờ deploy trong giới hạn khai báo tại `PROJECT_INFO.md`.
6. Kiểm tra:
   - site/API phản hồi,
   - health endpoint,
   - flow liên quan task,
   - console/network,
   - quyền theo role,
   - dữ liệu production/test phù hợp.
7. Lưu evidence trong task log.

## Nếu deploy fail

- đọc CI/deploy logs nếu có quyền,
- tìm root cause,
- sửa,
- commit,
- push,
- test lại.

## Nếu không thể theo dõi deploy

Tạo Manual Action gồm:

- commit SHA,
- component,
- cách kiểm tra,
- expected result.

Tiếp tục task không phụ thuộc.

## An toàn production

- không dùng dữ liệu thật nhạy cảm cho test,
- không chạy destructive test,
- dùng test accounts,
- dọn dữ liệu test nếu cần,
- rollback hoặc feature flag nếu lỗi nghiêm trọng.
