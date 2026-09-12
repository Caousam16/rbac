import Link from "next/link";
import { AuthShell, buttonClass, inputClass } from "@/components/auth/auth-shell";
import { registerAction } from "@/server/auth/actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Create account" description="Passwords require at least 12 characters, upper/lowercase letters, and a number." footer={<Link className="underline" href="/login">Already have an account? Sign in</Link>}>
      {params.error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to create the account. Check the form or try again later.</p> : null}
      <form action={registerAction} className="space-y-4">
        <label className="block text-sm font-medium">First name<input className={inputClass} name="firstName" autoComplete="given-name" required maxLength={80} /></label>
        <label className="block text-sm font-medium">Last name<input className={inputClass} name="lastName" autoComplete="family-name" required maxLength={80} /></label>
        <label className="block text-sm font-medium">Email<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
        <label className="block text-sm font-medium">Password<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label>
        <button className={buttonClass} type="submit">Create account</button>
      </form>
    </AuthShell>
  );
}
