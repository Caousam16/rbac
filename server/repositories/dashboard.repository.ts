import { db } from "@/lib/db";

const dashboardUserSelect = {
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

export async function findDashboardSnapshot(userId: string) {
  const [user, recentActivity] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: dashboardUserSelect,
    }),
    db.auditLog.findMany({
      where: { actorId: userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        action: true,
        targetType: true,
        createdAt: true,
      },
    }),
  ]);

  return { user, recentActivity };
}
