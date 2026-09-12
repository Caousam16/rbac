import Link from "next/link";
import { redirect } from "next/navigation";
import { RequestStatus } from "@/components/requests/request-status";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { getOwnRequests } from "@/server/services/request.service";

export default async function RequestsPage() {
  let user; try { user = await requirePermission(PERMISSIONS.RECORD_READ_OWN); } catch { redirect("/login"); }
  const rows = await getOwnRequests(user.id);
  return <DashboardShell user={user}><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">My requests</h2><p className="mt-1 text-sm text-slate-500">Requests created by your account only.</p></div><Link className="dashboard-action-link" href="/requests/new">New request</Link></div><div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">{rows.length===0?<p className="p-6 text-sm text-slate-500">No requests yet.</p>:<ul className="divide-y divide-slate-200">{rows.map(r=><li key={r.id} className="flex items-center justify-between gap-4 p-4"><div><Link href={`/requests/${r.id}`} className="font-medium text-slate-950 hover:underline">{r.title}</Link><p className="mt-1 text-xs text-slate-500">{r.createdAt.toLocaleString()}</p></div><RequestStatus status={r.status}/></li>)}</ul>}</div></DashboardShell>;
}
