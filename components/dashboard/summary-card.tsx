import type { LucideIcon } from "lucide-react";

export function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
          <p className="mt-2 text-sm leading-5 text-slate-500">{detail}</p>
        </div>
        <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
