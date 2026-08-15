import { prisma } from "../config/database";
import { stripe } from "../config/stripe";

export class CancellationService {

  async cancelBooking(
    bookingId: string,
    userId: string,
    isAdmin = false,
  ) {
    const booking =
      await prisma.booking.findFirst({
        where: {
          id: bookingId,
          ...(isAdmin ? {} : { userId }),
        },
        include: {
          flight: true,
        },
      });

    if (!booking) {
      throw new Error("Booking not found.");
    }

    if (booking.status !== "CONFIRMED") {
      throw new Error(
        "Only confirmed bookings can be cancelled.",
      );
    }

    /*
     * USER CANCELLATION POLICY
     *
     * Admin can cancel anytime.
     * Users must cancel at least 24 hours
     * before departure.
     */

    if (!isAdmin) {
      const now = new Date();

      const departure =
        new Date(booking.flight.departureAt);

      const hoursUntilDeparture =
        (departure.getTime() - now.getTime()) /
        (1000 * 60 * 60);

      if (hoursUntilDeparture < 24) {
        throw new Error(
          "Cancellation is only allowed at least 24 hours before departure.",
        );
      }
    }

    /*
     * REFUND
     */

    if (booking.stripePaymentId) {
      await stripe.refunds.create({
        payment_intent:
          booking.stripePaymentId,
      });
    }

    /*
     * RELEASE SEATS
     */

    await prisma.$transaction([
      prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          status: "CANCELLED",
        },
      }),

      prisma.flight.update({
        where: {
          id: booking.flightId,
        },
        data: {
          availableSeats: {
            increment: booking.passengerCount,
          },
        },
      }),
    ]);

    return {
      success: true,
      message:
        "Booking cancelled and refund initiated.",
    };
  }
}

export const cancellationService =
  new CancellationService();