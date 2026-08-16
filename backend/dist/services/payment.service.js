"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const database_1 = require("../config/database");
const stripe_1 = require("../config/stripe");
class PaymentService {
    async createCheckoutSession(bookingId, userId) {
        const booking = await database_1.prisma.booking.findFirst({
            where: {
                id: bookingId,
                userId,
            },
            include: {
                flight: true,
                passengers: true,
            },
        });
        if (!booking) {
            throw new Error("Booking not found.");
        }
        if (booking.status !== "PENDING") {
            throw new Error("This booking is no longer available for payment.");
        }
        const amount = Math.round(Number(booking.totalAmount) * 100);
        const session = await stripe_1.stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `Flight ${booking.flight.flightNumber}`,
                            description: `${booking.flight.origin} → ${booking.flight.destination}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            // IMPORTANT
            metadata: {
                bookingId: booking.id,
                userId: userId,
            },
            payment_intent_data: {
                metadata: {
                    bookingId: booking.id,
                    userId: userId,
                },
            },
            success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}` +
                `/booking/${booking.flightId}/payment?bookingId=${booking.id}`,
        });
        console.log("================================");
        console.log("STRIPE SESSION CREATED:", session.id);
        console.log("SESSION METADATA:", session.metadata);
        console.log("================================");
        return session;
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
//# sourceMappingURL=payment.service.js.map