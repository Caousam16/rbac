type AuditEvent = {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  createdAt: Date;
  actor: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
};

export function RecentAuditList({ events }: { events: readonly AuditEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="font-medium text-slate-900">No audit activity yet</p>
        <p className="mt-1 text-sm text-slate-500">Administrative and security events will appear here.</p>
      </div>
    );
  }

  return (
    <ol className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {events.map((event) => {
        const actorName = event.actor
          ? `${event.actor.firstName} ${event.actor.lastName}`.trim() || event.actor.email
          : "System";

        return (
          <li key={event.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-medium text-slate-950">{event.action}</p>
              <p className="mt-1 text-sm text-slate-500">
                {actorName} · {event.targetType}{event.targetId ? ` · ${event.targetId}` : ""}
              </p>
            </div>
            <time className="shrink-0 text-xs text-slate-500" dateTime={event.createdAt.toISOString()}>
              {event.createdAt.toLocaleString()}
            </time>
          </li>
        );
      })}
    </ol>
  );
}
