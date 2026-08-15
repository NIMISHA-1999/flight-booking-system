"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const payment_service_1 = require("../services/payment.service");
const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user?.userId;
        console.log("================================");
        console.log("CREATE CHECKOUT SESSION");
        console.log("BODY:", req.body);
        console.log("BOOKING ID:", bookingId);
        console.log("USER ID:", userId);
        console.log("================================");
        if (!bookingId) {
            return res.status(400).json({
                message: "Booking ID is required.",
            });
        }
        if (!userId) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }
        const session = await payment_service_1.paymentService.createCheckoutSession(bookingId, userId);
        return res.status(200).json({
            success: true,
            url: session.url,
            sessionId: session.id,
        });
    }
    catch (error) {
        console.error("CREATE CHECKOUT SESSION ERROR:", error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Unable to create checkout session.",
        });
    }
};
exports.createCheckoutSession = createCheckoutSession;
//# sourceMappingURL=payment.controller.js.map