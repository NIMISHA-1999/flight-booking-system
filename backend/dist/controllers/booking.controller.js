"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = exports.BookingController = void 0;
const booking_service_1 = require("../services/booking.service");
class BookingController {
    /**
     * POST /api/bookings
     */
    async createBooking(req, res) {
        try {
            /*
             * User ID should come from authentication middleware.
             */
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required.",
                });
            }
            const { flightId, passengers } = req.body;
            /*
             * Basic request validation
             */
            if (!flightId) {
                return res.status(400).json({
                    success: false,
                    message: "Flight ID is required.",
                });
            }
            if (!Array.isArray(passengers) || passengers.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one passenger is required.",
                });
            }
            const booking = await booking_service_1.bookingService.createBooking(userId, {
                flightId,
                passengers,
            });
            return res.status(201).json({
                success: true,
                message: "Booking created successfully.",
                booking: {
                    id: booking.id,
                    bookingReference: booking.bookingReference,
                    flightId: booking.flightId,
                    passengerCount: booking.passengerCount,
                    totalAmount: booking.totalAmount,
                    status: booking.status,
                },
                passengers: booking.passengers,
            });
        }
        catch (error) {
            console.error("CREATE BOOKING ERROR:", error);
            const message = error instanceof Error ? error.message : "Unable to create booking.";
            return res.status(400).json({
                success: false,
                message,
            });
        }
    }
    /**
     * GET /api/bookings/:bookingId
     */
    async getBooking(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required.",
                });
            }
            const bookingId = String(req.params.bookingId);
            const booking = await booking_service_1.bookingService.getBookingById(bookingId, userId);
            return res.status(200).json({
                success: true,
                booking,
            });
        }
        catch (error) {
            console.error("GET BOOKING ERROR:", error);
            return res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : "Booking not found.",
            });
        }
    }
    /**
     * GET /api/bookings
     */
    async getMyBookings(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required.",
                });
            }
            const bookings = await booking_service_1.bookingService.getUserBookings(userId);
            return res.status(200).json({
                success: true,
                bookings,
            });
        }
        catch (error) {
            console.error("GET BOOKINGS ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch bookings.",
            });
        }
    }
}
exports.BookingController = BookingController;
exports.bookingController = new BookingController();
//# sourceMappingURL=booking.controller.js.map