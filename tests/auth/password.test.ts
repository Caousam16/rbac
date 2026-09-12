import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "../../server/auth/password";

test("password hashes are salted and verifiable", async () => {
  const password = "Correct-Horse-42";
  const first = await hashPassword(password);
  const second = await hashPassword(password);

  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("Wrong-Password-42", first), false);
});

test("malformed password hashes fail closed", async () => {
  assert.equal(await verifyPassword("anything", "not-a-valid-hash"), false);
});
