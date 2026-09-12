import { db } from "@/lib/db";

const ASSIGNED_USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  status: true,
  emailVerified: true,
  createdAt: true,
} as const;

export async function getManagerDashboardSnapshot(managerId: string) {
  const [assignments, totalAssigned, activeAssigned, suspendedAssigned, verifiedAssigned] =
    await Promise.all([
      db.managerAssignment.findMany({
        where: { managerId },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          createdAt: true,
          user: { select: ASSIGNED_USER_SELECT },
        },
      }),
      db.managerAssignment.count({ where: { managerId } }),
      db.managerAssignment.count({ where: { managerId, user: { status: "ACTIVE" } } }),
      db.managerAssignment.count({ where: { managerId, user: { status: "SUSPENDED" } } }),
      db.managerAssignment.count({ where: { managerId, user: { emailVerified: { not: null } } } }),
    ]);

  return {
    assignments,
    metrics: {
      totalAssigned,
      activeAssigned,
      suspendedAssigned,
      verifiedAssigned,
    },
  };
}

export async function listAssignedUsersForManager(
  managerId: string,
  options: { skip: number; take: number },
) {
  const where = { managerId } as const;
  const [rows, total] = await Promise.all([
    db.managerAssignment.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: [{ user: { lastName: "asc" } }, { user: { firstName: "asc" } }],
      select: {
        id: true,
        createdAt: true,
        user: { select: ASSIGNED_USER_SELECT },
      },
    }),
    db.managerAssignment.count({ where }),
  ]);

  return { rows, total };
}
