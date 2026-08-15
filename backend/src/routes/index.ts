import { Router } from "express";
import authRoutes from "./auth.routes";
import flightRoutes from "./flight.routes";
import bookingRoutes from "./booking.routes";
import paymentRoutes from "./payment.routes";
import stripeWebhookRoutes from "./stripe-webhook.routes";
import cancellationRoutes from "./cancellation.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/flights", flightRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
// router.use("/stripe", stripeWebhookRoutes);
router.use("/bookings", cancellationRoutes);

export default router;