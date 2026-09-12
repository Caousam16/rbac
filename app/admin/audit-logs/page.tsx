import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AuditLogTable } from "@/components/admin/audit-log-table";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { getAuditLogBrowser } from "@/server/services/audit-log.service";

export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  let admin;
  try { admin = await requirePermission(PERMISSIONS.ADMIN_VIEW_AUDIT_LOGS); } catch { redirect("/dashboard"); }
  const result = await getAuditLogBrowser(await searchParams);
  const urlFor = (page: number) => {
    const params = new URLSearchParams({ page: String(page) });
    for (const key of ["q", "action", "targetType", "from", "to"] as const) if (result.query[key]) params.set(key, String(result.query[key]));
    return `/admin/audit-logs?${params.toString()}`;
  };
  return <AdminShell user={admin}>
    <div className="mb-5"><h2 className="text-xl font-semibold text-slate-950">Audit logs</h2><p className="mt-1 text-sm text-slate-500">Review security and administrative events. Sensitive metadata keys are redacted server-side.</p></div>
    <form className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-6" method="get">
      <label className="md:col-span-2"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Actor / target ID</span><input name="q" defaultValue={result.query.q} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Email, name, target ID" /></label>
      <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Action</span><input name="action" defaultValue={result.query.action} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="ADMIN_" /></label>
      <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target type</span><input name="targetType" defaultValue={result.query.targetType} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="User" /></label>
      <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">From</span><input type="date" name="from" defaultValue={result.query.from} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" /></label>
      <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">To</span><input type="date" name="to" defaultValue={result.query.to} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" /></label>
      <div className="md:col-span-6 flex gap-2"><button className="dashboard-action-link" type="submit">Apply filters</button><Link className="dashboard-nav-link" href="/admin/audit-logs">Clear</Link></div>
    </form>
    <p className="mb-3 text-sm text-slate-500">{result.total} event{result.total === 1 ? "" : "s"}</p>
    <AuditLogTable rows={result.rows} />
    {result.total > 0 && <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Audit log pagination"><span className="text-slate-500">Page {result.query.page} of {result.pages}</span><div className="flex gap-2">{result.query.page > 1 && <Link className="dashboard-action-link" href={urlFor(result.query.page - 1)}>Previous</Link>}{result.query.page < result.pages && <Link className="dashboard-action-link" href={urlFor(result.query.page + 1)}>Next</Link>}</div></nav>}
  </AdminShell>;
}
