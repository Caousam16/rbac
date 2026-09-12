"use client";
export default function ManagerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-4 py-16"><div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h1 className="text-xl font-semibold text-slate-950">Manager dashboard unavailable</h1><p className="mt-2 text-sm text-slate-500">The dashboard could not be loaded. Internal error details are not exposed.</p><button className="mt-5 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white" onClick={reset} type="button">Try again</button></div></main>;
}
