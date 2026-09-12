import Link from "next/link";

type AssignedUserRow = {
  id: string;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    emailVerified: Date | null;
  };
};

export function AssignedUsersTable({ rows }: { rows: AssignedUserRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="font-semibold text-slate-950">No assigned users</h2>
        <p className="mt-2 text-sm text-slate-500">An administrator must create manager assignments before users appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3">User</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Assigned</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-4 font-medium text-slate-900">{row.user.firstName} {row.user.lastName}</td>
              <td className="px-5 py-4 text-slate-600">{row.user.status}</td>
              <td className="px-5 py-4 text-slate-600">{row.user.emailVerified ? "Verified" : "Pending verification"}</td>
              <td className="px-5 py-4 text-slate-600">{row.createdAt.toLocaleDateString()}</td>
              <td className="px-5 py-4 text-right"><Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href={`/manager/users/${row.user.id}`}>View user</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
