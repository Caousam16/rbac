import { db } from "@/lib/db";
import type { AdminUserListQuery } from "@/server/validators/admin-user";

export const ADMIN_USERS_PAGE_SIZE = 20;

const publicUserSelect = {
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

function userWhere(query: AdminUserListQuery) {
  return {
    ...(query.role !== "ALL" ? { role: query.role } : {}),
    ...(query.status !== "ALL" ? { status: query.status } : {}),
    ...(query.q
      ? {
          OR: [
            { email: { contains: query.q, mode: "insensitive" as const } },
            { firstName: { contains: query.q, mode: "insensitive" as const } },
            { lastName: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function listAdminUsers(query: AdminUserListQuery) {
  const where = userWhere(query);
  const [rows, total] = await db.$transaction([
    db.user.findMany({
      where,
      select: publicUserSelect,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * ADMIN_USERS_PAGE_SIZE,
      take: ADMIN_USERS_PAGE_SIZE,
    }),
    db.user.count({ where }),
  ]);
  return { rows, total };
}

export function findAdminUserById(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      ...publicUserSelect,
      managerAssignments: {
        select: {
          manager: { select: { id: true, firstName: true, lastName: true, email: true, status: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      userAssignments: {
        select: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, status: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });
}

export function listEligibleManagers() {
  return db.user.findMany({
    where: { role: "MANAGER", status: "ACTIVE" },
    select: { id: true, firstName: true, lastName: true, email: true },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    take: 200,
  });
}

