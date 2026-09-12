import assert from "node:assert/strict";
import test from "node:test";
import { auditActionLabel, sanitizeAuditMetadata } from "../../server/audit/presentation";
import { auditLogQuerySchema } from "../../server/validators/audit-log";

test("audit metadata redacts secret-like keys recursively", () => {
  const value = sanitizeAuditMetadata({ role: "ADMIN", token: "abc", nested: { passwordHash: "hash", changedFields: ["role"] } });
  assert.deepEqual(value, { role: "ADMIN", token: "[redacted]", nested: { passwordHash: "[redacted]", changedFields: ["role"] } });
});

test("audit query rejects unknown mass-assignment keys", () => {
  assert.throws(() => auditLogQuerySchema.parse({ page: 1, actorId: "attacker" }));
});

test("unknown audit actions receive a safe generic label", () => {
  assert.equal(auditActionLabel("INTERNAL_SECRET_OPERATION"), "System activity");
});
