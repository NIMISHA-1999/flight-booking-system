import crypto from "crypto";

import { prisma } from "../config/database";

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
        throw new Error("Passenger full name is required.");
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
     * Create booking + passengers + update seats
     *
     * Everything happens inside one transaction.
     */
    const booking = await prisma.$transaction(
      async (tx) => {
        /*
         * Re-check flight inside transaction
         *
         * This helps prevent two users from booking
         * the same remaining seats.
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
        const newBooking = await tx.booking.create({
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
}

export const bookingService =
  new BookingService();