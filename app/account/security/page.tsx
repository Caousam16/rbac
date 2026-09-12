import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonClass, inputClass } from "@/components/auth/auth-shell";
import { changePasswordAction } from "@/server/auth/actions";
import { requireAuth } from "@/server/auth/require-auth";

export default async function SecurityPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    redirect("/login");
  }
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/dashboard" className="text-sm underline">← Dashboard</Link>
      <h1 className="mt-6 text-2xl font-semibold">Security</h1>
      <p className="mt-2 text-sm text-zinc-600">Signed in as {user.email}</p>
      <section className="mt-8 rounded-xl border border-zinc-200 p-6">
        <h2 className="font-semibold">Change password</h2>
        <p className="mt-1 text-sm text-zinc-600">Changing your password revokes all existing sessions, including this one.</p>
        {params.error ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Password change failed. Check your current password and password requirements.</p> : null}
        <form action={changePasswordAction} className="mt-5 space-y-4">
          <label className="block text-sm font-medium">Current password<input className={inputClass} name="currentPassword" type="password" autoComplete="current-password" required /></label>
          <label className="block text-sm font-medium">New password<input className={inputClass} name="newPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label>
          <button className={buttonClass} type="submit">Change password</button>
        </form>
      </section>
    </main>
  );
}
