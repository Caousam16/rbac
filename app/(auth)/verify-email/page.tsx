import Link from "next/link";
import { AuthShell, buttonClass } from "@/components/auth/auth-shell";
import { verifyEmailAction } from "@/server/auth/actions";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const status = typeof params.status === "string" ? params.status : "";

  if (status === "verified") {
    return <AuthShell title="Email verified" description="Your email address has been verified." footer={<Link className="underline" href="/login">Continue to sign in</Link>}><div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Verification complete.</div></AuthShell>;
  }

  if (status === "invalid" || !token) {
    return <AuthShell title="Verification failed" description="The verification link is invalid or expired." footer={<Link className="underline" href="/login">Continue to sign in</Link>}><div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">The token could not be verified.</div></AuthShell>;
  }

  return (
    <AuthShell title="Verify email" description="Confirm the verification request for your account.">
      <form action={verifyEmailAction}>
        <input type="hidden" name="token" value={token} />
        <button className={buttonClass} type="submit">Verify email</button>
      </form>
    </AuthShell>
  );
}
