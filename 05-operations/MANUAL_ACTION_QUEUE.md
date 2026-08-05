# Manual Action Queue

Agent chỉ ghi những việc thật sự cần con người hoặc quyền không có.

## Trạng thái

- `WAITING_USER`
- `USER_COMPLETED`
- `RETEST_REQUIRED`
- `VERIFIED`
- `CANCELLED`

## Mẫu

### MA-0001 — `<title>`

- Status: `WAITING_USER`
- Priority: `<LOW | MEDIUM | HIGH | CRITICAL>`
- Related task: `<SPRXX-XXX>`
- Date created: `<YYYY-MM-DD>`
- Required action:
  - `<specific steps>`
- Why agent cannot do it:
  - `<reason>`
- Required values/access:
  - `<do not place actual secret here>`
- Blocks:
  - `<tasks/flows>`
- Does not block:
  - `<tasks that may continue>`
- Retest steps:
  1. `<...>`
- Expected result:
  - `<...>`
- Completion evidence:
  - `<filled after verification>`

## Quy tắc

- Không dùng Manual Action cho việc agent có thể tự làm.
- Không ghi secret thật.
- Sau khi người dùng hoàn thành, chuyển sang `RETEST_REQUIRED`.
- Agent phải quay lại test và chỉ chuyển `VERIFIED` khi thực tế đạt.
