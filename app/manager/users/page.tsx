import Link from "next/link";
import { redirect } from "next/navigation";
import { AssignedUsersTable } from "@/components/manager/assigned-users-table";
import { ManagerShell } from "@/components/manager/manager-shell";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { getAssignedUsersPage } from "@/server/services/manager-dashboard.service";

export default async function ManagerUsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  let manager;
  try {
    manager = await requirePermission(PERMISSIONS.MANAGER_READ_ASSIGNED_USERS);
  } catch {
    redirect("/dashboard");
  }
  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");
  const result = await getAssignedUsersPage(manager.id, requestedPage);

  return (
    <ManagerShell user={manager}>
      <div className="mb-5"><h2 className="text-xl font-semibold text-slate-950">Assigned users</h2><p className="mt-1 text-sm text-slate-500">{result.total} user{result.total === 1 ? "" : "s"} in your explicit assignment scope.</p></div>
      <AssignedUsersTable rows={result.users} />
      {result.total > 0 && <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Assigned users pagination">
        <span className="text-slate-500">Page {result.page} of {result.totalPages}</span>
        <div className="flex gap-2">
          {result.page > 1 && <Link className="dashboard-action-link" href={`/manager/users?page=${result.page - 1}`}>Previous</Link>}
          {result.page < result.totalPages && <Link className="dashboard-action-link" href={`/manager/users?page=${result.page + 1}`}>Next</Link>}
        </div>
      </nav>}
    </ManagerShell>
  );
}
