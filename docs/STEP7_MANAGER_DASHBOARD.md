# Step 7 — Manager Dashboard

The manager workspace is available at `/manager` and `/manager/users`.

## Authorization

Both pages call `requirePermission(MANAGER_READ_ASSIGNED_USERS)` before reading manager data. The permission is assigned to `MANAGER`, not `USER` or `ADMIN`.

All dashboard queries include the authenticated manager's server-side `id` as `ManagerAssignment.managerId`. The browser never supplies or overrides the manager ID.

Individual assigned-user access continues to use `requireManagerScope(targetUserId)`, which verifies the `(managerId, userId)` composite assignment server-side.

## Data boundaries

The overview reports only assignment-derived counts: total assigned, active assigned, suspended assigned, verified assigned, and verification pending. It intentionally does not fabricate request/approval statistics because the project does not yet contain an application-specific workflow record model.

The assigned-user list is paginated with a fixed page size of 20. The recent overview is bounded to eight assignments.

## Database

No migration is required. Step 7 consumes the existing `User` and `ManagerAssignment` models.
