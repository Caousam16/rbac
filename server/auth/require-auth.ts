import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AuthenticationError } from "@/server/auth/errors";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new AuthenticationError();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      emailVerified: true,
      authVersion: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user || user.status !== "ACTIVE" || user.authVersion !== session.user.authVersion) {
    throw new AuthenticationError("Session is no longer valid");
  }

  return user;
}
