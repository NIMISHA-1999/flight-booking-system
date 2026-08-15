import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  await prisma.flight.createMany({
    data: [
      // =====================================================
      // AIR INDIA
      // =====================================================

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
        flightNumber: "AI102",
        airline: "Air India",
        origin: "Mumbai",
        destination: "Delhi",
        departureAt: new Date("2026-09-10T12:30:00Z"),
        arrivalAt: new Date("2026-09-10T14:40:00Z"),
        fare: 7200,
        totalSeats: 180,
        availableSeats: 175,
      },
      {
        flightNumber: "AI203",
        airline: "Air India",
        origin: "Delhi",
        destination: "Chennai",
        departureAt: new Date("2026-09-12T06:30:00Z"),
        arrivalAt: new Date("2026-09-12T09:20:00Z"),
        fare: 6800,
        totalSeats: 180,
        availableSeats: 165,
      },

      // =====================================================
      // INDIGO
      // =====================================================

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
        flightNumber: "6E301",
        airline: "IndiGo",
        origin: "Chennai",
        destination: "Delhi",
        departureAt: new Date("2026-09-13T09:00:00Z"),
        arrivalAt: new Date("2026-09-13T12:00:00Z"),
        fare: 6200,
        totalSeats: 186,
        availableSeats: 172,
      },
      {
        flightNumber: "6E410",
        airline: "IndiGo",
        origin: "Bangalore",
        destination: "Mumbai",
        departureAt: new Date("2026-09-14T14:00:00Z"),
        arrivalAt: new Date("2026-09-14T15:45:00Z"),
        fare: 4900,
        totalSeats: 186,
        availableSeats: 160,
      },
      {
        flightNumber: "6E512",
        airline: "IndiGo",
        origin: "Hyderabad",
        destination: "Chennai",
        departureAt: new Date("2026-09-16T11:00:00Z"),
        arrivalAt: new Date("2026-09-16T12:20:00Z"),
        fare: 4200,
        totalSeats: 186,
        availableSeats: 180,
      },

      // =====================================================
      // EMIRATES
      // =====================================================

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
      {
        flightNumber: "EK542",
        airline: "Emirates",
        origin: "London",
        destination: "Dubai",
        departureAt: new Date("2026-09-18T09:00:00Z"),
        arrivalAt: new Date("2026-09-18T19:00:00Z"),
        fare: 47000,
        totalSeats: 300,
        availableSeats: 285,
      },
      {
        flightNumber: "EK520",
        airline: "Emirates",
        origin: "Dubai",
        destination: "Mumbai",
        departureAt: new Date("2026-09-20T07:00:00Z"),
        arrivalAt: new Date("2026-09-20T11:30:00Z"),
        fare: 22000,
        totalSeats: 300,
        availableSeats: 290,
      },

      // =====================================================
      // QATAR AIRWAYS
      // =====================================================

      {
        flightNumber: "QR529",
        airline: "Qatar Airways",
        origin: "Chennai",
        destination: "Doha",
        departureAt: new Date("2026-09-17T04:30:00Z"),
        arrivalAt: new Date("2026-09-17T07:00:00Z"),
        fare: 18500,
        totalSeats: 250,
        availableSeats: 240,
      },
      {
        flightNumber: "QR578",
        airline: "Qatar Airways",
        origin: "Doha",
        destination: "London",
        departureAt: new Date("2026-09-19T08:00:00Z"),
        arrivalAt: new Date("2026-09-19T13:30:00Z"),
        fare: 38000,
        totalSeats: 250,
        availableSeats: 225,
      },

      // =====================================================
      // BRITISH AIRWAYS
      // =====================================================

      {
        flightNumber: "BA138",
        airline: "British Airways",
        origin: "Mumbai",
        destination: "London",
        departureAt: new Date("2026-09-21T02:00:00Z"),
        arrivalAt: new Date("2026-09-21T10:30:00Z"),
        fare: 42000,
        totalSeats: 280,
        availableSeats: 260,
      },
      {
        flightNumber: "BA142",
        airline: "British Airways",
        origin: "London",
        destination: "Paris",
        departureAt: new Date("2026-09-22T10:00:00Z"),
        arrivalAt: new Date("2026-09-22T11:20:00Z"),
        fare: 12500,
        totalSeats: 220,
        availableSeats: 205,
      },

      // =====================================================
      // VISTARA
      // =====================================================

      {
        flightNumber: "UK845",
        airline: "Vistara",
        origin: "Chennai",
        destination: "Delhi",
        departureAt: new Date("2026-09-23T06:00:00Z"),
        arrivalAt: new Date("2026-09-23T08:50:00Z"),
        fare: 7100,
        totalSeats: 176,
        availableSeats: 170,
      },
      {
        flightNumber: "UK826",
        airline: "Vistara",
        origin: "Delhi",
        destination: "Mumbai",
        departureAt: new Date("2026-09-24T15:30:00Z"),
        arrivalAt: new Date("2026-09-24T17:40:00Z"),
        fare: 6900,
        totalSeats: 176,
        availableSeats: 155,
      },
    ],
  });

  console.log("Flight seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });