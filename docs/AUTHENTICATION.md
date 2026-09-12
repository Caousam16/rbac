# Authentication architecture

## Provider

Auth.js v5 credentials provider with JWT sessions.

The JWT contains only identity/session metadata (`sub` and `authVersion`). Application role and account status are never authorized from browser input or a stale JWT. `requireAuth()` reloads the current user from PostgreSQL and requires:

- an existing user record
- `status = ACTIVE`
- the session `authVersion` to match the authoritative database value

Password change/reset increments `authVersion`, revoking all previously issued sessions.

## Password storage

Passwords are hashed with Node.js `scrypt` using:

- random 16-byte salt per password
- N = 65536
- r = 8
- p = 1
- 64-byte derived key

The encoded value stores only algorithm parameters, salt, and derived hash. Plaintext passwords are never persisted or logged.

## Flows

- Registration: validates input, hashes the password, creates USER account, creates a 24-hour email-verification token, optionally sends via Resend.
- Login: validates credentials, rate limits attempts, checks account ACTIVE status, verifies scrypt hash.
- Logout: Auth.js invalidates the browser session cookie.
- Email verification: random opaque token; only SHA-256 hash stored; verification is completed by POST (not the email-link GET) to avoid link scanners consuming tokens; token is one-time via deletion before success.
- Forgot password: always returns the same public result to prevent account enumeration; reset token lasts 60 minutes.
- Reset/change password: hashes new password, deletes reset tokens, increments `authVersion`, writes audit event.

## Email delivery

Set `RESEND_API_KEY` and `EMAIL_FROM` for verification/reset email delivery. No provider credential is stored in source. Registration and credential login remain usable when email delivery is unconfigured; email verification is supported but not currently mandatory for login.

## Bootstrap admin

1. Set `SEED_ADMIN_EMAIL` and run `npm run db:seed` to create an INACTIVE ADMIN without credentials.
2. Set the matching `BOOTSTRAP_ADMIN_EMAIL` and a strong `BOOTSTRAP_ADMIN_PASSWORD`.
3. Run `npm run auth:bootstrap-admin`.

The bootstrap command refuses to run unless the target already exists as an INACTIVE ADMIN with `passwordHash = null`, preventing it from being used as a generic privilege-escalation command.

## Authorization boundary

Step 3 only establishes authenticated identity. Role/permission enforcement (`requireRole`, `requirePermission`, manager scope, ownership) belongs to Step 5 and must be called independently by sensitive backend operations.
