# Step 9 — User and Manager Management

This increment adds server-authorized administrative account management.

## Routes

- `/admin/users` — paginated search/filter list
- `/admin/users/new` — create an account
- `/admin/users/[userId]` — profile, role, status, and manager assignments

## Authorization

Every mutation calls a backend permission guard. UI visibility is not treated as authorization.

- create account: `ADMIN_CREATE_USER`
- create a MANAGER/ADMIN: also `ADMIN_ASSIGN_ROLE`
- create a non-active account: also `ADMIN_DISABLE_USER`
- edit profile: `ADMIN_UPDATE_USER`
- role changes: `ADMIN_ASSIGN_ROLE`
- status changes: `ADMIN_DISABLE_USER`
- manager assignment changes: `ADMIN_ASSIGN_MANAGER`

## High-risk safeguards

- An administrator cannot change their own role.
- An administrator cannot disable/suspend their own active account.
- The final active administrator cannot be demoted, suspended, or made inactive.
- Last-admin checks and the mutation run in a PostgreSQL serializable transaction so concurrent administrative changes cannot both safely pass the same stale count.
- Role/status changes increment `authVersion`, invalidating previously issued JWT sessions for the target account.
- Demoting a manager removes their outgoing manager assignments.
- Promoting a USER to MANAGER/ADMIN removes incoming manager assignments because only USER accounts are valid assignment targets in this application.
- Manager assignments require an ACTIVE `MANAGER` and a `USER` target.
- Destructive/high-impact UI actions use confirmation prompts, but the backend remains authoritative.

## Validation

Zod schemas are strict. Admin account creation cannot mass-assign `authVersion`, `emailVerified`, password hashes, manager relationships, or arbitrary database fields.

## Audit actions

- `ADMIN_USER_CREATED`
- `ADMIN_USER_PROFILE_UPDATED`
- `ADMIN_ROLE_CHANGED`
- `ADMIN_STATUS_CHANGED`
- `ADMIN_MANAGER_ASSIGNED`
- `ADMIN_MANAGER_UNASSIGNED`

Passwords and credential material are never written to audit metadata.

## Pagination

Admin user listings use a fixed page size of 20. Search and filters execute server-side.
