# Stop Rules

Agent chỉ dừng toàn bộ khi:

1. Có nguy cơ mất dữ liệu production nghiêm trọng.
2. Có yêu cầu bảo mật hoặc pháp lý cần quyết định của con người.
3. Mọi task còn lại đều phụ thuộc cùng một Manual Action chưa được xử lý.
4. Repository hoặc môi trường không thể truy cập và không còn task offline nào có thể làm.
5. Roadmap đã hoàn thành theo `01-goal/GOAL.md`.

Không được dừng chỉ vì:

- thiếu một API key,
- thiếu DNS,
- thiếu tài khoản test,
- không truy cập được Stitch,
- một task bị lỗi nhưng task khác độc lập,
- deploy của một component đang chờ trong khi có task khác không phụ thuộc.
