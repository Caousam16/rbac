import assert from "node:assert/strict";
import test from "node:test";
import { AuthorizationError } from "../../server/permissions/errors";
import {
  assertOwnership,
  assertPermission,
  assertRole,
} from "../../server/permissions/authorize";
import { hasPermission, PERMISSIONS } from "../../server/permissions/permissions";

const user = { id: "user-1", role: "USER" as const };
const manager = { id: "manager-1", role: "MANAGER" as const };
const admin = { id: "admin-1", role: "ADMIN" as const };

test("USER has self permissions but not manager/admin permissions", () => {
  assert.equal(hasPermission("USER", PERMISSIONS.USER_READ_SELF), true);
  assert.equal(hasPermission("USER", PERMISSIONS.MANAGER_READ_ASSIGNED_USERS), false);
  assert.equal(hasPermission("USER", PERMISSIONS.ADMIN_READ_USERS), false);
});

test("MANAGER receives explicit manager permissions but no admin permissions", () => {
  assert.equal(hasPermission("MANAGER", PERMISSIONS.USER_READ_SELF), true);
  assert.equal(hasPermission("MANAGER", PERMISSIONS.MANAGER_READ_ASSIGNED_USERS), true);
  assert.equal(hasPermission("MANAGER", PERMISSIONS.ADMIN_ASSIGN_ROLE), false);
});

test("ADMIN receives admin permissions but not manager-scope permissions", () => {
  assert.equal(hasPermission("ADMIN", PERMISSIONS.ADMIN_READ_USERS), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.ADMIN_ASSIGN_ROLE), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.MANAGER_READ_ASSIGNED_USERS), false);
});

test("require-style permission assertion denies privilege escalation", () => {
  assert.throws(
    () => assertPermission(user, PERMISSIONS.ADMIN_ASSIGN_ROLE),
    AuthorizationError,
  );
  assert.throws(
    () => assertPermission(manager, PERMISSIONS.ADMIN_READ_USERS),
    AuthorizationError,
  );
  assert.doesNotThrow(() => assertPermission(admin, PERMISSIONS.ADMIN_READ_USERS));
});

test("role assertion enforces exact allowed role set", () => {
  assert.doesNotThrow(() => assertRole(manager, ["MANAGER", "ADMIN"]));
  assert.throws(() => assertRole(user, ["MANAGER", "ADMIN"]), AuthorizationError);
});

test("ownership assertion permits only the exact authenticated owner", () => {
  assert.doesNotThrow(() => assertOwnership(user, "user-1"));
  assert.throws(() => assertOwnership(user, "user-2"), AuthorizationError);
  assert.throws(() => assertOwnership(admin, "user-1"), AuthorizationError);
});
