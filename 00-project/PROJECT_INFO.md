# Project Information

> Điền file này trước khi chạy `/goal`.

## Identity

- Project name: `<PROJECT_NAME>`
- Repository type: `<MONOREPO | MULTI_REPO | SINGLE_REPO>`
- Version target: `<VERSION>`
- Primary branch: `<main>`
- Production URL: `<https://example.com>`
- Staging URL: `<optional>`
- API URL: `<optional>`

## Repositories

| Component | Repository | Default branch | Local path |
|---|---|---|---|
| Frontend | `<repo-url>` | `<main>` | `<path>` |
| Backend | `<repo-url>` | `<main>` | `<path>` |
| Other | `<repo-url>` | `<main>` | `<path>` |

## Deployment

- Deployment provider: `<VPS | Vercel | Render | Railway | Docker | Other>`
- Deployment trigger: `<push to main | CI workflow | manual>`
- Deployment status source: `<GitHub Actions | provider dashboard | health endpoint>`
- Health endpoint: `<optional>`
- Expected deployment timeout: `<minutes>`
- Rollback method: `<describe>`

## Test Accounts

Không ghi mật khẩu thật vào repository.

| Role | Email/identifier | Secret source |
|---|---|---|
| Admin | `<account>` | `<secret manager/manual>` |
| User | `<account>` | `<secret manager/manual>` |

## External Services

| Service | Purpose | Configuration source |
|---|---|---|
| `<Firebase>` | `<Auth>` | `<env/secret>` |
| `<R2/S3>` | `<Storage>` | `<env/secret>` |
| `<OpenAI>` | `<AI>` | `<env/secret>` |

## Design Sources

- Preferred design tool: `<Stitch | Figma | Existing design system | None>`
- Design project URL: `<optional>`
- Access requirements: `<optional>`

## Constraints

- In scope:
  - `<...>`
- Out of scope:
  - `<...>`
- Must preserve:
  - `<existing APIs, stack, UX, compatibility>`
