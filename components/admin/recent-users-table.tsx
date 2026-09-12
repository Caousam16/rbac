type RecentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "MANAGER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  emailVerified: Date | null;
  createdAt: Date;
};

export function RecentUsersTable({ rows }: { rows: readonly RecentUser[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="font-medium text-slate-900">No registrations yet</p>
        <p className="mt-1 text-sm text-slate-500">Newly created accounts will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Verified</th>
            <th className="px-5 py-3">Registered</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((user) => (
            <tr key={user.id}>
              <td className="px-5 py-4">
                <p className="font-medium text-slate-950">{user.firstName} {user.lastName}</p>
                <p className="mt-1 text-xs text-slate-500">{user.email}</p>
              </td>
              <td className="px-5 py-4 text-slate-700">{user.role}</td>
              <td className="px-5 py-4 text-slate-700">{user.status}</td>
              <td className="px-5 py-4 text-slate-700">{user.emailVerified ? "Yes" : "No"}</td>
              <td className="px-5 py-4 text-slate-500">{user.createdAt.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
