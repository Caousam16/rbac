# Step 5: RBAC and authorization

## Principles

Authentication identifies a caller. Authorization is performed independently on the server for every sensitive operation.

The application uses explicit permissions instead of scattering `user.role === ...` checks throughout feature code. Role checks remain available for coarse gates, while feature code should prefer permissions plus ownership/scope checks.

## Permission model

`server/permissions/permissions.ts` is the canonical role-to-permission mapping.

- `USER` receives self-service and own-record permissions.
- `MANAGER` receives the USER permissions plus explicit manager workflow permissions.
- `ADMIN` receives USER permissions plus system administration permissions.
- ADMIN does **not** automatically receive MANAGER permissions. Administrative access is modeled separately, preventing accidental coupling between operational manager workflows and system administration.

## Guards

- `requireAuth()` — reloads the authoritative active user from PostgreSQL.
- `requireRole(...roles)` — coarse server-side role gate.
- `requirePermission(permission)` — centralized permission enforcement.
- `requireOwnership(ownerId)` — exact ownership enforcement using the authenticated server identity.
- `requireManagerScope(targetUserId)` — requires the caller to be a MANAGER and have an explicit `ManagerAssignment` for the target user.

Never pass a browser-provided actor ID into these helpers. The actor always comes from `requireAuth()`.

## Manager scope

Having role `MANAGER` is insufficient to read/manage a user. A `ManagerAssignment(managerId, userId)` row must exist. The unique `(managerId, userId)` key prevents duplicate assignments.

The example `GET /api/manager/users/:userId` performs both:

1. `MANAGER_READ_ASSIGNED_USERS` permission check.
2. `requireManagerScope(targetUserId)` assignment check.

Thus changing the URL to another user's ID does not bypass authorization.

## Ownership

`assertOwnership` deliberately has no admin bypass. A helper named ownership should mean ownership. Features requiring administrative override must explicitly check an administrative permission so the override is visible in code review.

## HTTP behavior

- Unauthenticated: `401 UNAUTHENTICATED`
- Authenticated but unauthorized: `403 FORBIDDEN`
- Missing in-scope resource: `404 NOT_FOUND`

Authorization responses do not expose role mappings, assignments, or internal database details.

## Required integration tests for later database-enabled CI

- USER -> own resource: allowed where permission exists.
- USER -> manager/admin endpoint: 403.
- MANAGER -> assigned user: allowed.
- MANAGER -> unassigned user: 403.
- MANAGER -> admin endpoint: 403.
- ADMIN -> admin endpoint: allowed.
- Tampered target user ID -> denied unless assignment/admin permission independently permits it.
