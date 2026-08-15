import { Router } from "express";

import {
  createCheckoutSession,
} from "../controllers/payment.controller";

import {
  verifyPayment,
} from "../controllers/payment-verification.controller";

import {
  authMiddleware,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession,
);

router.post(
  "/verify",
  authMiddleware,
  verifyPayment,
);

export default router;