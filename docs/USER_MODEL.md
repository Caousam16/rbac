# Step 4 — User model and self-service domain layer

## Scope

This increment implements the authenticated user's own profile domain operations. It intentionally does not introduce manager/admin authorization; centralized RBAC is Step 5.

## Security boundary

Self-service mutations never accept a user ID. `requireAuth()` resolves the authoritative authenticated user from the server-side session and database, and that ID is passed internally to the user service.

Only `firstName` and `lastName` are editable through the self-profile contract. The Zod schema is strict, so attempts to submit `role`, `status`, `email`, `userId`, `managerId`, or other fields are rejected.

The repository uses explicit Prisma `select` objects so password hashes, auth version values, and authentication tokens are never returned from profile operations.

## Layers

- `server/validators/user.ts` — runtime input contract
- `server/repositories/user.repository.ts` — constrained persistence queries
- `server/services/user.service.ts` — domain operations and audit event
- `server/user/actions.ts` — authenticated Server Action adapter
- `app/api/profile/route.ts` — authenticated HTTP API adapter
- `app/account/profile/page.tsx` — self-service profile UI

## API

### GET /api/profile

Returns the authenticated user's safe profile fields.

### PATCH /api/profile

Accepts exactly:

```json
{
  "firstName": "Sam",
  "lastName": "Dela Cruz"
}
```

No user ID is accepted. Extra fields are rejected.

## Audit

Actual first/last-name changes create a `USER_PROFILE_UPDATED` audit event containing only the names of changed fields, not their previous or new values.
