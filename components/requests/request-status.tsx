export function RequestStatus({ status }: { status: "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED" }) {
  return <span className="inline-flex rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">{status}</span>;
}
