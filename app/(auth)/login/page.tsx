import Link from "next/link";
import { AuthShell, buttonClass, inputClass } from "@/components/auth/auth-shell";
import { loginAction } from "@/server/auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const invalid = params.error === "invalid_credentials";
  return (
    <AuthShell title="Sign in" description="Use your account credentials to continue." footer={<><Link className="underline" href="/register">Create account</Link><span className="px-2">·</span><Link className="underline" href="/forgot-password">Forgot password?</Link></>}>
      {invalid ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Invalid email, password, or account status.</p> : null}
      {params.registered ? <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Account created. You can sign in now.</p> : null}
      {params.password_reset || params.password_changed ? <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Password updated. Sign in with your new password.</p> : null}
      <form action={loginAction} className="space-y-4">
        <label className="block text-sm font-medium">Email<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
        <label className="block text-sm font-medium">Password<input className={inputClass} name="password" type="password" autoComplete="current-password" required /></label>
        <button className={buttonClass} type="submit">Sign in</button>
      </form>
    </AuthShell>
  );
}
