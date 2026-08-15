import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import { cancellationService } from "../services/cancellation.service";

export const cancelBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { bookingId } = req.params;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    console.log(
      "====================================",
    );

    console.log(
      "CANCEL BOOKING REQUEST",
    );

    console.log(
      "Booking ID:",
      bookingId,
    );

    console.log(
      "User ID:",
      userId,
    );

    const result =
      await cancellationService.cancelBooking(
        bookingId,
        userId,
        false,
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "CANCEL BOOKING ERROR:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to cancel booking.",
    });
  }
};