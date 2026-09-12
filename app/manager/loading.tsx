export default function ManagerLoading() {
  return <main className="mx-auto max-w-6xl px-4 py-8"><div className="animate-pulse space-y-6"><div className="h-9 w-64 rounded bg-slate-200" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 rounded-2xl bg-slate-200" />)}</div><div className="h-72 rounded-2xl bg-slate-200" /></div></main>;
}
