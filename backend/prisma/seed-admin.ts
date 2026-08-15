import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/utils/hash";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined. Check your .env file."
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@skybook.com";
  const password = "SkyBook@Admin123";

  const passwordHash =
    await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      firstName: "SkyBook",
      lastName: "Administrator",
      passwordHash,
      role: "ADMIN",
    },

    create: {
      firstName: "SkyBook",
      lastName: "Administrator",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("=================================");
  console.log("SKYBOOK ADMIN READY");
  console.log("=================================");
  console.log("ID:", admin.id);
  console.log("Email:", admin.email);
  console.log("Role:", admin.role);
  console.log("Password:", password);
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });