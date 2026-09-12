# Architecture Assessment and Initial Design

## Status

This repository is a new application. There was no pre-existing codebase to preserve, so the foundation is intentionally small and security-first.

## Stack

- Next.js 16 App Router
- React 19
- Strict TypeScript
- Tailwind CSS 4
- PostgreSQL 17 for local development
- Prisma ORM 7
- Zod 4 for runtime validation
- Lucide icons

## Application boundaries

- `app/`: routes, layouts, Server Components, Route Handlers
- `components/`: reusable UI components
- `lib/`: framework-agnostic utilities and environment validation
- `server/auth/`: authentication/session integration
- `server/permissions/`: centralized authorization policies
- `server/repositories/`: database access
- `server/services/`: business workflows and transaction boundaries
- `prisma/`: database schema and migrations
- `types/`: shared domain types

The empty `server/auth`, `server/permissions`, `server/repositories`, and `server/services` directories are architectural boundaries for the next increments. Production features should only be added there when their complete implementation is introduced; no fake backend behavior is included.

## Database model

`User` is the authoritative source for role and account status. Browser-provided role values are never trusted.

Manager access is represented by `ManagerAssignment`, not inferred from the MANAGER role. This supports multiple managers per user without schema redesign and permits explicit server-side scope checks.

`AuditLog` records security-relevant operations without storing secrets or tokens.

## Authentication approach

Step 3 adds Auth.js credentials-based authentication for local registration/login and password lifecycle behavior. Password hashes are stored only in `User.passwordHash` using scrypt. Sensitive authenticated operations use `requireAuth()` to reload the authoritative user record and validate account status plus `authVersion`; Step 5 will add role/permission/ownership authorization on top of that identity boundary.

Authentication implementation is intentionally not partially scaffolded in this foundation. It should arrive as one coherent, testable increment containing registration, sign-in/out, password hashing, session handling, and protected-route primitives.

## Authorization approach

Authorization will be centralized around reusable helpers rather than role checks scattered through components. Planned primitives:

- `requireAuth()`
- `requireRole()`
- `requirePermission()`
- `requireOwnership()`
- `requireManagerScope()`

Backend operations will authenticate, authorize, validate input, check ownership/scope, execute, handle expected errors, revalidate affected data, and audit when appropriate.

## Route plan

- `/dashboard` user area
- `/manager` manager area
- `/admin` administration area
- `/api/health` unprivileged health endpoint
- `/api/auth/*` authentication endpoint after the authentication increment

Route middleware/proxy may improve navigation UX but will never be the only authorization boundary.

## Security baseline

- Strict TypeScript and runtime Zod validation
- Server Components by default
- PostgreSQL parameterization through Prisma
- No client-controlled role/ownership trust
- Explicit manager-user relationship
- Audit model from the start
- Secrets exclusively in server environment variables
- No production secrets in `.env.example`
- `poweredByHeader` disabled

## Increment plan

1. Foundation — current increment
2. Database migration and development seed strategy
3. Authentication and password lifecycle
4. Central RBAC/permissions
5. User dashboard and profile
6. Manager dashboard and assignment-scoped workflows
7. Admin dashboard and user/manager management
8. Audit log UI and reporting
9. Application-specific records/features
10. Security tests, rate controls, deployment hardening
