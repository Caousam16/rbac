import Link from "next/link";
import { AuthShell, buttonClass, inputClass } from "@/components/auth/auth-shell";
import { forgotPasswordAction } from "@/server/auth/actions";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Reset password" description="Enter your email. If an active account exists, a reset link will be sent." footer={<Link className="underline" href="/login">Back to sign in</Link>}>
      {params.sent ? <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">If an eligible account exists, reset instructions have been sent.</p> : null}
      <form action={forgotPasswordAction} className="space-y-4">
        <label className="block text-sm font-medium">Email<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
        <button className={buttonClass} type="submit">Send reset link</button>
      </form>
    </AuthShell>
  );
}
