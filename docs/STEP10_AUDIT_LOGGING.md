# Step 10 — Audit Logging

Step 10 adds a dedicated, admin-only audit-log browser and a centralized audit-writing/sanitization service.

## Authorization

`/admin/audit-logs` requires `ADMIN_VIEW_AUDIT_LOGS` on the server. Navigation visibility is not the security boundary.

## Browser

The audit browser is paginated at 25 events per page and supports filters for actor/name/target ID, action, target type, and date range. Queries select only the fields needed for review; IP addresses are intentionally excluded from the browser.

## Safe metadata

`sanitizeAuditMetadata()` recursively redacts keys that look like passwords, tokens, secrets, cookies, sessions, authorization data, credentials, or hashes. It also limits nesting, collection size, and string length. Unknown actions use a generic user-facing label while the canonical action code remains visible to authorized admins.

Audit writers must never intentionally send plaintext passwords, reset/verification tokens, session material, or authentication secrets to the audit service. Sanitization is defense in depth, not permission to log secrets.

## Central writer

`writeAuditLog()` is the shared helper for new audit events. It accepts either the application Prisma client or a transaction client by structural compatibility through the `auditLog` delegate, allowing events to be committed atomically with sensitive mutations.

## Database indexes

This step adds compound indexes on `(action, createdAt)` and `(targetType, createdAt)` to support common filtered audit investigations without unbounded scans as the log grows.
