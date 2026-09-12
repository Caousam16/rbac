import Link from "next/link";

type Row = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "MANAGER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  emailVerified: Date | null;
  createdAt: Date;
};

export function AdminUsersTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="font-semibold text-slate-950">No users found</h2><p className="mt-2 text-sm text-slate-500">Try changing the current search or filters.</p></div>;
  }
  return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Verification</th><th className="px-5 py-3">Created</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr></thead>
      <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="px-5 py-4"><div className="font-medium text-slate-950">{row.firstName} {row.lastName}</div><div className="mt-1 text-xs text-slate-500">{row.email}</div></td><td className="px-5 py-4 text-slate-600">{row.role}</td><td className="px-5 py-4 text-slate-600">{row.status}</td><td className="px-5 py-4 text-slate-600">{row.emailVerified ? "Verified" : "Pending"}</td><td className="px-5 py-4 text-slate-600">{row.createdAt.toLocaleDateString()}</td><td className="px-5 py-4 text-right"><Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href={`/admin/users/${row.id}`}>Manage</Link></td></tr>)}</tbody>
    </table>
  </div>;
}
