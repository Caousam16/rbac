import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ManagerShell } from "@/components/manager/manager-shell";
import { requireManagerScope } from "@/server/permissions/guards";
import { findAssignedUserForManager } from "@/server/repositories/manager-assignment.repository";

export default async function ManagerUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  let manager;
  try {
    manager = await requireManagerScope(userId);
  } catch {
    redirect("/manager/users");
  }

  const assignment = await findAssignedUserForManager(manager.id, userId);
  if (!assignment) notFound();
  const user = assignment.user;

  return (
    <ManagerShell user={manager}>
      <div className="mb-5"><Link className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline" href="/manager/users">← Assigned users</Link></div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-sm font-medium text-slate-500">Assigned user</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">{user.firstName} {user.lastName}</h2><p className="mt-1 text-sm text-slate-500">{user.email}</p></div>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{user.status}</span>
        </div>
        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email verification</dt><dd className="mt-1 text-sm text-slate-900">{user.emailVerified ? "Verified" : "Pending"}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt><dd className="mt-1 text-sm text-slate-900">{user.role}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</dt><dd className="mt-1 text-sm text-slate-900">{user.createdAt.toLocaleDateString()}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Updated</dt><dd className="mt-1 text-sm text-slate-900">{user.updatedAt.toLocaleDateString()}</dd></div>
        </dl>
        <p className="mt-8 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-500">This record is visible only because an explicit manager assignment exists. Management mutations are intentionally deferred until the corresponding scoped workflows are defined.</p>
      </section>
    </ManagerShell>
  );
}
