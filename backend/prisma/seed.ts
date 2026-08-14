import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.flight.createMany({
    data: [
      {
        flightNumber: "AI101",
        airline: "Air India",
        origin: "Chennai",
        destination: "Mumbai",
        departureAt: new Date("2026-09-10T08:00:00Z"),
        arrivalAt: new Date("2026-09-10T10:00:00Z"),
        fare: 6500,
        totalSeats: 180,
        availableSeats: 180,
      },
      {
        flightNumber: "6E205",
        airline: "IndiGo",
        origin: "Delhi",
        destination: "Bangalore",
        departureAt: new Date("2026-09-11T07:30:00Z"),
        arrivalAt: new Date("2026-09-11T10:15:00Z"),
        fare: 5800,
        totalSeats: 186,
        availableSeats: 186,
      },
      {
        flightNumber: "EK543",
        airline: "Emirates",
        origin: "Dubai",
        destination: "London",
        departureAt: new Date("2026-09-15T05:00:00Z"),
        arrivalAt: new Date("2026-09-15T13:30:00Z"),
        fare: 45000,
        totalSeats: 300,
        availableSeats: 300,
      },
    ],
  });

  console.log("✅ Flight seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });