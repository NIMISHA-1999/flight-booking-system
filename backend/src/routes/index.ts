import { Router } from "express";
import authRoutes from "./auth.routes";
import flightRoutes from "./flight.routes";
import bookingRoutes from "./booking.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/flights", flightRoutes);
router.use("/bookings", bookingRoutes);

export default router;