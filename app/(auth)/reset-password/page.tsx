import { AuthShell, buttonClass, inputClass } from "@/components/auth/auth-shell";
import { resetPasswordAction } from "@/server/auth/actions";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  return (
    <AuthShell title="Choose a new password" description="This reset link can be used once and expires after 60 minutes.">
      {!token ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">This reset link is invalid.</p> : (
        <form action={resetPasswordAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />
          <label className="block text-sm font-medium">New password<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label>
          <button className={buttonClass} type="submit">Reset password</button>
        </form>
      )}
    </AuthShell>
  );
}
