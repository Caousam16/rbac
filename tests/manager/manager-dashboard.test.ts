import assert from "node:assert/strict";
import test from "node:test";
import { MANAGER_USERS_PAGE_SIZE } from "../../server/services/manager-dashboard.service";
import { hasPermission, PERMISSIONS } from "../../server/permissions/permissions";

test("manager dashboard permission belongs to MANAGER only among operational roles", () => {
  assert.equal(hasPermission("MANAGER", PERMISSIONS.MANAGER_READ_ASSIGNED_USERS), true);
  assert.equal(hasPermission("USER", PERMISSIONS.MANAGER_READ_ASSIGNED_USERS), false);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.MANAGER_READ_ASSIGNED_USERS), false);
});

test("assigned user list uses a bounded page size", () => {
  assert.equal(MANAGER_USERS_PAGE_SIZE, 20);
});
