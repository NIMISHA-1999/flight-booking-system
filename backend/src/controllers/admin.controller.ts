// src/controllers/admin.controller.ts

import {
  Request,
  Response,
} from "express";

import { prisma } from "../config/database";
import { stripe } from "../config/stripe";

/*
 * =====================================================
 * GET ALL BOOKINGS
 * =====================================================
 */

export const getAllBookings = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      status,
      origin,
      destination,
      date,
    } = req.query;

    const where: any = {};

    /*
     * STATUS FILTER
     */

    if (status) {
      where.status = String(status);
    }

    /*
     * FLIGHT FILTERS
     */

    const flightFilter: any = {};

    if (origin) {
      flightFilter.origin = {
        contains: String(origin),
        mode: "insensitive",
      };
    }

    if (destination) {
      flightFilter.destination = {
        contains: String(destination),
        mode: "insensitive",
      };
    }

    /*
     * DATE FILTER
     */

    if (date) {
      const startDate = new Date(
        `${String(date)}T00:00:00`,
      );

      const endDate = new Date(
        `${String(date)}T23:59:59.999`,
      );

      flightFilter.departureAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (
      Object.keys(flightFilter).length
    ) {
      where.flight = flightFilter;
    }

    /*
     * GET BOOKINGS
     */

    const bookings =
      await prisma.booking.findMany({
        where,

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          flight: {
            select: {
              id: true,
              airline: true,
              flightNumber: true,
              origin: true,
              destination: true,
              departureAt: true,
              arrivalAt: true,
              fare: true,
              totalSeats: true,
              availableSeats: true,
            },
          },

          passengers: true,

          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              stripePaymentIntentId: true,
              stripeRefundId: true,
              refundedAt: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET ADMIN BOOKINGS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load bookings.",
    });
  }
};

/*
 * =====================================================
 * ADMIN CANCEL BOOKING
 * =====================================================
 *
 * Admin can cancel regardless of normal
 * customer cancellation policy.
 *
 * Flow:
 *
 * 1. Find booking
 * 2. Check status
 * 3. Check payment
 * 4. Refund Stripe if necessary
 * 5. Transaction:
 *      - mark booking cancelled
 *      - release seats
 *      - update payment
 *
 * =====================================================
 */

export const cancelBooking = async (
  req: Request,
  res: Response,
) => {
  const { bookingId } =
    req.params;

  try {
    /*
     * =================================================
     * FIND BOOKING
     * =================================================
     */

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },

        include: {
          flight: true,

          payments: true,
        },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
        code: "BOOKING_NOT_FOUND",
      });
    }

    /*
     * =================================================
     * ALREADY CANCELLED
     * =================================================
     */

    if (
      booking.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Booking is already cancelled.",
        code: "BOOKING_ALREADY_CANCELLED",
      });
    }

    /*
     * =================================================
     * FIND SUCCESSFUL PAYMENT
     * =================================================
     */

    const successfulPayment =
      booking.payments.find(
        (payment: any) =>
          payment.status ===
            "SUCCEEDED" &&
          payment.stripePaymentIntentId &&
          !payment.stripeRefundId,
      );

    /*
     * =================================================
     * STRIPE REFUND
     * =================================================
     */

    let refundId:
      | string
      | null = null;

    if (successfulPayment) {
      try {
        const refund =
          await stripe.refunds.create({
            payment_intent:
              successfulPayment.stripePaymentIntentId,
          });

        refundId = refund.id;
      } catch (stripeError) {
        console.error(
          "STRIPE REFUND ERROR:",
          stripeError,
        );

        /*
         * IMPORTANT:
         * Do NOT cancel/release seats if refund
         * could not be created.
         */

        return res.status(502).json({
          success: false,
          message:
            "Stripe refund could not be processed. Booking was not cancelled and seats were not released.",
          code: "STRIPE_REFUND_FAILED",
        });
      }
    }

    /*
     * =================================================
     * DATABASE TRANSACTION
     * =================================================
     */

    const cancelledBooking =
      await prisma.$transaction(
        async (tx) => {
          /*
           * Re-check booking inside transaction
           * to reduce race-condition problems.
           */

          const currentBooking =
            await tx.booking.findUnique({
              where: {
                id: bookingId,
              },
            });

          if (!currentBooking) {
            throw new Error(
              "Booking not found.",
            );
          }

          if (
            currentBooking.status ===
            "CANCELLED"
          ) {
            throw new Error(
              "Booking is already cancelled.",
            );
          }

          /*
           * RELEASE SEATS
           */

          await tx.flight.update({
            where: {
              id: currentBooking.flightId,
            },

            data: {
              availableSeats: {
                increment:
                  currentBooking.passengerCount,
              },
            },
          });

          /*
           * CANCEL BOOKING
           */

          const cancelled =
            await tx.booking.update({
              where: {
                id: bookingId,
              },

              data: {
                status: "CANCELLED",

                cancelledAt:
                  new Date(),
              },
            });

          /*
           * UPDATE PAYMENT
           */

          if (
            successfulPayment &&
            refundId
          ) {
            await tx.payment.update({
              where: {
                id: successfulPayment.id,
              },

              data: {
                status: "REFUNDED",

                stripeRefundId:
                  refundId,

                refundedAt:
                  new Date(),
              },
            });
          }

          return cancelled;
        },
      );

    return res.json({
      success: true,

      message:
        successfulPayment
          ? "Booking cancelled and Stripe refund processed successfully."
          : "Booking cancelled and seats released successfully.",

      booking:
        cancelledBooking,

      refundId,
    });
  } catch (error) {
    console.error(
      "ADMIN CANCEL BOOKING ERROR:",
      error,
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Unable to cancel booking.",
    });
  }
};

/*
 * =====================================================
 * DASHBOARD
 * =====================================================
 */

export const getDashboardStats =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const startOfToday =
        new Date();

      startOfToday.setHours(
        0,
        0,
        0,
        0,
      );

      const endOfToday =
        new Date();

      endOfToday.setHours(
        23,
        59,
        59,
        999,
      );

      const [
        bookingsToday,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        paymentRevenue,
      ] =
        await Promise.all([
          /*
           * BOOKINGS TODAY
           */

          prisma.booking.count({
            where: {
              createdAt: {
                gte: startOfToday,
                lte: endOfToday,
              },
            },
          }),

          /*
           * TOTAL BOOKINGS
           */

          prisma.booking.count(),

          /*
           * PENDING
           */

          prisma.booking.count({
            where: {
              status: "PENDING",
            },
          }),

          /*
           * CONFIRMED
           */

          prisma.booking.count({
            where: {
              status: "CONFIRMED",
            },
          }),

          /*
           * CANCELLED
           */

          prisma.booking.count({
            where: {
              status: "CANCELLED",
            },
          }),

          /*
           * REVENUE
           */

          prisma.payment.aggregate({
            where: {
              status: "SUCCEEDED",
            },

            _sum: {
              amount: true,
            },
          }),
        ]);

      const cancellationRate =
        totalBookings > 0
          ? (cancelledBookings /
              totalBookings) *
            100
          : 0;

      return res.json({
        success: true,

        stats: {
          bookingsToday,

          totalBookings,

          pendingBookings,

          confirmedBookings,

          cancelledBookings,

          revenue:
            Number(
              paymentRevenue
                ._sum.amount || 0,
            ),

          cancellationRate:
            Number(
              cancellationRate.toFixed(
                2,
              ),
            ),
        },
      });
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error,
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load dashboard statistics.",
      });
    }
  };

/*
 * =====================================================
 * GET FLIGHTS
 * =====================================================
 */

export const getFlights = async (
  req: Request,
  res: Response,
) => {
  try {
    const flights =
      await prisma.flight.findMany({
        orderBy: {
          departureAt: "asc",
        },
      });

    return res.json({
      success: true,
      flights,
    });
  } catch (error) {
    console.error(
      "GET FLIGHTS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load flights.",
    });
  }
};

/*
 * =====================================================
 * CREATE FLIGHT
 * =====================================================
 */

export const createFlight =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        airline,
        flightNumber,
        origin,
        destination,
        departureAt,
        arrivalAt,
        fare,
        totalSeats,
      } = req.body;

      if (
        !airline ||
        !flightNumber ||
        !origin ||
        !destination ||
        !departureAt ||
        !arrivalAt ||
        fare === undefined ||
        totalSeats === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All flight fields are required.",
        });
      }

      const seats =
        Number(totalSeats);

      if (
        !Number.isInteger(seats) ||
        seats <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Total seats must be a positive integer.",
        });
      }

      const flight =
        await prisma.flight.create({
          data: {
            airline,

            flightNumber,

            origin,

            destination,

            departureAt:
              new Date(
                departureAt,
              ),

            arrivalAt:
              new Date(
                arrivalAt,
              ),

            fare: Number(fare),

            totalSeats: seats,

            availableSeats: seats,
          },
        });

      return res.status(201).json({
        success: true,

        message:
          "Flight created successfully.",

        flight,
      });
    } catch (error) {
      console.error(
        "CREATE FLIGHT ERROR:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create flight.",
      });
    }
  };

/*
 * =====================================================
 * UPDATE FLIGHT
 * =====================================================
 */

export const updateFlight =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { flightId } =
        req.params;

      const {
        airline,
        flightNumber,
        origin,
        destination,
        departureAt,
        arrivalAt,
        fare,
        totalSeats,
        availableSeats,
      } = req.body;

      const flight =
        await prisma.flight.update({
          where: {
            id: flightId,
          },

          data: {
            ...(airline !==
              undefined && {
              airline,
            }),

            ...(flightNumber !==
              undefined && {
              flightNumber,
            }),

            ...(origin !==
              undefined && {
              origin,
            }),

            ...(destination !==
              undefined && {
              destination,
            }),

            ...(departureAt !==
              undefined && {
              departureAt:
                new Date(
                  departureAt,
                ),
            }),

            ...(arrivalAt !==
              undefined && {
              arrivalAt:
                new Date(
                  arrivalAt,
                ),
            }),

            ...(fare !==
              undefined && {
              fare: Number(fare),
            }),

            ...(totalSeats !==
              undefined && {
              totalSeats:
                Number(
                  totalSeats,
                ),
            }),

            ...(availableSeats !==
              undefined && {
              availableSeats:
                Number(
                  availableSeats,
                ),
            }),
          },
        });

      return res.json({
        success: true,

        message:
          "Flight updated successfully.",

        flight,
      });
    } catch (error) {
      console.error(
        "UPDATE FLIGHT ERROR:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update flight.",
      });
    }
  };

/*
 * =====================================================
 * DELETE FLIGHT
 * =====================================================
 */

export const deleteFlight =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { flightId } =
        req.params;

      const activeBookings =
        await prisma.booking.count({
          where: {
            flightId,

            status: {
              in: [
                "PENDING",
                "CONFIRMED",
              ],
            },
          },
        });

      if (activeBookings > 0) {
        return res.status(400).json({
          success: false,

          message:
            "Cannot delete a flight with active bookings.",
        });
      }

      await prisma.flight.delete({
        where: {
          id: flightId,
        },
      });

      return res.json({
        success: true,

        message:
          "Flight deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE FLIGHT ERROR:",
        error,
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to delete flight.",
      });
    }
  };