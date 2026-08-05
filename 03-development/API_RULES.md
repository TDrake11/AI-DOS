# API Rules

Mỗi API mới hoặc sửa đổi phải xem xét:

- authentication,
- role,
- ownership,
- validation,
- pagination,
- filtering,
- sorting,
- idempotency,
- error format,
- rate limiting,
- audit log,
- backward compatibility,
- Swagger/OpenAPI.

Frontend không được hardcode dữ liệu khi API thật đã tồn tại, trừ fixture test hoặc fallback được phê duyệt.
