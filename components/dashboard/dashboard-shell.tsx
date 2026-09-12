import Link from "next/link";
import { FileText, LayoutDashboard, LockKeyhole, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { logoutAction } from "@/server/auth/actions";

type DashboardUser = {
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN";
};

export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  const displayName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-950">
            <ShieldCheck className="size-5" aria-hidden="true" />
            RBAC Platform
          </Link>

          <nav className="flex flex-wrap items-center gap-1" aria-label="Account navigation">
            <Link className="dashboard-nav-link" href="/dashboard">
              <LayoutDashboard className="size-4" aria-hidden="true" /> Dashboard
            </Link>
            <Link className="dashboard-nav-link" href="/requests"><FileText className="size-4" aria-hidden="true" /> Requests</Link>
            {user.role === "MANAGER" && (
              <Link className="dashboard-nav-link" href="/manager">Manager</Link>
            )}
            {user.role === "ADMIN" && (
              <Link className="dashboard-nav-link" href="/admin">Admin</Link>
            )}
            <Link className="dashboard-nav-link" href="/account/profile">
              <UserRound className="size-4" aria-hidden="true" /> Profile
            </Link>
            <Link className="dashboard-nav-link" href="/account/security">
              <LockKeyhole className="size-4" aria-hidden="true" /> Security
            </Link>
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
            <p className="text-sm font-medium text-slate-500">Personal dashboard</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Welcome, {displayName}
            </h1>
          </div>
          <div className="text-sm text-slate-500 sm:text-right">
            <p>{user.email}</p>
            <p className="mt-1 font-medium text-slate-700">{user.role}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
