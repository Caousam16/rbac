export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading admin dashboard">
      <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="mt-8 h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
    </main>
  );
}
