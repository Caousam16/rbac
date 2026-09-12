import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { AccountStatus, Role } from "../generated/prisma/enums";
import { hashPassword } from "../server/auth/password";
import { registerSchema } from "../server/validators/auth";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

const databaseUrl = requiredEnv("DATABASE_URL");
const email = requiredEnv("BOOTSTRAP_ADMIN_EMAIL").trim().toLowerCase();
const bootstrapPassword = requiredEnv("BOOTSTRAP_ADMIN_PASSWORD");

const passwordCheck = registerSchema.shape.password.safeParse(bootstrapPassword);

if (!passwordCheck.success) {
  throw new Error("BOOTSTRAP_ADMIN_PASSWORD does not meet password requirements.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error(
      "Bootstrap admin does not exist. Run db:seed with the matching SEED_ADMIN_EMAIL first.",
    );
  }

  if (
    user.role !== Role.ADMIN ||
    user.status !== AccountStatus.INACTIVE ||
    user.passwordHash !== null
  ) {
    throw new Error(
      "Refusing bootstrap: account must already be an INACTIVE ADMIN with no credentials.",
    );
  }

  const passwordHash = await hashPassword(bootstrapPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        status: AccountStatus.ACTIVE,
        emailVerified: new Date(),
        authVersion: { increment: 1 },
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "AUTH_ADMIN_BOOTSTRAPPED",
        targetType: "User",
        targetId: user.id,
      },
    }),
  ]);

  console.log(`Activated pre-seeded admin account: ${email}`);
}

main().finally(() => prisma.$disconnect());