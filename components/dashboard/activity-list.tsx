import { Clock3 } from "lucide-react";
import type { DashboardActivity } from "@/server/services/dashboard.service";

export function ActivityList({ activity }: { activity: readonly DashboardActivity[] }) {
  if (activity.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
        <Clock3 className="mx-auto size-6 text-slate-400" aria-hidden="true" />
        <p className="mt-3 font-medium text-slate-700">No recent activity</p>
        <p className="mt-1 text-sm text-slate-500">Account events you perform will appear here.</p>
      </div>
    );
  }

  return (
    <ol className="divide-y divide-slate-100">
      {activity.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div>
            <p className="font-medium text-slate-800">{item.label}</p>
            <p className="mt-1 text-sm text-slate-500">{item.target}</p>
          </div>
          <time className="shrink-0 text-xs text-slate-500" dateTime={item.createdAt.toISOString()}>
            {item.createdAt.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </li>
      ))}
    </ol>
  );
}
