import { Request, Response } from "express";
import Stripe from "stripe";

import { prisma } from "../config/database";
import { stripe } from "../config/stripe";

export const stripeWebhook = async (
  req: Request,
  res: Response,
) => {
  console.log("\n========================================");
  console.log("🔥 STRIPE WEBHOOK RECEIVED");
  console.log("========================================");

  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("BODY TYPE:", typeof req.body);
  console.log(
    "BODY IS BUFFER:",
    Buffer.isBuffer(req.body),
  );

  const signature = req.headers["stripe-signature"];

  console.log(
    "STRIPE SIGNATURE:",
    signature ? "PRESENT" : "MISSING",
  );

  if (!signature) {
    console.error("❌ Missing Stripe signature");

    return res.status(400).send(
      "Missing Stripe signature",
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(
      "❌ STRIPE_WEBHOOK_SECRET is missing",
    );

    return res.status(500).send(
      "Webhook secret missing",
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(
      "✅ WEBHOOK SIGNATURE VERIFIED",
    );

    console.log(
      "EVENT ID:",
      event.id,
    );

    console.log(
      "EVENT TYPE:",
      event.type,
    );

  } catch (error) {
    console.error(
      "❌ STRIPE WEBHOOK SIGNATURE ERROR:",
      error,
    );

    return res.status(400).send(
      "Invalid webhook signature",
    );
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {

        console.log(
          "\n🔥 checkout.session.completed",
        );

        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log(
          "SESSION ID:",
          session.id,
        );

        console.log(
          "PAYMENT STATUS:",
          session.payment_status,
        );

        console.log(
          "SESSION STATUS:",
          session.status,
        );

        console.log(
          "METADATA:",
          session.metadata,
        );

        const bookingId =
          session.metadata?.bookingId;

        const userId =
          session.metadata?.userId;

        console.log(
          "BOOKING ID:",
          bookingId,
        );

        console.log(
          "USER ID:",
          userId,
        );

        if (!bookingId) {
          console.error(
            "❌ BOOKING ID NOT FOUND IN METADATA",
          );

          break;
        }

        const booking =
          await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
          });

        console.log(
          "BOOKING FROM DATABASE:",
          booking,
        );

        if (!booking) {
          console.error(
            "❌ BOOKING NOT FOUND:",
            bookingId,
          );

          break;
        }

        console.log(
          "CURRENT BOOKING STATUS:",
          booking.status,
        );

        if (booking.status === "CONFIRMED") {
          console.log(
            "ℹ️ Booking already CONFIRMED",
          );

          break;
        }

        const updatedBooking =
          await prisma.booking.update({
            where: {
              id: bookingId,
            },
            data: {
              status: "CONFIRMED",
            },
          });

        console.log(
          "✅ BOOKING UPDATED",
        );

        console.log(
          "NEW STATUS:",
          updatedBooking.status,
        );

        console.log(
          `🎉 Booking ${bookingId} → CONFIRMED`,
        );

        break;
      }

      case "checkout.session.expired": {

        const session =
          event.data.object as Stripe.Checkout.Session;

        const bookingId =
          session.metadata?.bookingId;

        console.log(
          "Checkout expired:",
          bookingId,
        );

        if (!bookingId) {
          break;
        }

        await prisma.booking.updateMany({
          where: {
            id: bookingId,
            status: "PENDING",
          },
          data: {
            status: "CANCELLED",
          },
        });

        break;
      }

      case "payment_intent.payment_failed": {

        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        console.log(
          "❌ PAYMENT FAILED",
          paymentIntent.id,
        );

        console.log(
          "METADATA:",
          paymentIntent.metadata,
        );

        break;
      }

      default:

        console.log(
          "ℹ️ Unhandled Stripe event:",
          event.type,
        );
    }

    console.log(
      "========================================",
    );

    console.log(
      "✅ WEBHOOK COMPLETED",
    );

    console.log(
      "========================================\n",
    );

    return res.status(200).json({
      received: true,
    });

  } catch (error) {

    console.error(
      "❌ STRIPE WEBHOOK PROCESSING ERROR:",
      error,
    );

    return res.status(500).json({
      message:
        "Webhook processing failed",
    });
  }
};