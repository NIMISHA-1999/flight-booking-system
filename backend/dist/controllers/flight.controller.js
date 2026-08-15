"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFlights = getAllFlights;
exports.searchFlights = searchFlights;
exports.getFlightById = getFlightById;
const database_1 = require("../config/database");
const flight_service_1 = __importDefault(require("../services/flight.service"));
async function getAllFlights(req, res) {
    try {
        const flights = await database_1.prisma.flight.findMany({
            orderBy: {
                departureAt: "asc",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Flights fetched successfully",
            data: flights,
        });
    }
    catch (error) {
        console.error("GET ALL FLIGHTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch flights",
        });
    }
}
async function searchFlights(req, res) {
    try {
        const { origin, destination, date, passengers = "1", } = req.query;
        const where = {};
        if (origin) {
            where.origin = {
                contains: String(origin),
                mode: "insensitive",
            };
        }
        if (destination) {
            where.destination = {
                contains: String(destination),
                mode: "insensitive",
            };
        }
        if (date) {
            const searchDate = new Date(String(date));
            const nextDate = new Date(searchDate);
            nextDate.setDate(nextDate.getDate() + 1);
            where.departureAt = {
                gte: searchDate,
                lt: nextDate,
            };
        }
        const passengerCount = Number(passengers);
        if (passengerCount > 0) {
            where.availableSeats = {
                gte: passengerCount,
            };
        }
        const flights = await database_1.prisma.flight.findMany({
            where,
            orderBy: {
                departureAt: "asc",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Flights fetched successfully",
            data: flights,
        });
    }
    catch (error) {
        console.error("SEARCH FLIGHTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to search flights",
        });
    }
}
async function getFlightById(req, res) {
    try {
        const id = String(req.params.id);
        const flight = await flight_service_1.default.getFlightById(id);
        return res.status(200).json({
            success: true,
            message: "Flight fetched successfully",
            data: flight,
        });
    }
    catch (error) {
        console.error("GET FLIGHT BY ID ERROR:", error);
        if (error instanceof Error &&
            error.message === "Flight not found") {
            return res.status(404).json({
                success: false,
                message: "Flight not found",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to fetch flight",
        });
    }
}
//# sourceMappingURL=flight.controller.js.map