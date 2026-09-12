"use client";

import Link from "next/link";
export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-16">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Dashboard unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">We could not load your dashboard. No internal error details were exposed.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white" type="button" onClick={() => reset()}>Try again</button>
          <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium" href="/account/profile">Open profile</Link>
        </div>
      </section>
    </main>
  );
}
