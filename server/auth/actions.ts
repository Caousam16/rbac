"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { enforceAuthRateLimit } from "@/server/auth/rate-limit";
import { requireAuth } from "@/server/auth/require-auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/server/email/auth-email.service";
import { changePassword, createPasswordReset, registerUser, resetPasswordWithToken, verifyEmailToken } from "@/server/services/auth.service";
import { changePasswordSchema, forgotPasswordSchema, registerSchema, resetPasswordSchema } from "@/server/validators/auth";


function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === "P2002";
}

async function requestFingerprint(email: string): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return `${ip}:${email}`;
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=invalid_credentials");
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/register?error=invalid_input");

  const { email } = parsed.data;
  try {
    await enforceAuthRateLimit("register", await requestFingerprint(email));
  } catch {
    redirect("/register?error=rate_limited");
  }

  try {
    const result = await registerUser(parsed.data);
    let delivered = false;
    try {
      delivered = await sendVerificationEmail(result.user.email, result.verificationToken);
    } catch {
      delivered = false;
    }
    redirect(`/login?registered=1&verification=${delivered ? "sent" : "unavailable"}`);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect("/register?error=account_exists");
    }
    throw error;
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/forgot-password?sent=1");

  try {
    await enforceAuthRateLimit("forgotPassword", await requestFingerprint(parsed.data.email));
    const reset = await createPasswordReset(parsed.data.email);
    if (reset) {
      try {
        await sendPasswordResetEmail(reset.email, reset.token);
      } catch {
        // Keep the response non-enumerating even when delivery fails.
      }
    }
  } catch {
    // Password-reset requests deliberately return the same result for all outcomes.
  }

  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/reset-password?token=${encodeURIComponent(String(formData.get("token") ?? ""))}&error=invalid_input`);

  const changed = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
  if (!changed) redirect("/forgot-password?error=expired_token");
  redirect("/login?password_reset=1");
}

export async function changePasswordAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/account/security?error=invalid_input");

  const changed = await changePassword(user.id, parsed.data.currentPassword, parsed.data.newPassword);
  if (!changed) redirect("/account/security?error=current_password");

  await signOut({ redirectTo: "/login?password_changed=1" });
}

export async function verifyEmailAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (token.length < 20 || token.length > 256) redirect("/verify-email?status=invalid");
  const verified = await verifyEmailToken(token);
  redirect(`/verify-email?status=${verified ? "verified" : "invalid"}`);
}
