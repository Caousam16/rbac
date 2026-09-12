import { db } from "@/lib/db";
import { writeAuditLog } from "@/server/audit/write";
import {
  findUserProfileById,
  publicUserSelect,
} from "@/server/repositories/user.repository";
import type { UpdateOwnProfileInput } from "@/server/validators/user";

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export async function getOwnProfile(userId: string) {
  const user = await findUserProfileById(userId);
  if (!user) throw new UserNotFoundError();
  return user;
}

export async function updateOwnProfile(userId: string, input: UpdateOwnProfileInput) {
  return db.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!existing) throw new UserNotFoundError();

    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
      },
      select: publicUserSelect,
    });

    const changedFields = [
      existing.firstName !== updated.firstName ? "firstName" : null,
      existing.lastName !== updated.lastName ? "lastName" : null,
    ].filter((value): value is string => Boolean(value));

    if (changedFields.length > 0) {
      await writeAuditLog(tx, {
        actorId: userId,
        action: "USER_PROFILE_UPDATED",
        targetType: "User",
        targetId: userId,
        metadata: { changedFields },
      });
    }

    return updated;
  });
}
