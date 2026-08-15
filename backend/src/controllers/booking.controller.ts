import { Response } from "express";

import { bookingService } from "../services/booking.service";

import {
  AuthenticatedRequest,
} from "../types/auth.types";

export class BookingController {
  /**
   * POST /api/bookings
   */
  async createBooking(
    req: AuthenticatedRequest,
    res: Response,
  ) {
    try {
      console.log(
        "\n========== CREATE BOOKING ==========",
      );

      console.log("USER:", req.user);
      console.log("BODY:", req.body);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const userId =
        req.user.userId;

      const {
        flightId,
        passengers,
      } = req.body;

      if (!flightId) {
        return res.status(400).json({
          success: false,
          message:
            "Flight ID is required.",
        });
      }

      if (
        !Array.isArray(passengers) ||
        passengers.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one passenger is required.",
        });
      }

      console.log(
        "Creating booking for user:",
        userId,
      );

      const booking =
        await bookingService.createBooking(
          userId,
          {
            flightId,
            passengers,
          },
        );

      return res.status(201).json({
        success: true,

        message:
          "Booking created successfully.",

        booking: {
          id: booking.id,

          bookingReference:
            booking.bookingReference,

          flightId:
            booking.flightId,

          passengerCount:
            booking.passengerCount,

          totalAmount:
            booking.totalAmount,

          status:
            booking.status,
        },

        passengers:
          booking.passengers,
      });
    } catch (error) {
      console.error(
        "CREATE BOOKING ERROR:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to create booking.";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /api/bookings/:bookingId
   */
  async getBooking(
    req: AuthenticatedRequest,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const userId =
        req.user.userId;

      const bookingId =
        String(req.params.bookingId);

      const booking =
        await bookingService.getBookingById(
          bookingId,
          userId,
        );

      return res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      console.error(
        "GET BOOKING ERROR:",
        error,
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Booking not found.",
      });
    }
  }

  /**
   * GET /api/bookings
   */
  async getMyBookings(
    req: AuthenticatedRequest,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const userId =
        req.user.userId;

      const bookings =
        await bookingService.getUserBookings(
          userId,
        );

      return res.status(200).json({
        success: true,
        bookings,
      });
    } catch (error) {
      console.error(
        "GET BOOKINGS ERROR:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch bookings.",
      });
    }
  }
}

export const bookingController =
  new BookingController();