# Task Execution Lifecycle

Trạng thái hợp lệ:

- `TODO`
- `IN_PROGRESS`
- `WAITING_MANUAL`
- `BLOCKED_DEPENDENCY`
- `PARTIAL`
- `READY_FOR_DEPLOY`
- `DEPLOYING`
- `VERIFYING_PRODUCTION`
- `DONE`
- `FAILED`

## Lifecycle chuẩn

`TODO → IN_PROGRESS → READY_FOR_DEPLOY → DEPLOYING → VERIFYING_PRODUCTION → DONE`

Lifecycle status của canonical records được lưu trong `project.state.taskStatuses`. Task record chỉ chứa work definition; không dùng một status thứ hai làm nguồn sự thật.

## Khi cần con người

`IN_PROGRESS → WAITING_MANUAL`

Sau đó agent:

- ghi Manual Action,
- tiếp tục task khác,
- quay lại khi điều kiện được đáp ứng.

## Khi dependency chưa xong

`TODO → BLOCKED_DEPENDENCY`

Agent phải chọn task không bị phụ thuộc thay vì dừng toàn bộ.

## Task completion evidence

Mỗi task phải ghi trong canonical evidence khi check áp dụng:

- commit SHA,
- checks có `kind`, `name`, `status` và command/artifact nếu có,
- deploy identifier nếu deployment áp dụng,
- production URL/flow nếu production verification áp dụng,
- kết quả,
- lỗi còn lại,
- manual action liên quan.

`production_required`, `deployment_optional` và `not_applicable` quyết định
những phần nào là bắt buộc. Không suy diễn deployment hoặc production
verification chỉ vì task có commit.
