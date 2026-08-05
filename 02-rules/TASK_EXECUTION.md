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

Mỗi task phải ghi:

- commit SHA,
- test commands,
- deploy identifier hoặc evidence,
- production URL/flow đã test,
- kết quả,
- lỗi còn lại,
- manual action liên quan.
