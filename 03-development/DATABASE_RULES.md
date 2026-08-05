# Database Rules

- Mọi thay đổi schema phải có migration.
- Không sửa DB production thủ công nếu có thể dùng migration.
- Migration phải có kế hoạch rollback hoặc forward-fix.
- Không xóa dữ liệu nếu chưa đánh giá tác động.
- Thêm index dựa trên truy vấn thực tế.
- Tránh N+1.
- Seed phải idempotent nếu được dùng lặp lại.
- Seed production phải bị chặn hoặc kiểm soát chặt.
- Không đặt secret trong migration hoặc seed.
