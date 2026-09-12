import assert from "node:assert/strict";
import test from "node:test";
import { hasPermission, PERMISSIONS } from "../../server/permissions/permissions";
import {
  adminCreateUserSchema,
  adminUserListQuerySchema,
  managerAssignmentSchema,
} from "../../server/validators/admin-user";

test("only ADMIN has account-management permissions", () => {
  for (const role of ["USER", "MANAGER"] as const) {
    assert.equal(hasPermission(role, PERMISSIONS.ADMIN_CREATE_USER), false);
    assert.equal(hasPermission(role, PERMISSIONS.ADMIN_ASSIGN_ROLE), false);
    assert.equal(hasPermission(role, PERMISSIONS.ADMIN_ASSIGN_MANAGER), false);
    assert.equal(hasPermission(role, PERMISSIONS.ADMIN_DISABLE_USER), false);
  }
  assert.equal(hasPermission("ADMIN", PERMISSIONS.ADMIN_CREATE_USER), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.ADMIN_ASSIGN_ROLE), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.ADMIN_ASSIGN_MANAGER), true);
});

test("admin account creation rejects mass-assignment fields", () => {
  const result = adminCreateUserSchema.safeParse({
    firstName: "New",
    lastName: "User",
    email: "new@example.com",
    password: "LongSecurePassword1",
    role: "USER",
    status: "ACTIVE",
    authVersion: 999,
    emailVerified: new Date(),
  });
  assert.equal(result.success, false);
});

test("manager assignment only accepts manager and user IDs", () => {
  const good = managerAssignmentSchema.safeParse({ managerId: "cjld2cjxh0000qzrmn831i7rn", userId: "cjld2cyuq0000t3rmniod1foy" });
  assert.equal(good.success, true);
  const bad = managerAssignmentSchema.safeParse({ managerId: "cjld2cjxh0000qzrmn831i7rn", userId: "cjld2cyuq0000t3rmniod1foy", role: "ADMIN" });
  assert.equal(bad.success, false);
});

test("user list pagination is normalized and bounded from below", () => {
  const parsed = adminUserListQuerySchema.parse({ page: "2", q: "sam", role: "USER", status: "ACTIVE" });
  assert.equal(parsed.page, 2);
  assert.equal(parsed.q, "sam");
  assert.equal(adminUserListQuerySchema.safeParse({ page: "0" }).success, false);
});
