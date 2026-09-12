import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { AccountStatus, Role } from "../generated/prisma/enums";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();

  if (!email) {
    console.log("No SEED_ADMIN_EMAIL provided; database seed completed without creating an admin account.");
    return;
  }

  const firstName = process.env.SEED_ADMIN_FIRST_NAME?.trim() || "System";
  const lastName = process.env.SEED_ADMIN_LAST_NAME?.trim() || "Administrator";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Seed admin skipped: ${email} already exists.`);
    return;
  }

  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      role: Role.ADMIN,
      status: AccountStatus.INACTIVE,
      passwordHash: null,
      emailVerified: null,
    },
  });

  console.log(`Created inactive bootstrap admin: ${email}`);
  console.log("Authentication setup must establish credentials and activate this account before it can sign in.");
}

main()
  .catch((error) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
