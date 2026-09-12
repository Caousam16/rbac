import assert from "node:assert/strict";
import test from "node:test";
import { describeAuditAction } from "../../server/services/dashboard-activity";

test("maps known user account audit events to safe labels", () => {
  assert.equal(describeAuditAction("USER_PROFILE_UPDATED"), "Profile updated");
  assert.equal(describeAuditAction("AUTH_PASSWORD_CHANGED"), "Password changed");
  assert.equal(describeAuditAction("AUTH_REGISTER"), "Account created");
});

test("unknown internal actions use a generic label", () => {
  assert.equal(describeAuditAction("SENSITIVE_INTERNAL_EVENT"), "Account activity");
});
