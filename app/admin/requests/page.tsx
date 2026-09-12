import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { RequestStatus } from "@/components/requests/request-status";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { getAdminRequests } from "@/server/services/request.service";
export default async function AdminRequestsPage(){let user;try{user=await requirePermission(PERMISSIONS.ADMIN_READ_RECORDS)}catch{redirect("/dashboard")};const rows=await getAdminRequests();return <AdminShell user={user}><h2 className="text-xl font-semibold">System requests</h2><p className="mt-1 text-sm text-slate-500">Read-only system-wide request visibility.</p><div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">{rows.length===0?<p className="p-6 text-sm text-slate-500">No requests found.</p>:<ul className="divide-y divide-slate-200">{rows.map(r=><li key={r.id} className="flex items-center justify-between gap-4 p-4"><div><p className="font-medium">{r.title}</p><p className="mt-1 text-xs text-slate-500">{r.user.firstName} {r.user.lastName} · {r.user.email}</p></div><RequestStatus status={r.status}/></li>)}</ul>}</div></AdminShell>}
