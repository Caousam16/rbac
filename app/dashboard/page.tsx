import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, CalendarDays, CircleUserRound, ShieldCheck } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { requireAuth } from "@/server/auth/require-auth";
import { getUserDashboard } from "@/server/services/dashboard.service";

export default async function DashboardPage() {
  let authenticatedUser;
  try {
    authenticatedUser = await requireAuth();
  } catch {
    redirect("/login");
  }

  const dashboard = await getUserDashboard(authenticatedUser.id);

  return (
    <DashboardShell user={dashboard.user}>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Account summary">
        <SummaryCard
          icon={CircleUserRound}
          label="Account status"
          value={dashboard.summary.accountStatus}
          detail="Your current account state from the server."
        />
        <SummaryCard
          icon={BadgeCheck}
          label="Email verification"
          value={dashboard.summary.emailVerified ? "Verified" : "Pending"}
          detail={dashboard.summary.emailVerified ? "Your email has been verified." : "Verify your email when prompted."}
        />
        <SummaryCard
          icon={ShieldCheck}
          label="Access role"
          value={dashboard.user.role}
          detail="Role data is read from your authoritative account record."
        />
        <SummaryCard
          icon={CalendarDays}
          label="Member since"
          value={dashboard.summary.memberSince.toLocaleDateString(undefined, { month: "short", year: "numeric" })}
          detail={`Profile last updated ${dashboard.summary.lastUpdated.toLocaleDateString()}.`}
        />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-500">Only account events performed by your authenticated identity are shown.</p>
            </div>
          </div>
          <ActivityList activity={dashboard.recentActivity} />
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Account</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Manage the self-service information available to your account.</p>
            <div className="mt-5 grid gap-3">
              <Link className="dashboard-action-link" href="/account/profile">Edit profile</Link>
              <Link className="dashboard-action-link" href="/account/security">Security settings</Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Privacy boundary</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This dashboard is populated from your authenticated server identity. It does not accept another user&apos;s ID from the URL or browser payload.
            </p>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
