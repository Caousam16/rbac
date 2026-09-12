import { env } from "@/lib/env";

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, html }),
  });

  if (!response.ok) {
    throw new Error(`Email delivery failed with status ${response.status}`);
  }

  return true;
}

export function sendVerificationEmail(email: string, token: string) {
  const url = new URL("/verify-email", env.APP_URL);
  url.searchParams.set("token", token);
  return sendEmail(email, "Verify your email", `<p>Verify your email address:</p><p><a href="${url.toString()}">Verify email</a></p><p>This link expires in 24 hours.</p>`);
}

export function sendPasswordResetEmail(email: string, token: string) {
  const url = new URL("/reset-password", env.APP_URL);
  url.searchParams.set("token", token);
  return sendEmail(email, "Reset your password", `<p>Reset your password:</p><p><a href="${url.toString()}">Reset password</a></p><p>This link expires in 60 minutes.</p>`);
}
