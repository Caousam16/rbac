import assert from "node:assert/strict";
import test from "node:test";
import { createRequestSchema, reviewRequestSchema } from "../../server/validators/request";
import { hasPermission, PERMISSIONS } from "../../server/permissions/permissions";

test("request creation rejects mass-assignment fields", () => {
  assert.equal(createRequestSchema.safeParse({ title: "Access request", description: "Please grant access", userId: "other", status: "APPROVED" }).success, false);
});
test("manager can approve records but user cannot", () => {
  assert.equal(hasPermission("MANAGER", PERMISSIONS.MANAGER_APPROVE_RECORD), true);
  assert.equal(hasPermission("USER", PERMISSIONS.MANAGER_APPROVE_RECORD), false);
});
test("review decision is constrained", () => {
  assert.equal(reviewRequestSchema.safeParse({ requestId: "clh1234567890abcdefghijk", decision: "CANCELLED", reviewNote: "x" }).success, false);
});
