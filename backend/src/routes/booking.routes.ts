import { Router } from "express";

import { bookingController } from "../controllers/booking.controller";

import { authMiddleware } from "../middleware/auth.middleware";

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

export default router;
