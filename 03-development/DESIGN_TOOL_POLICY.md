# Design Tool Policy

Agent được phép sử dụng công cụ thiết kế được khai báo trong `PROJECT_INFO.md`, ví dụ:

- Google Stitch,
- Figma,
- v0,
- Builder,
- công cụ khác được môi trường hỗ trợ.

## Khi nào nên dùng

- màn hình mới có độ phức tạp cao,
- UI hiện tại thiếu nhất quán,
- dashboard hoặc workflow cần thiết kế lại,
- nhiều component cần bố cục mới.

## Quy trình

1. Phân tích UI hiện tại và luồng nghiệp vụ.
2. Viết prompt thiết kế cụ thể.
3. Dùng project thiết kế được khai báo.
4. Đánh giá kết quả, không bê nguyên nếu không phù hợp.
5. Chuyển thiết kế sang stack hiện tại.
6. Giữ nguyên API, business logic và permission.
7. Tái sử dụng design tokens và shared components.
8. Test responsive và accessibility.

## Nếu công cụ không truy cập được

- ghi Manual Action nếu cần quyền,
- tiếp tục tự thiết kế theo design system,
- không dừng roadmap.

## Không được

- sao chép code sinh ra mà không review,
- thay toàn bộ kiến trúc frontend chỉ vì công cụ đề xuất,
- đưa asset hoặc font không có quyền sử dụng.
