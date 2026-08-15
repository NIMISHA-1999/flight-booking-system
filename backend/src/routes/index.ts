import { Router } from "express";
import authRoutes from "./auth.routes";
import flightRoutes from "./flight.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/flights", flightRoutes);

export default router;