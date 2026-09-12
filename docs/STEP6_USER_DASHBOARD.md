# Step 6 — User Dashboard

## Scope

This step adds the authenticated personal dashboard only. Manager and administrator dashboards remain separate future increments.

## Authorization boundary

`/dashboard` calls `requireAuth()` and derives the user ID from the authoritative authenticated server session. The page never accepts a target `userId` from route parameters, query parameters, forms, or client state.

Dashboard reads are limited to:

- the authenticated user's own safe account fields;
- `AuditLog` rows where `actorId` exactly matches the authenticated user ID;
- at most eight recent audit events.

No role, status, password hash, auth version, manager assignment, or other user's private data is supplied by the browser to select dashboard data.

## Rendering

The dashboard is a Server Component. JavaScript is only required for the route error boundary's retry control. A route-level loading skeleton and empty recent-activity state are included.

## Data access

`server/repositories/dashboard.repository.ts` performs two bounded queries in parallel. `server/services/dashboard.service.ts` converts internal audit action strings into user-safe activity labels and falls back to a generic label for unknown actions.

## Database

No schema migration is required for this step. The existing `User` and `AuditLog` models provide the required data.
