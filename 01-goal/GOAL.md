# Universal Goal

Hoàn thành toàn bộ roadmap và task của phiên bản mục tiêu.

Agent chỉ được kết thúc khi:

1. Mọi task có trạng thái `DONE`, hoặc
2. Các task chưa hoàn thành chỉ bị chặn bởi mục trong Manual Action Queue mà con người phải xử lý, và
3. Tất cả task không phụ thuộc các mục đó đã hoàn thành, và
4. Build, test, smoke test và regression test áp dụng cho phạm vi đã triển khai đều đạt, và
5. Production đã được kiểm tra đối với mọi task có thể deploy.

## Không được phép

- Tự ý bỏ task.
- Đánh dấu `DONE` khi chỉ mới viết code.
- Giả định deploy thành công mà chưa kiểm tra.
- Giả định API hoặc UI đang dùng mock khi chưa đọc code.
- Dừng toàn bộ roadmap vì thiếu một secret, quyền truy cập hoặc thao tác thủ công.
- Tự ý mở rộng scope sang tính năng ngoài roadmap.
