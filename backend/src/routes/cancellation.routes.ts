import { Router } from "express";
import { cancelBooking } from "../controllers/cancellation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/:bookingId/cancel",
  authMiddleware,
  cancelBooking,
);

export default router;