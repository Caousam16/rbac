import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, CircleAlert, CircleUserRound, UsersRound } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { AssignedUsersTable } from "@/components/manager/assigned-users-table";
import { ManagerShell } from "@/components/manager/manager-shell";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { getManagerDashboard } from "@/server/services/manager-dashboard.service";

export default async function ManagerDashboardPage() {
  let manager;
  try {
    manager = await requirePermission(PERMISSIONS.MANAGER_READ_ASSIGNED_USERS);
  } catch {
    redirect("/dashboard");
  }

  const dashboard = await getManagerDashboard(manager.id);

  return (
    <ManagerShell user={manager}>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Assigned user summary">
        <SummaryCard icon={UsersRound} label="Assigned users" value={String(dashboard.metrics.totalAssigned)} detail="Explicit ManagerAssignment records only." />
        <SummaryCard icon={CircleUserRound} label="Active users" value={String(dashboard.metrics.activeAssigned)} detail="Assigned accounts currently marked ACTIVE." />
        <SummaryCard icon={BadgeCheck} label="Verified email" value={String(dashboard.metrics.verifiedAssigned)} detail="Assigned users with verified email addresses." />
        <SummaryCard icon={CircleAlert} label="Needs verification" value={String(dashboard.metrics.verificationPending)} detail="Assigned users whose email is not yet verified." />
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><h2 className="text-lg font-semibold text-slate-950">Recently assigned users</h2><p className="mt-1 text-sm text-slate-500">Only users in your authorized manager scope are returned.</p></div>
          <Link className="dashboard-action-link" href="/manager/users">View all</Link>
        </div>
        <AssignedUsersTable rows={dashboard.assignments} />
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Operational workflows</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Request workflows are now available for users in your assigned scope. Review submitted requests from the Requests section; all decisions are enforced and audited server-side.</p>
      </section>
    </ManagerShell>
  );
}
