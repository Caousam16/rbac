# Database Architecture

## Technology

- PostgreSQL 17 for local development.
- Prisma ORM 7 with the PostgreSQL driver adapter.
- Prisma Migrate for versioned schema changes.

## Models

### User

Stores the authoritative application identity and access tier. `role` and `status` are server-owned fields and must never be accepted from normal user-controlled profile updates.

### ManagerAssignment

Represents explicit manager scope. The `MANAGER` role alone does not grant access to every user. Authorization code must verify a `ManagerAssignment` before allowing manager-scoped access.

The `(managerId, userId)` pair is unique and `userId` is indexed for reverse lookups.

### AuditLog

Stores security-relevant administrative and managerial events. Passwords, sessions, authentication tokens, and secrets must never be written to `metadata`.

## Bootstrap administrator

`npm run db:seed` creates no account unless `SEED_ADMIN_EMAIL` is explicitly configured. When configured, it creates an `ADMIN` account in the `INACTIVE` state with no password hash. This intentionally prevents the database seed from creating reusable or hard-coded credentials.

Step 3 will add the authenticated bootstrap/activation flow. Do not manually change the seeded account to `ACTIVE` as a substitute for that flow.

## Commands

```bash
npm run db:generate
npm run db:migrate -- --name <migration-name>
npm run db:deploy
npm run db:status
npm run db:seed
npm run db:studio
```

Production deployments should use `db:deploy`, not `migrate dev`.
