import { prisma } from "../config/database";

interface SearchFlightsParams {
  origin?: string;
  destination?: string;
  date?: string;
  passengers?: number;
}

export class FlightService {
  // =====================================================
  // SEARCH FLIGHTS
  // =====================================================

  async searchFlights(params: SearchFlightsParams) {
    const {
      origin,
      destination,
      date,
      passengers = 1,
    } = params;

    const where: any = {};

    if (origin) {
      where.origin = {
        contains: origin.trim(),
        mode: "insensitive",
      };
    }

    if (destination) {
      where.destination = {
        contains: destination.trim(),
        mode: "insensitive",
      };
    }

    if (date) {
      const startDate = new Date(
        `${date}T00:00:00.000Z`
      );

      const endDate = new Date(
        `${date}T23:59:59.999Z`
      );

      where.departureAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Only show flights with enough seats
    where.availableSeats = {
      gte: passengers,
    };

    const flights = await prisma.flight.findMany({
      where,
      orderBy: {
        departureAt: "asc",
      },
    });

    return flights;
  }

  // =====================================================
  // GET FLIGHT BY ID
  // =====================================================

  async getFlightById(id: string) {
    const flight = await prisma.flight.findUnique({
      where: {
        id,
      },
    });

    if (!flight) {
      throw new Error("Flight not found");
    }

    return flight;
  }

  // =====================================================
  // GET ALL FLIGHTS
  // =====================================================

  async getAllFlights() {
    const flights = await prisma.flight.findMany({
      orderBy: {
        departureAt: "asc",
      },
    });

    return flights;
  }
}

export default new FlightService();