import { Request, Response } from "express";
import { prisma } from "../config/database";
import flightService from "../services/flight.service";

export async function getAllFlights(
  req: Request,
  res: Response
) {
  try {
    const flights = await prisma.flight.findMany({
      orderBy: {
        departureAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Flights fetched successfully",
      data: flights,
    });
  } catch (error) {
    console.error("GET ALL FLIGHTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch flights",
    });
  }
}

export async function searchFlights(
  req: Request,
  res: Response
) {
  try {
    const {
      origin,
      destination,
      date,
      passengers = "1",
    } = req.query;

    const where: any = {};

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

    const flights = await prisma.flight.findMany({
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
  } catch (error) {
    console.error("SEARCH FLIGHTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search flights",
    });
  }
}

export async function getFlightById(
  req: Request,
  res: Response
) {
  try {
    const id = String(req.params.id);

    const flight = await flightService.getFlightById(id);

    return res.status(200).json({
      success: true,
      message: "Flight fetched successfully",
      data: flight,
    });
  } catch (error) {
    console.error("GET FLIGHT BY ID ERROR:", error);

    if (
      error instanceof Error &&
      error.message === "Flight not found"
    ) {
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