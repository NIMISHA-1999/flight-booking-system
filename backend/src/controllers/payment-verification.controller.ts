import { Request, Response } from "express";

import {
  paymentVerificationService,
} from "../services/payment-verification.service";

export const verifyPayment = async (
  req: Request,
  res: Response,
) => {
  try {
    const { sessionId } = req.body;

    const userId = req.user?.userId;

    console.log("");
    console.log(
      "========== VERIFY PAYMENT ==========",
    );

    console.log(
      "SESSION ID:",
      sessionId,
    );

    console.log(
      "USER ID:",
      userId,
    );

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Stripe session ID is required.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const result =
      await paymentVerificationService.verifyCheckoutSession(
        sessionId,
        userId,
      );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(
      "❌ PAYMENT VERIFICATION ERROR:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Payment verification failed.",
    });
  }
};