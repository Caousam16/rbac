import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const COST = 2 ** 16;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const MAX_MEMORY = 128 * 1024 * 1024;

function deriveKey(password: string, salt: Buffer, length: number, cost: number, blockSize: number, parallelization: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, length, { N: cost, r: blockSize, p: parallelization, maxmem: MAX_MEMORY }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await deriveKey(password, salt, KEY_LENGTH, COST, BLOCK_SIZE, PARALLELIZATION);
  return ["scrypt", COST, BLOCK_SIZE, PARALLELIZATION, salt.toString("base64url"), derivedKey.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, costText, blockSizeText, parallelizationText, saltText, hashText] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !costText || !blockSizeText || !parallelizationText || !saltText || !hashText) return false;

  const cost = Number(costText);
  const blockSize = Number(blockSizeText);
  const parallelization = Number(parallelizationText);
  if (!Number.isSafeInteger(cost) || !Number.isSafeInteger(blockSize) || !Number.isSafeInteger(parallelization)) return false;

  try {
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(hashText, "base64url");
    const actual = await deriveKey(password, salt, expected.length, cost, blockSize, parallelization);
    if (expected.length !== actual.length) return false;
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
