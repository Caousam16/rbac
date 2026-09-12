export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-5 w-32 rounded bg-slate-200" />
      <div className="mt-3 h-10 w-72 max-w-full rounded bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 rounded-2xl bg-slate-200" />)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="h-80 rounded-2xl bg-slate-200" />
        <div className="h-56 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}
