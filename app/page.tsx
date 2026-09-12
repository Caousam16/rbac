import Link from "next/link";
import { ShieldCheck, Users, UserCog } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/server/auth/actions";

const roles = [
  { name: "USER", detail: "Own account and authorized resources only", icon: Users },
  { name: "MANAGER", detail: "Assigned operational scope only", icon: UserCog },
  { name: "ADMIN", detail: "System administration with audited high-risk actions", icon: ShieldCheck },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-6 py-16">
      <section className="space-y-4">
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">Authentication ready</span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Secure role-based application foundation</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">Next.js App Router, PostgreSQL, Prisma, Auth.js credentials authentication, strict TypeScript, and explicit manager scope modeling.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {session?.user ? (
            <>
              <Link className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white" href="/dashboard">Dashboard</Link>
              <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium" href="/account/security">Security settings</Link>
              <form action={logoutAction}><button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium" type="submit">Sign out</button></form>
            </>
          ) : (
            <>
              <Link className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white" href="/login">Sign in</Link>
              <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium" href="/register">Create account</Link>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Application roles">
        {roles.map(({ name, detail, icon: Icon }) => (
          <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Icon className="mb-4 size-6" aria-hidden="true" />
            <h2 className="font-semibold text-slate-950">{name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
