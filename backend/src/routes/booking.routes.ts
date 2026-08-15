import { Router } from "express";

import { bookingController } from "../controllers/booking.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { cancelBooking } from "../controllers/cancellation.controller";

const router = Router();

/*
 * Create booking
 */
router.post(
  "/",
  authMiddleware,
  bookingController.createBooking.bind(bookingController),
);

/*
 * Get my bookings
 */
router.get(
  "/",
  authMiddleware,
  bookingController.getMyBookings.bind(bookingController),
);

/*
 * Get single booking
 */
router.get(
  "/:bookingId",
  authMiddleware,
  bookingController.getBooking.bind(bookingController),
);

// Cancel booking
//
//PATCH /api/bookings/:bookingId/cancel

router.patch("/:bookingId/cancel", authMiddleware, cancelBooking);

export default router;
