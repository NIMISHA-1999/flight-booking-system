// src/routes/admin.routes.ts

import { Router } from "express";

import {
  authMiddleware,
} from "../middleware/auth.middleware";

import {
  requireAdmin,
} from "../middleware/role.middleware";

import {
  getDashboardStats,
  getAllBookings,
  cancelBooking,
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} from "../controllers/admin.controller";

const router = Router();

/*
 * =====================================================
 * ADMIN AUTHENTICATION
 * =====================================================
 *
 * Every admin route requires:
 *
 * 1. Valid JWT
 * 2. ADMIN role
 *
 * =====================================================
 */

router.use(authMiddleware);

router.use(requireAdmin);

/*
 * =====================================================
 * DASHBOARD
 * =====================================================
 */

router.get(
  "/dashboard",
  getDashboardStats,
);

/*
 * =====================================================
 * BOOKINGS
 * =====================================================
 */

router.get(
  "/bookings",
  getAllBookings,
);

router.patch(
  "/bookings/:bookingId/cancel",
  cancelBooking,
);

/*
 * =====================================================
 * FLIGHTS
 * =====================================================
 */

router.get(
  "/flights",
  getFlights,
);

router.post(
  "/flights",
  createFlight,
);

router.patch(
  "/flights/:flightId",
  updateFlight,
);

router.delete(
  "/flights/:flightId",
  deleteFlight,
);

export default router;