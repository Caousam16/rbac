import { z } from "zod";

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(12).max(128)
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email,
  password,
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(256),
  password,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: password,
}).refine((value) => value.currentPassword !== value.newPassword, {
  message: "New password must be different from the current password",
  path: ["newPassword"],
});
