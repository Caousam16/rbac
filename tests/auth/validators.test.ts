import assert from "node:assert/strict";
import test from "node:test";
import { loginSchema, registerSchema } from "../../server/validators/auth";

test("registration normalizes email and accepts a strong password", () => {
  const result = registerSchema.parse({
    firstName: "Sam",
    lastName: "Engineer",
    email: "  USER@EXAMPLE.COM ",
    password: "Strong-Password-42",
  });
  assert.equal(result.email, "user@example.com");
});

test("registration rejects weak passwords", () => {
  assert.equal(registerSchema.safeParse({
    firstName: "Sam",
    lastName: "Engineer",
    email: "user@example.com",
    password: "short",
  }).success, false);
});

test("login accepts existing password formats without applying registration strength rules", () => {
  assert.equal(loginSchema.safeParse({ email: "user@example.com", password: "legacy" }).success, true);
});
