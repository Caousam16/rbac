import { getManagerDashboardSnapshot, listAssignedUsersForManager } from "@/server/repositories/manager-dashboard.repository";

export const MANAGER_USERS_PAGE_SIZE = 20;

export async function getManagerDashboard(managerId: string) {
  const snapshot = await getManagerDashboardSnapshot(managerId);
  return {
    ...snapshot,
    metrics: {
      ...snapshot.metrics,
      verificationPending: snapshot.metrics.totalAssigned - snapshot.metrics.verifiedAssigned,
    },
  };
}

export async function getAssignedUsersPage(managerId: string, requestedPage: number) {
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const skip = (page - 1) * MANAGER_USERS_PAGE_SIZE;
  const result = await listAssignedUsersForManager(managerId, {
    skip,
    take: MANAGER_USERS_PAGE_SIZE,
  });

  return {
    users: result.rows,
    page,
    pageSize: MANAGER_USERS_PAGE_SIZE,
    total: result.total,
    totalPages: Math.max(1, Math.ceil(result.total / MANAGER_USERS_PAGE_SIZE)),
  };
}
