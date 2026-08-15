// import crypto from "crypto";

// import { prisma } from "../config/database";

// interface CreatePassengerInput {
//   fullName: string;
//   dateOfBirth: string;
//   nationality: string;
//   passportNumber: string;
//   email: string;
//   contactNumber: string;
// }

// interface CreateBookingInput {
//   flightId: string;
//   passengers: CreatePassengerInput[];
// }

// export class BookingService {
//   /**
//    * Generate booking reference
//    *
//    * Example:
//    * SKY-8F3A21
//    */
//   private generateBookingReference(): string {
//     return `SKY-${crypto
//       .randomBytes(3)
//       .toString("hex")
//       .toUpperCase()}`;
//   }

//   /**
//    * Create booking
//    */
//   async createBooking(
//     userId: string,
//     data: CreateBookingInput,
//   ) {
//     const { flightId, passengers } = data;

//     /*
//      * Validate passengers
//      */
//     if (!passengers || passengers.length === 0) {
//       throw new Error(
//         "At least one passenger is required.",
//       );
//     }

//     /*
//      * Find flight
//      */
//     const flight = await prisma.flight.findUnique({
//       where: {
//         id: flightId,
//       },
//     });

//     if (!flight) {
//       throw new Error("Flight not found.");
//     }

//     /*
//      * Check available seats
//      */
//     if (flight.availableSeats < passengers.length) {
//       throw new Error(
//         `Only ${flight.availableSeats} seat(s) available.`,
//       );
//     }

//     /*
//      * Validate passenger information
//      */
//     for (const passenger of passengers) {
//       if (!passenger.fullName?.trim()) {
//         throw new Error("Passenger full name is required.");
//       }

//       if (!passenger.dateOfBirth) {
//         throw new Error(
//           "Passenger date of birth is required.",
//         );
//       }

//       if (!passenger.nationality?.trim()) {
//         throw new Error(
//           "Passenger nationality is required.",
//         );
//       }

//       if (!passenger.passportNumber?.trim()) {
//         throw new Error(
//           "Passenger passport number is required.",
//         );
//       }

//       if (!passenger.email?.trim()) {
//         throw new Error(
//           "Passenger email is required.",
//         );
//       }

//       if (!passenger.contactNumber?.trim()) {
//         throw new Error(
//           "Passenger contact number is required.",
//         );
//       }
//     }

//     /*
//      * Calculate total
//      */
//     const passengerCount = passengers.length;

//     const totalAmount =
//       Number(flight.fare) * passengerCount;

//     /*
//      * Create booking + passengers + update seats
//      *
//      * Everything happens inside one transaction.
//      */
//     const booking = await prisma.$transaction(
//       async (tx) => {
//         /*
//          * Re-check flight inside transaction
//          *
//          * This helps prevent two users from booking
//          * the same remaining seats.
//          */
//         const currentFlight =
//           await tx.flight.findUnique({
//             where: {
//               id: flightId,
//             },
//           });

//         if (!currentFlight) {
//           throw new Error("Flight not found.");
//         }

//         if (
//           currentFlight.availableSeats <
//           passengerCount
//         ) {
//           throw new Error(
//             `Only ${currentFlight.availableSeats} seat(s) available.`,
//           );
//         }

//         /*
//          * Create booking
//          */
//         const newBooking = await tx.booking.create({
//           data: {
//             bookingReference:
//               this.generateBookingReference(),

//             userId,

//             flightId,

//             passengerCount,

//             totalAmount,

//             status: "PENDING",

//             passengers: {
//               create: passengers.map(
//                 (passenger) => ({
//                   fullName:
//                     passenger.fullName.trim(),

//                   dateOfBirth:
//                     new Date(
//                       passenger.dateOfBirth,
//                     ),

//                   nationality:
//                     passenger.nationality.trim(),

//                   passportNumber:
//                     passenger.passportNumber
//                       .trim()
//                       .toUpperCase(),

//                   email:
//                     passenger.email
//                       .trim()
//                       .toLowerCase(),

//                   contactNumber:
//                     passenger.contactNumber.trim(),
//                 }),
//               ),
//             },
//           },

//           include: {
//             passengers: true,
//             flight: true,
//           },
//         });

//         /*
//          * Reserve seats
//          */
//         await tx.flight.update({
//           where: {
//             id: flightId,
//           },

//           data: {
//             availableSeats: {
//               decrement: passengerCount,
//             },
//           },
//         });

//         return newBooking;
//       },
//     );

//     return booking;
//   }

//   /**
//    * Get booking by ID
//    */
//   async getBookingById(
//     bookingId: string,
//     userId: string,
//   ) {
//     const booking =
//       await prisma.booking.findFirst({
//         where: {
//           id: bookingId,
//           userId,
//         },

//         include: {
//           flight: true,
//           passengers: true,
//           payment: true,
//         },
//       });

//     if (!booking) {
//       throw new Error("Booking not found.");
//     }

//     return booking;
//   }

//   /**
//    * Get user's bookings
//    */
//   async getUserBookings(userId: string) {
//     return prisma.booking.findMany({
//       where: {
//         userId,
//       },

//       include: {
//         flight: true,
//         passengers: true,
//         payment: true,
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   }
// }

// export const bookingService =
//   new BookingService();

import crypto from "crypto";

import { prisma } from "../config/database";
import { stripe } from "../config/stripe";

interface CreatePassengerInput {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  contactNumber: string;
}

interface CreateBookingInput {
  flightId: string;
  passengers: CreatePassengerInput[];
}

export class BookingService {
  /**
   * Generate booking reference
   *
   * Example:
   * SKY-8F3A21
   */
  private generateBookingReference(): string {
    return `SKY-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;
  }

  /**
   * Create booking
   */
  async createBooking(
    userId: string,
    data: CreateBookingInput,
  ) {
    const { flightId, passengers } = data;

    /*
     * Validate passengers
     */
    if (!passengers || passengers.length === 0) {
      throw new Error(
        "At least one passenger is required.",
      );
    }

    /*
     * Find flight
     */
    const flight = await prisma.flight.findUnique({
      where: {
        id: flightId,
      },
    });

    if (!flight) {
      throw new Error("Flight not found.");
    }

    /*
     * Check available seats
     */
    if (flight.availableSeats < passengers.length) {
      throw new Error(
        `Only ${flight.availableSeats} seat(s) available.`,
      );
    }

    /*
     * Validate passenger information
     */
    for (const passenger of passengers) {
      if (!passenger.fullName?.trim()) {
        throw new Error(
          "Passenger full name is required.",
        );
      }

      if (!passenger.dateOfBirth) {
        throw new Error(
          "Passenger date of birth is required.",
        );
      }

      if (!passenger.nationality?.trim()) {
        throw new Error(
          "Passenger nationality is required.",
        );
      }

      if (!passenger.passportNumber?.trim()) {
        throw new Error(
          "Passenger passport number is required.",
        );
      }

      if (!passenger.email?.trim()) {
        throw new Error(
          "Passenger email is required.",
        );
      }

      if (!passenger.contactNumber?.trim()) {
        throw new Error(
          "Passenger contact number is required.",
        );
      }
    }

    /*
     * Calculate total
     */
    const passengerCount = passengers.length;

    const totalAmount =
      Number(flight.fare) * passengerCount;

    /*
     * Create booking + passengers + reserve seats
     */
    const booking = await prisma.$transaction(
      async (tx) => {
        /*
         * Re-check flight inside transaction
         */
        const currentFlight =
          await tx.flight.findUnique({
            where: {
              id: flightId,
            },
          });

        if (!currentFlight) {
          throw new Error("Flight not found.");
        }

        if (
          currentFlight.availableSeats <
          passengerCount
        ) {
          throw new Error(
            `Only ${currentFlight.availableSeats} seat(s) available.`,
          );
        }

        /*
         * Create booking
         */
        const newBooking =
          await tx.booking.create({
            data: {
              bookingReference:
                this.generateBookingReference(),

              userId,

              flightId,

              passengerCount,

              totalAmount,

              status: "PENDING",

              passengers: {
                create: passengers.map(
                  (passenger) => ({
                    fullName:
                      passenger.fullName.trim(),

                    dateOfBirth:
                      new Date(
                        passenger.dateOfBirth,
                      ),

                    nationality:
                      passenger.nationality.trim(),

                    passportNumber:
                      passenger.passportNumber
                        .trim()
                        .toUpperCase(),

                    email:
                      passenger.email
                        .trim()
                        .toLowerCase(),

                    contactNumber:
                      passenger.contactNumber.trim(),
                  }),
                ),
              },
            },

            include: {
              passengers: true,
              flight: true,
            },
          });

        /*
         * Reserve seats
         */
        await tx.flight.update({
          where: {
            id: flightId,
          },

          data: {
            availableSeats: {
              decrement: passengerCount,
            },
          },
        });

        return newBooking;
      },
    );

    return booking;
  }

  /**
   * Get booking by ID
   */
  async getBookingById(
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
          payment: true,
        },
      });

    if (!booking) {
      throw new Error("Booking not found.");
    }

    return booking;
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: {
        userId,
      },

      include: {
        flight: true,
        passengers: true,
        payment: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Cancel booking
   *
   * PENDING:
   *   Cancel booking + release seats.
   *
   * CONFIRMED:
   *   Refund Stripe payment + cancel booking
   *   + release seats.
   */
  async cancelBooking(
    bookingId: string,
    userId: string,
  ) {
    /*
     * Find user's booking
     */
    const booking =
      await prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId,
        },

        include: {
          payment: true,
          flight: true,
          passengers: true,
        },
      });

    if (!booking) {
      throw new Error(
        "Booking not found.",
      );
    }

    console.log(
      "========================================",
    );

    console.log(
      "CANCEL BOOKING",
    );

    console.log(
      "BOOKING ID:",
      booking.id,
    );

    console.log(
      "BOOKING REFERENCE:",
      booking.bookingReference,
    );

    console.log(
      "CURRENT STATUS:",
      booking.status,
    );

    /*
     * Already cancelled
     */
    if (booking.status === "CANCELLED") {
      throw new Error(
        "Booking is already cancelled.",
      );
    }

    /*
     * Don't allow cancellation after
     * flight departure
     */
    const departureAt =
      new Date(
        booking.flight.departureAt,
      );

    if (
      departureAt <= new Date()
    ) {
      throw new Error(
        "This booking cannot be cancelled because the flight has already departed.",
      );
    }

    /*
     * Number of seats to release
     */
    const passengerCount =
      booking.passengerCount;

    /*
     * =====================================================
     * PENDING BOOKING
     * =====================================================
     *
     * No successful payment.
     *
     * Just cancel + release seats.
     */
    if (
      booking.status === "PENDING"
    ) {
      const cancelledBooking =
        await prisma.$transaction(
          async (tx) => {
            /*
             * Cancel booking
             */
            const updatedBooking =
              await tx.booking.update({
                where: {
                  id: booking.id,
                },

                data: {
                  status: "CANCELLED",
                },
              });

            /*
             * Release seats
             */
            await tx.flight.update({
              where: {
                id: booking.flightId,
              },

              data: {
                availableSeats: {
                  increment:
                    passengerCount,
                },
              },
            });

            return updatedBooking;
          },
        );

      console.log(
        "✅ PENDING BOOKING CANCELLED",
      );

      console.log(
        `✅ ${passengerCount} SEAT(S) RELEASED`,
      );

      console.log(
        "========================================",
      );

      return {
        booking: cancelledBooking,

        refund: null,

        message:
          "Booking cancelled successfully.",
      };
    }

    /*
     * =====================================================
     * CONFIRMED BOOKING
     * =====================================================
     *
     * Payment already completed.
     *
     * Refund payment first.
     */
    if (
      booking.status === "CONFIRMED"
    ) {
      /*
       * Payment record must exist
       */
      if (!booking.payment) {
        throw new Error(
          "Payment record not found for this booking.",
        );
      }

      /*
       * Stripe PaymentIntent
       */
      const paymentIntentId =
        booking.payment
          .stripePaymentIntentId;

      if (!paymentIntentId) {
        throw new Error(
          "Stripe payment information not found.",
        );
      }

      console.log(
        "STRIPE PAYMENT INTENT:",
        paymentIntentId,
      );

      /*
       * Prevent duplicate refund
       */
      if (
        booking.payment.status ===
        "REFUNDED"
      ) {
        throw new Error(
          "This payment has already been refunded.",
        );
      }

      /*
       * =================================================
       * CREATE STRIPE REFUND
       * =================================================
       */
      const refund =
        await stripe.refunds.create({
          payment_intent:
            paymentIntentId,
        });

      console.log(
        "STRIPE REFUND CREATED:",
        refund.id,
      );

      console.log(
        "REFUND STATUS:",
        refund.status,
      );

      /*
       * =================================================
       * UPDATE DATABASE
       * =================================================
       */
      const result =
        await prisma.$transaction(
          async (tx) => {
            /*
             * Cancel booking
             */
            const cancelledBooking =
              await tx.booking.update({
                where: {
                  id: booking.id,
                },

                data: {
                  status: "CANCELLED",
                },
              });

            /*
             * Update payment
             */
            await tx.payment.update({
              where: {
                bookingId:
                  booking.id,
              },

              data: {
                status: "REFUNDED",

                paidAt:
                  booking.payment?.paidAt ||
                  null,
              },
            });

            /*
             * Release seats
             */
            await tx.flight.update({
              where: {
                id: booking.flightId,
              },

              data: {
                availableSeats: {
                  increment:
                    passengerCount,
                },
              },
            });

            return cancelledBooking;
          },
        );

      console.log(
        "✅ BOOKING STATUS → CANCELLED",
      );

      console.log(
        "✅ PAYMENT STATUS → REFUNDED",
      );

      console.log(
        `✅ ${passengerCount} SEAT(S) RELEASED`,
      );

      console.log(
        "🎉 BOOKING CANCELLATION COMPLETED",
      );

      console.log(
        "========================================",
      );

      return {
        booking: result,

        refund: {
          id: refund.id,
          status: refund.status,
        },

        message:
          "Booking cancelled and payment refund initiated.",
      };
    }

    /*
     * PAYMENT FAILED
     */
    if (
      booking.status ===
      "PAYMENT_FAILED"
    ) {
      const cancelledBooking =
        await prisma.$transaction(
          async (tx) => {
            const updatedBooking =
              await tx.booking.update({
                where: {
                  id: booking.id,
                },

                data: {
                  status: "CANCELLED",
                },
              });

            await tx.flight.update({
              where: {
                id: booking.flightId,
              },

              data: {
                availableSeats: {
                  increment:
                    passengerCount,
                },
              },
            });

            return updatedBooking;
          },
        );

      console.log(
        "✅ PAYMENT FAILED BOOKING CANCELLED",
      );

      console.log(
        `✅ ${passengerCount} SEAT(S) RELEASED`,
      );

      return {
        booking: cancelledBooking,

        refund: null,

        message:
          "Booking cancelled successfully.",
      };
    }

    throw new Error(
      `Booking cannot be cancelled from ${booking.status} status.`,
    );
  }
}

export const bookingService =
  new BookingService();