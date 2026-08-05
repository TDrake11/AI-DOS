# Execution Rules

## Trước khi làm

1. Đọc manifest theo declared order nếu project đã migrate; nếu chưa, đọc `PROJECT_INFO.md`, roadmap, task và code liên quan.
2. Với project có `.ai-dos/manifest.json`, chạy `node core/conformance.js --manifest .ai-dos/manifest.json` trước khi thực thi.
3. Với project Phase 1 chưa có manifest, chạy `node core/validate.js` trên toàn bộ canonical record set.
4. Kiểm tra trạng thái hiện tại thay vì dựa trên mô tả cũ.
5. Xác định execution profile, dependency, rủi ro, API, DB, UI và test bị ảnh hưởng.
6. Tạo kế hoạch ngắn trong task log.
7. Không chạy task khi conformance/validation có lỗi về placeholder, duplicate ID, unknown dependency, dependency cycle, profile, evidence hoặc state drift.

## Trong khi làm

- Thay đổi nhỏ, có kiểm soát.
- Tái sử dụng code hiện có.
- Với AI-DOS Core, giữ lifecycle status trong `project.state.taskStatuses`; không tạo status thứ hai trong task definition.
- Không tạo component, service hoặc helper trùng lặp.
- Giữ backward compatibility khi có thể.
- Mọi thay đổi DB phải có migration.
- Mọi API mới phải có validation, authorization và documentation.
- Mọi trang phải có loading, empty, error và success state khi phù hợp.
- Không ghi secret vào source.

## Sau mỗi task

1. Chạy validation/conformance và các checks áp dụng theo `04-quality/TESTING_POLICY.md`.
2. Sửa mọi lỗi liên quan.
3. Cập nhật `project.state.taskStatuses` và structured evidence; chỉ cập nhật legacy task summary khi project còn dùng view đó.
4. Chỉ deploy và production-test khi execution profile/task applicability yêu cầu hoặc capability đã được bật.
5. Commit riêng cho task.
6. Push theo Git policy.
7. Nếu production verification được áp dụng và thất bại:
   - điều tra,
   - sửa,
   - commit,
   - push,
   - deploy lại,
   - test lại.
8. Chỉ sau đó chuyển task sang `DONE`; `NOT_APPLICABLE` không phải là failure.

## Khi thiếu quyền hoặc cấu hình

- Tạo mục trong `MANUAL_ACTION_QUEUE.md`.
- Đánh dấu task là `WAITING_MANUAL` hoặc `PARTIAL`.
- Tiếp tục task độc lập.
- Định kỳ kiểm tra lại queue.
