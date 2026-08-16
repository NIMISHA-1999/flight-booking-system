"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancellationService = exports.CancellationService = void 0;
const database_1 = require("../config/database");
class CancellationService {
    async cancelBooking(bookingId, userId, isAdmin = false) {
        /*
         * Find booking
         */
        const booking = await database_1.prisma.booking.findFirst({
            where: isAdmin
                ? {
                    id: bookingId,
                }
                : {
                    id: bookingId,
                    userId,
                },
            include: {
                flight: true,
                payment: true,
                passengers: true,
            },
        });
        if (!booking) {
            throw new Error("Booking not found.");
        }
        /*
         * Already cancelled
         */
        if (booking.status === "CANCELLED") {
            throw new Error("Booking is already cancelled.");
        }
        /*
         * Only these statuses can be cancelled
         */
        if (booking.status !== "PENDING" &&
            booking.status !== "CONFIRMED") {
            throw new Error(`Booking with status ${booking.status} cannot be cancelled.`);
        }
        /*
         * Check flight departure
         */
        const now = new Date();
        if (new Date(booking.flight.departureAt) <= now) {
            throw new Error("This booking cannot be cancelled because the flight has already departed.");
        }
        /*
         * Transaction
         *
         * 1. Cancel booking
         * 2. Restore seats
         */
        const cancelledBooking = await database_1.prisma.$transaction(async (tx) => {
            /*
             * Update booking
             */
            const updatedBooking = await tx.booking.update({
                where: {
                    id: booking.id,
                },
                data: {
                    status: "CANCELLED",
                },
                include: {
                    flight: true,
                    passengers: true,
                    payment: true,
                },
            });
            /*
             * Restore seats
             */
            await tx.flight.update({
                where: {
                    id: booking.flightId,
                },
                data: {
                    availableSeats: {
                        increment: booking.passengerCount,
                    },
                },
            });
            return updatedBooking;
        });
        console.log("====================================");
        console.log("✅ BOOKING CANCELLED");
        console.log("Booking ID:", booking.id);
        console.log("Booking Reference:", booking.bookingReference);
        console.log("Passengers:", booking.passengerCount);
        console.log("Previous Status:", booking.status);
        console.log("New Status:", cancelledBooking.status);
        console.log("====================================");
        return {
            success: true,
            message: "Booking cancelled successfully.",
            booking: cancelledBooking,
        };
    }
}
exports.CancellationService = CancellationService;
exports.cancellationService = new CancellationService();
//# sourceMappingURL=cancellation.service.js.map