import { findDashboardSnapshot } from "@/server/repositories/dashboard.repository";
import { describeAuditAction } from "@/server/services/dashboard-activity";
import { UserNotFoundError } from "@/server/services/user.service";

export { describeAuditAction } from "@/server/services/dashboard-activity";

export type DashboardActivity = {
  id: string;
  label: string;
  target: string;
  createdAt: Date;
};

export async function getUserDashboard(userId: string) {
  const snapshot = await findDashboardSnapshot(userId);
  if (!snapshot.user) throw new UserNotFoundError();

  return {
    user: snapshot.user,
    summary: {
      emailVerified: Boolean(snapshot.user.emailVerified),
      accountStatus: snapshot.user.status,
      memberSince: snapshot.user.createdAt,
      lastUpdated: snapshot.user.updatedAt,
    },
    recentActivity: snapshot.recentActivity.map<DashboardActivity>((event) => ({
      id: event.id,
      label: describeAuditAction(event.action),
      target: event.targetType,
      createdAt: event.createdAt,
    })),
  };
}
