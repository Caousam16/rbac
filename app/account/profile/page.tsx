import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonClass, inputClass } from "@/components/auth/auth-shell";
import { requireAuth } from "@/server/auth/require-auth";
import { getOwnProfile } from "@/server/services/user.service";
import { updateOwnProfileAction } from "@/server/user/actions";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let sessionUser;
  try {
    sessionUser = await requireAuth();
  } catch {
    redirect("/login");
  }

  const profile = await getOwnProfile(sessionUser.id);
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/dashboard" className="text-sm underline">← Dashboard</Link>
      <h1 className="mt-6 text-2xl font-semibold">Profile</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Manage the profile information you are permitted to change.
      </p>

      {params.updated ? (
        <p className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
          Profile updated successfully.
        </p>
      ) : null}
      {params.error ? (
        <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          Profile update failed. Check the entered names and try again.
        </p>
      ) : null}

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <form action={updateOwnProfileAction} className="space-y-4">
          <label className="block text-sm font-medium">
            First name
            <input
              className={inputClass}
              name="firstName"
              defaultValue={profile.firstName}
              autoComplete="given-name"
              maxLength={80}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Last name
            <input
              className={inputClass}
              name="lastName"
              defaultValue={profile.lastName}
              autoComplete="family-name"
              maxLength={80}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input className={`${inputClass} bg-zinc-50`} value={profile.email} readOnly disabled />
          </label>
          <p className="text-xs text-zinc-500">
            Email, role, and account status cannot be changed through self-service profile editing.
          </p>
          <button className={buttonClass} type="submit">Save profile</button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 text-sm">
        <h2 className="font-semibold">Account details</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><dt className="text-zinc-500">Role</dt><dd className="font-medium">{profile.role}</dd></div>
          <div><dt className="text-zinc-500">Status</dt><dd className="font-medium">{profile.status}</dd></div>
          <div><dt className="text-zinc-500">Email verified</dt><dd className="font-medium">{profile.emailVerified ? "Yes" : "No"}</dd></div>
          <div><dt className="text-zinc-500">Member since</dt><dd className="font-medium">{profile.createdAt.toLocaleDateString()}</dd></div>
        </dl>
      </section>
    </main>
  );
}
