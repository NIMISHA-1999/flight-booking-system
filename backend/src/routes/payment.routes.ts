import { Router } from "express";

import {
  createCheckoutSession,
} from "../controllers/payment.controller";

import {
  authMiddleware,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession,
);

export default router;