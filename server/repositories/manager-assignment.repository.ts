import { db } from "@/lib/db";

export function managerHasUserAssignment(managerId: string, userId: string) {
  return db.managerAssignment.findUnique({
    where: {
      managerId_userId: { managerId, userId },
    },
    select: { id: true },
  });
}

export function findAssignedUserForManager(managerId: string, userId: string) {
  return db.managerAssignment.findUnique({
    where: {
      managerId_userId: { managerId, userId },
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}
