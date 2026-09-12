import { createHash } from "node:crypto";
import { db } from "@/lib/db";

const WINDOWS = {
  login: { limit: 10, minutes: 15 },
  register: { limit: 5, minutes: 60 },
  forgotPassword: { limit: 5, minutes: 60 },
} as const;

type RateLimitAction = keyof typeof WINDOWS;

function hashKey(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function enforceAuthRateLimit(action: RateLimitAction, key: string): Promise<void> {
  const config = WINDOWS[action];
  const since = new Date(Date.now() - config.minutes * 60_000);
  const keyHash = hashKey(key);

  const count = await db.authRateLimitEvent.count({
    where: { action, keyHash, createdAt: { gte: since } },
  });

  if (count >= config.limit) {
    throw new Error("RATE_LIMITED");
  }

  await db.authRateLimitEvent.create({ data: { action, keyHash } });

  if (Math.random() < 0.02) {
    const cutoff = new Date(Date.now() - 24 * 60 * 60_000);
    void db.authRateLimitEvent.deleteMany({ where: { createdAt: { lt: cutoff } } }).catch(() => undefined);
  }
}
