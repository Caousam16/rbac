import {
  getAdminDashboardSnapshot,
  getRecentAdminAuditEvents,
} from "@/server/repositories/admin-dashboard.repository";

export async function getAdminDashboard() {
  const [snapshot, recentAuditEvents] = await Promise.all([
    getAdminDashboardSnapshot(),
    getRecentAdminAuditEvents(),
  ]);

  return {
    ...snapshot,
    metrics: {
      ...snapshot.metrics,
      unverifiedUsers: snapshot.metrics.totalUsers - snapshot.metrics.verifiedUsers,
    },
    recentAuditEvents,
  };
}
