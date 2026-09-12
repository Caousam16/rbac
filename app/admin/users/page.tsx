import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { getAdminUsers } from "@/server/services/admin-user.service";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  let admin;
  try { admin = await requirePermission(PERMISSIONS.ADMIN_READ_USERS); } catch { redirect("/dashboard"); }
  const params = await searchParams;
  const result = await getAdminUsers(params);
  const queryString = (page: number) => {
    const q = new URLSearchParams(); q.set("page", String(page));
    if (result.query.q) q.set("q", result.query.q);
    if (result.query.role !== "ALL") q.set("role", result.query.role);
    if (result.query.status !== "ALL") q.set("status", result.query.status);
    return q.toString();
  };
  return <AdminShell user={admin}>
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-semibold text-slate-950">User management</h2><p className="mt-1 text-sm text-slate-500">Search, filter, and manage accounts with server-side authorization.</p></div><Link className="dashboard-action-link" href="/admin/users/new">Create user</Link></div>
    <form className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4" method="get">
      <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search</span><input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" name="q" defaultValue={result.query.q} placeholder="Name or email" /></label>
      <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Role</span><select className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" name="role" defaultValue={result.query.role}><option>ALL</option><option>USER</option><option>MANAGER</option><option>ADMIN</option></select></label>
      <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span><select className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" name="status" defaultValue={result.query.status}><option>ALL</option><option>ACTIVE</option><option>INACTIVE</option><option>SUSPENDED</option></select></label>
      <div className="sm:col-span-4"><button className="dashboard-action-link" type="submit">Apply filters</button></div>
    </form>
    <p className="mb-3 text-sm text-slate-500">{result.total} account{result.total === 1 ? "" : "s"}</p>
    <AdminUsersTable rows={result.rows} />
    {result.total > 0 && <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Users pagination"><span className="text-slate-500">Page {result.query.page} of {result.pages}</span><div className="flex gap-2">{result.query.page > 1 && <Link className="dashboard-action-link" href={`/admin/users?${queryString(result.query.page - 1)}`}>Previous</Link>}{result.query.page < result.pages && <Link className="dashboard-action-link" href={`/admin/users?${queryString(result.query.page + 1)}`}>Next</Link>}</div></nav>}
  </AdminShell>;
}
