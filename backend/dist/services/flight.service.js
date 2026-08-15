"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightService = void 0;
const database_1 = require("../config/database");
class FlightService {
    // =====================================================
    // SEARCH FLIGHTS
    // =====================================================
    async searchFlights(params) {
        const { origin, destination, date, passengers = 1, } = params;
        const where = {};
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
        // Only show flights with enough seats
        where.availableSeats = {
            gte: passengers,
        };
        const flights = await database_1.prisma.flight.findMany({
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
    async getFlightById(id) {
        const flight = await database_1.prisma.flight.findUnique({
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
        const flights = await database_1.prisma.flight.findMany({
            orderBy: {
                departureAt: "asc",
            },
        });
        return flights;
    }
}
exports.FlightService = FlightService;
exports.default = new FlightService();
//# sourceMappingURL=flight.service.js.map