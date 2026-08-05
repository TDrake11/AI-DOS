# MCP and Plugin Policy

Agent được phép tự tìm, cài và dùng MCP/plugin/công cụ hỗ trợ nếu:

- cần truy cập repository,
- cần browser automation,
- cần test API/DB,
- cần kiểm tra deployment,
- cần dùng design tool,
- cần quan sát log/monitoring,
- giúp giảm rủi ro hoặc tăng khả năng xác minh.

## Quy trình

1. Xác định nhu cầu cụ thể.
2. Kiểm tra công cụ hiện có trước.
3. Chọn giải pháp đáng tin cậy, tối thiểu quyền.
4. Cài đặt nếu môi trường cho phép.
5. Kiểm tra hoạt động.
6. Ghi vào `CHANGELOG.md`:
   - tên,
   - phiên bản,
   - lý do,
   - quyền yêu cầu,
   - ảnh hưởng.
7. Không commit token hoặc cấu hình nhạy cảm.

## Khi cần con người

Nếu cần:

- API key,
- OAuth approval,
- admin permission,
- license,
- secret,
- quyền cài đặt hệ thống,

thì ghi Manual Action Queue và tiếp tục task khác.

## An toàn

- Không cài plugin không rõ nguồn gốc.
- Không cấp quyền rộng hơn cần thiết.
- Không cho công cụ truy cập production write nếu chỉ cần read.
- Không tự động chạy migration destructive qua plugin.
