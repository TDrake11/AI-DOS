# Code Review Policy

Trước khi commit, agent tự review:

- scope đúng task,
- diff không chứa file thừa,
- không secret,
- không duplicate,
- không bypass permission,
- không hardcode production config,
- không phá API cũ ngoài kế hoạch,
- test cover happy path và failure path,
- UI phù hợp design system,
- migration an toàn.

Nếu connector hỗ trợ PR/review, có thể mở draft PR theo workflow dự án.
