import { db } from "@/lib/db";

export const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findUserProfileById(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
}

export function updateUserProfileById(
  userId: string,
  data: { firstName: string; lastName: string },
) {
  return db.user.update({
    where: { id: userId },
    data,
    select: publicUserSelect,
  });
}
