import { db } from "@/lib/db";

const RECENT_USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  emailVerified: true,
  createdAt: true,
} as const;

export const ADMIN_DASHBOARD_RECENT_LIMIT = 8;

export async function getAdminDashboardSnapshot() {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    suspendedUsers,
    managers,
    administrators,
    verifiedUsers,
    recentRegistrations,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { status: "INACTIVE" } }),
    db.user.count({ where: { status: "SUSPENDED" } }),
    db.user.count({ where: { role: "MANAGER" } }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.user.count({ where: { emailVerified: { not: null } } }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: ADMIN_DASHBOARD_RECENT_LIMIT,
      select: RECENT_USER_SELECT,
    }),
  ]);

  return {
    metrics: {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      managers,
      administrators,
      verifiedUsers,
    },
    recentRegistrations,
  };
}

export async function getRecentAdminAuditEvents() {
  return db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: ADMIN_DASHBOARD_RECENT_LIMIT,
    select: {
      id: true,
      action: true,
      targetType: true,
      targetId: true,
      createdAt: true,
      actor: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}
