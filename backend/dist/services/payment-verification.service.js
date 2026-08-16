"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentVerificationService = exports.PaymentVerificationService = void 0;
const database_1 = require("../config/database");
const stripe_1 = require("../config/stripe");
class PaymentVerificationService {
    async verifyCheckoutSession(sessionId, userId) {
        console.log("");
        console.log("========================================");
        console.log("VERIFYING STRIPE CHECKOUT");
        console.log("SESSION ID:", sessionId);
        console.log("USER ID:", userId);
        console.log("========================================");
        // 1. Retrieve session directly from Stripe
        const session = await stripe_1.stripe.checkout.sessions.retrieve(sessionId);
        console.log("STRIPE SESSION STATUS:", session.status);
        console.log("STRIPE PAYMENT STATUS:", session.payment_status);
        console.log("STRIPE METADATA:", session.metadata);
        // 2. Make sure payment actually succeeded
        if (session.payment_status !== "paid") {
            throw new Error("Payment has not been completed.");
        }
        // 3. Get booking ID from Stripe metadata
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
            throw new Error("Booking ID missing from Stripe session metadata.");
        }
        // 4. Find booking
        const booking = await database_1.prisma.booking.findFirst({
            where: {
                id: bookingId,
                userId: userId,
            },
        });
        if (!booking) {
            throw new Error("Booking not found.");
        }
        console.log("DATABASE BOOKING:", booking.id);
        console.log("CURRENT STATUS:", booking.status);
        // 5. Get PaymentIntent
        const paymentIntentId = typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
        console.log("PAYMENT INTENT:", paymentIntentId);
        // 6. Update booking
        const updatedBooking = await database_1.prisma.booking.update({
            where: {
                id: booking.id,
            },
            data: {
                status: "CONFIRMED",
                stripePaymentIntentId: paymentIntentId || undefined,
            },
        });
        console.log("========================================");
        console.log("✅ BOOKING UPDATED");
        console.log("BOOKING:", updatedBooking.id);
        console.log("STATUS:", updatedBooking.status);
        console.log("========================================");
        // 7. Create/update payment record
        if (paymentIntentId) {
            await database_1.prisma.payment.upsert({
                where: {
                    bookingId: booking.id,
                },
                create: {
                    bookingId: booking.id,
                    stripePaymentIntentId: paymentIntentId,
                    amount: booking.totalAmount,
                    currency: "INR",
                    status: "SUCCEEDED",
                    paidAt: new Date(),
                },
                update: {
                    stripePaymentIntentId: paymentIntentId,
                    status: "SUCCEEDED",
                    paidAt: new Date(),
                },
            });
            console.log("✅ PAYMENT RECORD SAVED");
        }
        console.log("🎉 PAYMENT COMPLETED SUCCESSFULLY");
        return {
            success: true,
            booking: updatedBooking,
            stripeSessionId: session.id,
            paymentIntentId: paymentIntentId || null,
        };
    }
}
exports.PaymentVerificationService = PaymentVerificationService;
exports.paymentVerificationService = new PaymentVerificationService();
//# sourceMappingURL=payment-verification.service.js.map