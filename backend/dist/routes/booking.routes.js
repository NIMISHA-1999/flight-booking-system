"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/*
 * Create booking
 */
router.post("/", auth_middleware_1.authMiddleware, booking_controller_1.bookingController.createBooking.bind(booking_controller_1.bookingController));
/*
 * Get my bookings
 */
router.get("/", auth_middleware_1.authMiddleware, booking_controller_1.bookingController.getMyBookings.bind(booking_controller_1.bookingController));
/*
 * Get single booking
 */
router.get("/:bookingId", auth_middleware_1.authMiddleware, booking_controller_1.bookingController.getBooking.bind(booking_controller_1.bookingController));
exports.default = router;
//# sourceMappingURL=booking.routes.js.map