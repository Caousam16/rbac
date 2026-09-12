import { db } from "@/lib/db";

export async function checkDatabaseConnection(): Promise<boolean> {
  const result = await db.$queryRaw<Array<{ ok: number }>>`SELECT 1::int AS ok`;
  return result[0]?.ok === 1;
}
