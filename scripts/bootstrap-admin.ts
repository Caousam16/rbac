import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { AccountStatus, Role } from "../generated/prisma/enums";
import { hashPassword } from "../server/auth/password";
import { registerSchema } from "../server/validators/auth";

const databaseUrl = process.env.DATABASE_URL;
const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

if (!databaseUrl || !email || !bootstrapPassword) {
  throw new Error(
    "DATABASE_URL, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD are required."
  );
}

const password: string = bootstrapPassword;

const passwordCheck = registerSchema.shape.password.safeParse(password);

if (!passwordCheck.success) {
  throw new Error(
    "BOOTSTRAP_ADMIN_PASSWORD does not meet password requirements."
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const passwordHash = await hashPassword(password);

  await prisma.$transaction(async (tx) => {
    const activation = await tx.user.updateMany({
      where: {
        email,
        role: Role.ADMIN,
        status: AccountStatus.INACTIVE,
        passwordHash: null,
      },
      data: {
        passwordHash,
        status: AccountStatus.ACTIVE,
        emailVerified: new Date(),
        authVersion: { increment: 1 },
      },
    });

    if (activation.count !== 1) {
      throw new Error(
        "Refusing bootstrap: account must exist as an INACTIVE ADMIN with no credentials."
      );
    }

    const user = await tx.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });

    await tx.auditLog.create({
      data: {
        actorId: user.id,
        action: "AUTH_ADMIN_BOOTSTRAPPED",
        targetType: "User",
        targetId: user.id,
      },
    });
  });

  console.log(`Activated pre-seeded admin account: ${email}`);
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Failed to bootstrap admin account."
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });