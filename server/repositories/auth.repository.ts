import { db } from "@/lib/db";

export function findUserForCredentials(email: string) {
  return db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      passwordHash: true,
      status: true,
      authVersion: true,
    },
  });
}
