<<<<<<< HEAD
# RBAC Platform

Production-oriented Next.js application foundation for USER, MANAGER, and ADMIN access levels.

## Current increment: Step 2 — Database

Implemented:

- PostgreSQL local development service
- Prisma 7 configuration and generated client layout
- Initial versioned database migration
- `User`, `ManagerAssignment`, and `AuditLog` models
- Reusable server-only Prisma client
- Database connectivity health check
- Explicit, idempotent bootstrap-admin seed behavior
- Database scripts and documentation

Authentication and authorization helpers are intentionally deferred to Step 3 and Step 5 so they can be implemented and verified as complete security boundaries rather than placeholders.

## Prerequisites

- Node.js 22+
- npm 10+
- Docker with Compose, or another PostgreSQL instance

## Local setup

```bash
cp .env.example .env
npm install
docker compose up -d
npm run db:deploy
npm run db:seed
npm run dev
```

For normal schema development, create future migrations with:

```bash
npm run db:migrate -- --name describe_change
```

Open `http://localhost:3000`. `GET /api/health` now verifies database connectivity and returns HTTP 503 when PostgreSQL is unavailable.

## Verification

```bash
npm run db:generate
npm run lint
npm run typecheck
npm run build
```

See `docs/ARCHITECTURE.md` and `docs/DATABASE.md` for design details.


## Step 3: Authentication

Authentication is implemented with Auth.js credentials sessions, scrypt password hashing, database-backed account status checks, session revocation via `authVersion`, email verification tokens, password reset tokens, auth rate limiting, and a controlled bootstrap-admin command.

See `docs/AUTHENTICATION.md`.

### Authentication setup

Generate a session secret:

```bash
openssl rand -base64 32
```

Place it in `.env` as `AUTH_SECRET`, then apply the auth migration:

```bash
npm run db:generate
npm run db:deploy
```

Optional email delivery uses `RESEND_API_KEY` and `EMAIL_FROM`.

## Step 4: user profile domain layer

The project now includes authenticated self-service profile reads/updates at `/account/profile` and `/api/profile`. Self-service profile mutations derive ownership from `requireAuth()` and accept only `firstName` and `lastName`; browser-provided role/status/email/user identifiers are not accepted.

See `docs/USER_MODEL.md` for the security and layer boundaries.

## Step 5 — RBAC / permissions

Centralized authorization is implemented in `server/permissions/`. Prefer `requirePermission()` plus ownership/scope checks over scattered role comparisons. Managers require an explicit `ManagerAssignment` before they can access a user's scoped data. See `docs/RBAC.md`.

## Step 6 — User dashboard

The authenticated personal dashboard is available at `/dashboard`. It is rendered server-side and derives its data scope exclusively from the authenticated server identity. It displays personal account status, email verification status, role, membership dates, and a bounded list of the user's own recent audit activity. See `docs/STEP6_USER_DASHBOARD.md` for the security boundary.

## Step 7 — Manager dashboard

Managers have a read-oriented workspace at `/manager` whose user data is limited to explicit `ManagerAssignment` relationships. See `docs/STEP7_MANAGER_DASHBOARD.md`.

## Step 8 — Admin dashboard

Administrators have a read-only system overview at `/admin`, protected by `ADMIN_READ_USERS` and `ADMIN_VIEW_AUDIT_LOGS`. It shows bounded account metrics, recent registrations, and recent audit activity without exposing audit metadata or IP addresses. User-management mutations remain deferred to Step 9. See `docs/STEP8_ADMIN_DASHBOARD.md`.

## Step 9: User & Manager Management

Admin user management is available under `/admin/users`, with backend permission checks, strict validation, session invalidation on access changes, last-active-admin protection, explicit manager assignments, and audit logging. See `docs/STEP9_USER_MANAGER_MANAGEMENT.md`.

## Step 10 — Audit logs

Administrators with `ADMIN_VIEW_AUDIT_LOGS` can review bounded, filtered audit events at `/admin/audit-logs`. Sensitive metadata keys are redacted server-side and IP addresses are not exposed by the browser.

## Step 11: Request workflow

The first application-specific workflow is a generic request domain. Users can submit and cancel their own pending requests, assigned managers can approve/reject requests within their explicit scope, and administrators have read-only system visibility. See `docs/STEP11_REQUEST_WORKFLOW.md`.
=======
# rbac
trying to create an secured rbac as well as training my backend
>>>>>>> a2b60f4953255a65941ca68125287f56d62887a9
