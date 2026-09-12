import assert from "node:assert/strict";
import test from "node:test";
import { updateOwnProfileSchema } from "../../server/validators/user";

test("accepts valid self-service profile fields", () => {
  const result = updateOwnProfileSchema.safeParse({ firstName: "Sam", lastName: "Dela Cruz" });
  assert.equal(result.success, true);
});

test("rejects role mass assignment", () => {
  const result = updateOwnProfileSchema.safeParse({
    firstName: "Sam",
    lastName: "Dela Cruz",
    role: "ADMIN",
  });
  assert.equal(result.success, false);
});

test("rejects userId ownership override", () => {
  const result = updateOwnProfileSchema.safeParse({
    firstName: "Sam",
    lastName: "Dela Cruz",
    userId: "another-user",
  });
  assert.equal(result.success, false);
});

test("rejects empty and overlong names", () => {
  assert.equal(updateOwnProfileSchema.safeParse({ firstName: "", lastName: "User" }).success, false);
  assert.equal(updateOwnProfileSchema.safeParse({ firstName: "A".repeat(81), lastName: "User" }).success, false);
});
