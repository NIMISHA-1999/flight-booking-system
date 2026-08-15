import { Router } from "express";
import { stripeWebhook } from "../controllers/stripe-webhook.controller";

const router = Router();

router.post(
  "/webhook",
  stripeWebhook,
);

export default router;