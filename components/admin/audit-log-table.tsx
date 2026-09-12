import { auditActionLabel } from "@/server/audit/presentation";

type Row = {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  actor: { id: string; email: string; firstName: string; lastName: string } | null;
};

export function AuditLogTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="font-medium text-slate-900">No audit events found</p><p className="mt-1 text-sm text-slate-500">Try changing the filters.</p></div>;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Metadata</th><th className="px-4 py-3">Time</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id} className="align-top"><td className="px-4 py-4"><p className="font-medium text-slate-900">{auditActionLabel(row.action)}</p><code className="mt-1 block text-xs text-slate-500">{row.action}</code></td><td className="px-4 py-4 text-slate-700">{row.actor ? <><p>{row.actor.firstName} {row.actor.lastName}</p><p className="text-xs text-slate-500">{row.actor.email}</p></> : <span className="text-slate-500">System / deleted actor</span>}</td><td className="px-4 py-4"><p className="text-slate-700">{row.targetType}</p><p className="max-w-48 truncate text-xs text-slate-500" title={row.targetId ?? undefined}>{row.targetId ?? "—"}</p></td><td className="px-4 py-4"><pre className="max-w-72 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-2 text-xs text-slate-600">{row.metadata ? JSON.stringify(row.metadata, null, 2) : "—"}</pre></td><td className="whitespace-nowrap px-4 py-4 text-slate-500">{row.createdAt.toLocaleString()}</td></tr>)}</tbody></table></div></div>;
}
