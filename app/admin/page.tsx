import { redirect } from "next/navigation";
import {
  BadgeCheck,
  CirclePause,
  CircleUserRound,
  ShieldCheck,
  ShieldX,
  UsersRound,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { RecentAuditList } from "@/components/admin/recent-audit-list";
import { RecentUsersTable } from "@/components/admin/recent-users-table";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { getAdminDashboard } from "@/server/services/admin-dashboard.service";

export default async function AdminDashboardPage() {
  let admin;
  try {
    admin = await requirePermission(PERMISSIONS.ADMIN_READ_USERS);
    await requirePermission(PERMISSIONS.ADMIN_VIEW_AUDIT_LOGS);
  } catch {
    redirect("/dashboard");
  }

  const dashboard = await getAdminDashboard();

  return (
    <AdminShell user={admin}>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="System account summary">
        <SummaryCard icon={UsersRound} label="Total accounts" value={String(dashboard.metrics.totalUsers)} detail="All accounts currently stored in the system." />
        <SummaryCard icon={CircleUserRound} label="Active accounts" value={String(dashboard.metrics.activeUsers)} detail="Accounts currently allowed to authenticate." />
        <SummaryCard icon={ShieldCheck} label="Managers" value={String(dashboard.metrics.managers)} detail="Accounts assigned the MANAGER role." />
        <SummaryCard icon={BadgeCheck} label="Verified email" value={String(dashboard.metrics.verifiedUsers)} detail="Accounts with a verified email timestamp." />
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Administrative account status summary">
        <SummaryCard icon={CirclePause} label="Inactive accounts" value={String(dashboard.metrics.inactiveUsers)} detail="Accounts intentionally inactive and unable to authenticate." />
        <SummaryCard icon={ShieldX} label="Suspended accounts" value={String(dashboard.metrics.suspendedUsers)} detail="Accounts blocked because their status is SUSPENDED." />
        <SummaryCard icon={ShieldCheck} label="Administrators" value={String(dashboard.metrics.administrators)} detail="Accounts currently assigned the ADMIN role." />
        <SummaryCard icon={BadgeCheck} label="Needs verification" value={String(dashboard.metrics.unverifiedUsers)} detail="Accounts that do not yet have a verified email timestamp." />
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">Recent registrations</h2>
          <p className="mt-1 text-sm text-slate-500">A bounded system-wide view for administrative awareness. Management actions are intentionally deferred to Step 9.</p>
        </div>
        <RecentUsersTable rows={dashboard.recentRegistrations} />
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">Recent audit activity</h2>
          <p className="mt-1 text-sm text-slate-500">Sensitive audit metadata and IP addresses are not displayed in this dashboard summary.</p>
        </div>
        <RecentAuditList events={dashboard.recentAuditEvents} />
      </section>
    </AdminShell>
  );
}
