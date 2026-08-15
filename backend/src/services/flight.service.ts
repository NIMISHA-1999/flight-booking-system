import { prisma } from "../config/database";

interface SearchFlightsParams {
  origin?: string;
  destination?: string;
  date?: string;
  passengers?: number;
}

export class FlightService {
  async searchFlights(params: SearchFlightsParams) {
    const { origin, destination, date, passengers = 1 } = params;

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
      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(`${date}T23:59:59.999Z`);

      where.departureAt = {
        gte: startDate,
        lte: endDate,
      };
    }

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
}

export default new FlightService();