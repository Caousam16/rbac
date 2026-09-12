import { db } from "@/lib/db";
import { writeAuditLog } from "@/server/audit/write";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { createOpaqueToken, hashOpaqueToken } from "@/server/auth/tokens";

export async function registerUser(input: { firstName: string; lastName: string; email: string; password: string }) {
  const passwordHash = await hashPassword(input.password);
  const rawToken = createOpaqueToken();
  const tokenHash = hashOpaqueToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60_000);

  const user = await db.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
      },
      select: { id: true, email: true },
    });

    await tx.emailVerificationToken.create({
      data: { userId: created.id, tokenHash, expiresAt },
    });

    await writeAuditLog(tx, { actorId: created.id, action: "AUTH_REGISTER", targetType: "User", targetId: created.id });

    return created;
  });

  return { user, verificationToken: rawToken };
}

export async function verifyEmailToken(rawToken: string): Promise<boolean> {
  const tokenHash = hashOpaqueToken(rawToken);
  const token = await db.emailVerificationToken.findUnique({ where: { tokenHash } });
  if (!token || token.expiresAt <= new Date()) return false;

  await db.$transaction([
    db.emailVerificationToken.delete({ where: { id: token.id } }),
    db.user.update({ where: { id: token.userId }, data: { emailVerified: new Date() } }),
    db.emailVerificationToken.deleteMany({ where: { userId: token.userId } }),
  ]);
  return true;
}

export async function createPasswordReset(email: string) {
  const user = await db.user.findUnique({ where: { email }, select: { id: true, email: true, status: true } });
  if (!user || user.status !== "ACTIVE") return null;

  const rawToken = createOpaqueToken();
  const tokenHash = hashOpaqueToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60_000);

  await db.$transaction([
    db.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    db.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } }),
  ]);

  return { email: user.email, token: rawToken };
}

export async function resetPasswordWithToken(rawToken: string, newPassword: string): Promise<boolean> {
  const tokenHash = hashOpaqueToken(rawToken);
  const token = await db.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!token || token.expiresAt <= new Date()) return false;

  const passwordHash = await hashPassword(newPassword);
  await db.$transaction([
    db.passwordResetToken.delete({ where: { id: token.id } }),
    db.user.update({
      where: { id: token.userId },
      data: { passwordHash, authVersion: { increment: 1 } },
    }),
    db.passwordResetToken.deleteMany({ where: { userId: token.userId } }),
    writeAuditLog(db, { actorId: token.userId, action: "AUTH_PASSWORD_RESET", targetType: "User", targetId: token.userId }),
  ]);

  return true;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user?.passwordHash || !(await verifyPassword(currentPassword, user.passwordHash))) return false;

  const passwordHash = await hashPassword(newPassword);
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { passwordHash, authVersion: { increment: 1 } } }),
    db.passwordResetToken.deleteMany({ where: { userId } }),
    writeAuditLog(db, { actorId: userId, action: "AUTH_PASSWORD_CHANGED", targetType: "User", targetId: userId }),
  ]);
  return true;
}
