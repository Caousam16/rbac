import type { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-950">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-zinc-600">RBAC Platform</Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-zinc-600">{description}</p>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 border-t border-zinc-200 pt-5 text-sm text-zinc-600">{footer}</div> : null}
      </div>
    </main>
  );
}

export const inputClass = "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-zinc-900";
export const buttonClass = "w-full rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2";
