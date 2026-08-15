import { prisma } from "../config/database";
import { stripe } from "../config/stripe";

export class PaymentService {
  async createCheckoutSession(
    bookingId: string,
    userId: string,
  ) {
    const booking =
      await prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId,
        },
        include: {
          flight: true,
          passengers: true,
        },
      });

    if (!booking) {
      throw new Error("Booking not found.");
    }

    if (booking.status !== "PENDING") {
      throw new Error(
        "This booking is no longer available for payment.",
      );
    }

    const amount = Math.round(
      Number(booking.totalAmount) * 100,
    );

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "inr",

              product_data: {
                name: `Flight ${booking.flight.flightNumber}`,

                description:
                  `${booking.flight.origin} → ` +
                  `${booking.flight.destination}`,
              },

              unit_amount: amount,
            },

            quantity: 1,
          },
        ],

        // Metadata on Checkout Session
        metadata: {
          bookingId: booking.id,
          userId,
        },

        // Metadata on PaymentIntent
        payment_intent_data: {
          metadata: {
            bookingId: booking.id,
            userId,
          },
        },

        success_url:
          `${process.env.FRONTEND_URL}` +
          `/booking/success?bookingId=${booking.id}`,

        cancel_url:
          `${process.env.FRONTEND_URL}` +
          `/booking/${booking.flightId}/payment` +
          `?bookingId=${booking.id}`,
      });

    return session;
  }
}

export const paymentService =
  new PaymentService();