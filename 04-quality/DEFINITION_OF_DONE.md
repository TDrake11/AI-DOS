# Definition of Done

Một task chỉ được `DONE` khi các mục áp dụng đều đạt:

## Code

- [ ] Acceptance criteria đạt.
- [ ] Không lỗi type/build.
- [ ] Không tạo duplicate không cần thiết.
- [ ] Không để TODO/FIXME chưa ghi nhận.
- [ ] Error handling đầy đủ.
- [ ] Auth/role/ownership được kiểm tra.

## Data/API

- [ ] Migration hợp lệ.
- [ ] API documented.
- [ ] Frontend dùng API thật khi có.
- [ ] Không làm hỏng compatibility ngoài kế hoạch.

## UI

- [ ] Responsive.
- [ ] Loading/empty/error/success phù hợp.
- [ ] Accessibility cơ bản.
- [ ] Không lỗi console nghiêm trọng.

## Test

- [ ] Unit/integration/component test liên quan pass.
- [ ] E2E/smoke test liên quan pass.
- [ ] Regression phạm vi ảnh hưởng pass.

## Delivery

- [ ] Commit và push.
- [ ] Deployment check đạt khi execution profile/task applicability yêu cầu; nếu không áp dụng, ghi `NOT_APPLICABLE`.
- [ ] Production flow được test khi production verification áp dụng; nếu không áp dụng, ghi `NOT_APPLICABLE`.
- [ ] Task log và changelog cập nhật.

## Canonical evidence

- [ ] Evidence checks có `kind`, `name`, `status` và command/artifact/reference phù hợp.
- [ ] `project.state.taskStatuses` là nguồn lifecycle duy nhất.
- [ ] Generated Markdown chỉ là projection và đã được regenerate nếu project sử dụng.
