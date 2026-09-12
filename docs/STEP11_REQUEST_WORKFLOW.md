# Step 11 — Request Workflow

This is the first application-specific domain increment. Because no concrete business domain was supplied, the implementation uses a generic `Request` workflow that can later be renamed/refined.

## Authorization
- USER: create/read/cancel only their own requests.
- MANAGER: review requests only when the request owner has an explicit `ManagerAssignment` to that manager.
- ADMIN: read-only system-wide visibility via `ADMIN_READ_RECORDS`.

## State transitions
- New requests start as `SUBMITTED`.
- USER may cancel only `SUBMITTED` requests.
- MANAGER may change only `SUBMITTED` requests to `APPROVED` or `REJECTED`.
- Every create/cancel/decision writes an audit event in the same database transaction.

## Security
Request creation does not accept `userId`, `status`, `reviewedById`, or role/scope claims from the browser. Manager decisions resolve ownership from the request row and verify `ManagerAssignment` server-side.
