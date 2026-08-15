import { Request, Response } from "express";
import Stripe from "stripe";

import { stripe } from "../config/stripe";
import { prisma } from "../config/database";

export const stripeWebhook = async (
  req: Request,
  res: Response,
) => {
  console.log("\n");
  console.log("========================================");
  console.log("🔥 STRIPE WEBHOOK HIT");
  console.log("========================================");

  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("BODY IS BUFFER:", Buffer.isBuffer(req.body));

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    console.error("❌ Stripe signature missing");

    return res.status(400).send("Missing Stripe signature");
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is missing");

    return res.status(500).send("Webhook secret missing");
  }

  let event: Stripe.Event;

  // =====================================================
  // VERIFY STRIPE WEBHOOK
  // =====================================================

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret,
    );

    console.log("✅ WEBHOOK SIGNATURE VERIFIED");
    console.log("EVENT ID:", event.id);
    console.log("EVENT TYPE:", event.type);
  } catch (error) {
    console.error(
      "❌ WEBHOOK SIGNATURE VERIFICATION FAILED:",
      error,
    );

    return res.status(400).send("Invalid webhook signature");
  }

  // =====================================================
  // CHECKOUT COMPLETED
  // =====================================================

  if (event.type === "checkout.session.completed") {
    try {
      const session =
        event.data.object as Stripe.Checkout.Session;

      console.log("\n");
      console.log("========================================");
      console.log("🔥 CHECKOUT SESSION COMPLETED");
      console.log("========================================");

      console.log("SESSION ID:", session.id);
      console.log("PAYMENT STATUS:", session.payment_status);
      console.log("SESSION STATUS:", session.status);

      console.log(
        "SESSION METADATA:",
        JSON.stringify(session.metadata, null, 2),
      );

      // =====================================================
      // GET BOOKING ID
      // =====================================================

      const bookingId = session.metadata?.bookingId;

      const userId = session.metadata?.userId;

      console.log("BOOKING ID:", bookingId);
      console.log("USER ID:", userId);

      if (!bookingId) {
        console.error(
          "❌ bookingId NOT FOUND IN CHECKOUT SESSION",
        );

        console.log(
          "Full session:",
          JSON.stringify(session, null, 2),
        );

        return res.status(200).json({
          received: true,
        });
      }

      // =====================================================
      // GET PAYMENT INTENT
      // =====================================================

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      console.log(
        "PAYMENT INTENT ID:",
        paymentIntentId,
      );

      // =====================================================
      // FIND BOOKING
      // =====================================================

      const booking = await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

      if (!booking) {
        console.error(
          "❌ BOOKING NOT FOUND:",
          bookingId,
        );

        return res.status(200).json({
          received: true,
        });
      }

      console.log(
        "CURRENT BOOKING STATUS:",
        booking.status,
      );

      // =====================================================
      // UPDATE BOOKING
      // =====================================================

      const updatedBooking =
        await prisma.booking.update({
          where: {
            id: bookingId,
          },

          data: {
            status: "CONFIRMED",

            ...(paymentIntentId
              ? {
                  stripePaymentIntentId:
                    paymentIntentId,
                }
              : {}),
          },
        });

      console.log(
        "========================================",
      );

      console.log(
        "✅ BOOKING UPDATED SUCCESSFULLY",
      );

      console.log(
        "BOOKING ID:",
        updatedBooking.id,
      );

      console.log(
        "NEW STATUS:",
        updatedBooking.status,
      );

      // =====================================================
      // CREATE / UPDATE PAYMENT
      // =====================================================

      if (paymentIntentId) {
        const payment =
          await prisma.payment.upsert({
            where: {
              bookingId: bookingId,
            },

            create: {
              bookingId: bookingId,

              stripePaymentIntentId:
                paymentIntentId,

              amount: booking.totalAmount,

              currency: "INR",

              status: "SUCCEEDED",

              paidAt: new Date(),
            },

            update: {
              stripePaymentIntentId:
                paymentIntentId,

              status: "SUCCEEDED",

              paidAt: new Date(),
            },
          });

        console.log(
          "✅ PAYMENT RECORD SAVED",
        );

        console.log(
          "PAYMENT ID:",
          payment.id,
        );
      }

      console.log(
        "========================================",
      );

      console.log(
        "🎉 PAYMENT COMPLETED SUCCESSFULLY",
      );

      console.log(
        "🎉 BOOKING STATUS → CONFIRMED",
      );

      console.log(
        "========================================",
      );
    } catch (error) {
      console.error(
        "❌ DATABASE UPDATE FAILED:",
        error,
      );

      return res.status(500).json({
        received: true,
        error: "Database update failed",
      });
    }
  }

  // =====================================================
  // PAYMENT FAILED
  // =====================================================

  if (event.type === "payment_intent.payment_failed") {
    try {
      const paymentIntent =
        event.data.object as Stripe.PaymentIntent;

      console.log("❌ PAYMENT FAILED");
      console.log(
        "PAYMENT INTENT:",
        paymentIntent.id,
      );

      console.log(
        "METADATA:",
        paymentIntent.metadata,
      );

      const bookingId =
        paymentIntent.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.updateMany({
          where: {
            id: bookingId,
            status: "PENDING",
          },

          data: {
            status: "PAYMENT_FAILED",
          },
        });

        console.log(
          "❌ BOOKING MARKED PAYMENT_FAILED",
        );
      }
    } catch (error) {
      console.error(
        "❌ PAYMENT FAILED HANDLER ERROR:",
        error,
      );
    }
  }

  // =====================================================
  // CHECKOUT EXPIRED
  // =====================================================

  if (event.type === "checkout.session.expired") {
    try {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const bookingId =
        session.metadata?.bookingId;

      console.log(
        "CHECKOUT EXPIRED:",
        bookingId,
      );

      if (bookingId) {
        await prisma.booking.updateMany({
          where: {
            id: bookingId,
            status: "PENDING",
          },

          data: {
            status: "CANCELLED",
          },
        });

        console.log(
          "✅ BOOKING CANCELLED",
        );
      }
    } catch (error) {
      console.error(
        "❌ CHECKOUT EXPIRED ERROR:",
        error,
      );
    }
  }

  // =====================================================
  // ALWAYS ACKNOWLEDGE STRIPE
  // =====================================================

  return res.status(200).json({
    received: true,
  });
};