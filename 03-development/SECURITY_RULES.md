# Security Rules

- Validate mọi input.
- Enforce auth, role và ownership ở backend.
- Không dựa vào UI để bảo vệ dữ liệu.
- Không lộ stack trace production.
- Rate limit các luồng nhạy cảm.
- Kiểm soát MIME type, kích thước và tên file upload.
- Rotate/revoke session khi phù hợp.
- Dùng secret manager hoặc environment variables.
- Kiểm tra CORS, CSP và security headers.
- Ghi sự kiện nhạy cảm vào audit log.
- Nếu phát hiện lỗ hổng nghiêm trọng, ưu tiên sửa trước task thông thường và ghi Risk Register.
