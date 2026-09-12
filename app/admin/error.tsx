"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-950">Admin dashboard unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">The administrative overview could not be loaded. No internal error details are exposed here.</p>
        <button type="button" onClick={reset} className="mt-5 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">
          Try again
        </button>
      </div>
    </main>
  );
}
