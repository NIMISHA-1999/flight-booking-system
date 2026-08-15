import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { prisma } from "../config/database";
import Stripe from "stripe";

export const stripeWebhook = async (
  req: Request,
  res: Response,
) => {
  const signature =
    req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send(
      "Missing Stripe signature.",
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error(
      "STRIPE WEBHOOK SIGNATURE ERROR:",
      error,
    );

    return res.status(400).send(
      "Invalid webhook signature.",
    );
  }

  try {
    switch (event.type) {
      /*
       * =========================================
       * PAYMENT SUCCESS
       * =========================================
       */

      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        const bookingId =
          session.metadata?.bookingId;

        if (!bookingId) {
          console.error(
            "Booking ID missing from Stripe session.",
          );

          break;
        }

        if (session.payment_status !== "paid") {
          console.log(
            "Checkout completed but payment is not paid:",
            session.payment_status,
          );

          break;
        }

        const booking =
          await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
          });

        if (!booking) {
          console.error(
            "Booking not found:",
            bookingId,
          );

          break;
        }

        // Prevent duplicate webhook processing
        if (booking.status === "CONFIRMED") {
          break;
        }

        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: "CONFIRMED",
          },
        });

        console.log(
          `Booking ${bookingId} confirmed.`,
        );

        break;
      }

      /*
       * =========================================
       * PAYMENT FAILED
       * =========================================
       */

      case "payment_intent.payment_failed": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        const bookingId =
          paymentIntent.metadata?.bookingId;

        if (!bookingId) {
          break;
        }

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
          `Payment failed for booking ${bookingId}.`,
        );

        break;
      }

      /*
       * =========================================
       * CHECKOUT EXPIRED
       * =========================================
       */

      case "checkout.session.expired": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        const bookingId =
          session.metadata?.bookingId;

        if (!bookingId) {
          break;
        }

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
          `Checkout expired for booking ${bookingId}.`,
        );

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`,
        );
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "STRIPE WEBHOOK ERROR:",
      error,
    );

    return res.status(500).json({
      message: "Webhook processing failed.",
    });
  }
};