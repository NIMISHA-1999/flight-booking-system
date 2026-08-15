import { prisma } from "../config/database";
import { stripe } from "../config/stripe";

export class PaymentService {
  async createCheckoutSession(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
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
      throw new Error("This booking is no longer available for payment.");
    }

    const amount = Math.round(Number(booking.totalAmount) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: `Flight ${booking.flight.flightNumber}`,

              description: `${booking.flight.origin} → ${booking.flight.destination}`,
            },

            unit_amount: amount,
          },

          quantity: 1,
        },
      ],

      // IMPORTANT
      metadata: {
        bookingId: booking.id,
        userId: userId,
      },

      payment_intent_data: {
        metadata: {
          bookingId: booking.id,
          userId: userId,
        },
      },

      success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.FRONTEND_URL}` +
        `/booking/${booking.flightId}/payment?bookingId=${booking.id}`,
    });

    console.log("================================");

    console.log("STRIPE SESSION CREATED:", session.id);

    console.log("SESSION METADATA:", session.metadata);

    console.log("================================");

    return session;
  }
}

export const paymentService = new PaymentService();
