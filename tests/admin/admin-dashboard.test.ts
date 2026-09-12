import assert from "node:assert/strict";
import test from "node:test";
import { hasPermission, PERMISSIONS } from "../../server/permissions/permissions";
import { ADMIN_DASHBOARD_RECENT_LIMIT } from "../../server/repositories/admin-dashboard.repository";

test("ADMIN can read system users and audit logs", () => {
  assert.equal(hasPermission("ADMIN", PERMISSIONS.ADMIN_READ_USERS), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.ADMIN_VIEW_AUDIT_LOGS), true);
});

test("USER cannot access admin dashboard permissions", () => {
  assert.equal(hasPermission("USER", PERMISSIONS.ADMIN_READ_USERS), false);
  assert.equal(hasPermission("USER", PERMISSIONS.ADMIN_VIEW_AUDIT_LOGS), false);
});

test("MANAGER cannot access admin dashboard permissions", () => {
  assert.equal(hasPermission("MANAGER", PERMISSIONS.ADMIN_READ_USERS), false);
  assert.equal(hasPermission("MANAGER", PERMISSIONS.ADMIN_VIEW_AUDIT_LOGS), false);
});

test("admin dashboard recent datasets remain bounded", () => {
  assert.equal(ADMIN_DASHBOARD_RECENT_LIMIT, 8);
  assert.ok(ADMIN_DASHBOARD_RECENT_LIMIT > 0 && ADMIN_DASHBOARD_RECENT_LIMIT <= 20);
});
