# Authentication test plan

Automated unit tests cover scrypt hashing/verification, malformed hash fail-closed behavior, email normalization, registration password policy, and login validation.

After dependencies and PostgreSQL are available, run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Integration checks:

1. Register a USER and confirm no role/manager fields can be submitted to alter the default USER role.
2. Attempt duplicate registration and verify no database corruption.
3. Sign in with correct credentials; reject wrong password, INACTIVE, and SUSPENDED users.
4. Call `/api/me` while signed out and expect HTTP 401.
5. Call `/api/me` while signed in and confirm only the authoritative current user's record is returned.
6. Change password and verify all prior sessions fail `authVersion` validation.
7. Reset password using a valid token; verify the same token cannot be reused.
8. Request password reset for existing and unknown emails and confirm the public response is identical.
9. Verify an email token through the POST confirmation and confirm reuse fails.
10. Confirm the bootstrap-admin command refuses USER/MANAGER accounts, ACTIVE admins, and admins that already have credentials.
