# Step 8 — Admin Dashboard

The `/admin` dashboard is a read-only administrative overview. Mutating user-management operations are intentionally deferred to Step 9.

## Authorization

The route requires both `ADMIN_READ_USERS` and `ADMIN_VIEW_AUDIT_LOGS` through the centralized permission guards. USER and MANAGER roles do not receive those permissions.

Route-level UI protection is not treated as an authorization boundary. The data is only queried after the server-side permission guards succeed.

## Data scope

The admin dashboard deliberately uses system-wide aggregates because the ADMIN role is authorized for system administration. The repository exposes only the fields necessary for the overview.

Metrics include total, active, inactive, suspended, manager, administrator, and email-verification counts. Recent registrations and audit events are limited to eight rows.

## Audit privacy

The dashboard does not expose audit `metadata` or `ipAddress`. It shows only the action, target identifiers, actor summary, and timestamp. Full audit-log browsing and policy belong to the later audit-log increment.

## Mutations

There are no account-status changes, role assignments, manager assignments, deletions, or account-creation actions in Step 8. Those high-risk operations require additional safeguards and audit behavior and are deferred to Step 9.
