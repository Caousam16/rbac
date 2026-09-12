import Link from "next/link";
import { FileClock, Files, LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";
import { logoutAction } from "@/server/auth/actions";

type AdminShellUser = {
  firstName: string;
  lastName: string;
  email: string;
};

export function AdminShell({
  user,
  children,
}: {
  user: AdminShellUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-slate-950">
            <ShieldCheck className="size-5" aria-hidden="true" /> Admin workspace
          </Link>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Admin navigation">
            <Link className="dashboard-nav-link" href="/admin">
              <LayoutDashboard className="size-4" aria-hidden="true" /> Overview
            </Link>
            <Link className="dashboard-nav-link" href="/admin/users">
              <Users className="size-4" aria-hidden="true" /> Users
            </Link>
            <Link className="dashboard-nav-link" href="/admin/requests"><Files className="size-4" aria-hidden="true" /> Requests</Link>
            <Link className="dashboard-nav-link" href="/admin/audit-logs">
              <FileClock className="size-4" aria-hidden="true" /> Audit logs
            </Link>
            <Link className="dashboard-nav-link" href="/dashboard">My dashboard</Link>
            <form action={logoutAction}>
              <button className="dashboard-nav-link" type="submit">
                <LogOut className="size-4" aria-hidden="true" /> Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Administration</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              System overview
            </h1>
          </div>
          <div className="text-sm text-slate-500 sm:text-right">
            <p>{user.firstName} {user.lastName}</p>
            <p className="mt-1">{user.email}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
