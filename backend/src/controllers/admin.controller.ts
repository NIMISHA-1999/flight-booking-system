import { Request, Response } from "express";

import { prisma } from "../config/database";
import { stripe } from "../config/stripe";

/*
 * =====================================================
 * GET ALL BOOKINGS
 * =====================================================
 *
 * Supports:
 *
 * ?page=1
 * ?limit=10
 * ?status=CONFIRMED
 * ?origin=Chennai
 * ?destination=Mumbai
 * ?date=2026-08-15
 *
 * =====================================================
 */

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, origin, destination, date } = req.query;

    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const requestedPage = Number(req.query.page);

    const requestedLimit = Number(req.query.limit);

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 10;

    const skip = (page - 1) * limit;

    /*
     * =====================================================
     * BOOKING WHERE
     * =====================================================
     */

    const where: any = {};

    /*
     * =====================================================
     * STATUS FILTER
     * =====================================================
     */

    if (status) {
      const bookingStatus = String(status).trim();

      if (bookingStatus === "REFUNDED") {
        /*
         * REFUNDED is a PAYMENT status,
         * not necessarily a BOOKING status.
         *
         * When an admin cancels a successfully
         * paid booking:
         *
         * booking.status = CANCELLED
         * payment.status = REFUNDED
         */
        where.payment = {
          status: "REFUNDED",
        };
      } else {
        /*
         * All other statuses belong to Booking.
         */
        where.status = bookingStatus;
      }
    }

    /*
     * =====================================================
     * FLIGHT FILTER
     * =====================================================
     */

    const flightFilter: any = {};

    if (origin) {
      const originValue = String(origin).trim();

      if (originValue) {
        flightFilter.origin = {
          contains: originValue,
          mode: "insensitive",
        };
      }
    }

    if (destination) {
      const destinationValue = String(destination).trim();

      if (destinationValue) {
        flightFilter.destination = {
          contains: destinationValue,
          mode: "insensitive",
        };
      }
    }

    /*
     * =====================================================
     * DATE FILTER
     * =====================================================
     */

    if (date) {
      const dateString = String(date).trim();

      const startDate = new Date(`${dateString}T00:00:00`);

      const endDate = new Date(`${dateString}T23:59:59.999`);

      if (
        !Number.isNaN(startDate.getTime()) &&
        !Number.isNaN(endDate.getTime())
      ) {
        flightFilter.departureAt = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    /*
     * Apply flight filter only
     * when something exists.
     */

    if (Object.keys(flightFilter).length > 0) {
      where.flight = flightFilter;
    }

    /*
     * =====================================================
     * GET TOTAL COUNT
     * =====================================================
     */

    const total = await prisma.booking.count({
      where,
    });

    /*
     * =====================================================
     * GET BOOKINGS
     * =====================================================
     *
     * IMPORTANT:
     *
     * Booking has:
     *
     * payment: Payment?
     *
     * NOT:
     *
     * payments: Payment[]
     *
     * =====================================================
     */

    const bookings = await prisma.booking.findMany({
      where,

      include: {
        /*
         * =================================================
         * USER
         * =================================================
         *
         * User has firstName + lastName.
         * There is no "name" field.
         */

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },

        /*
         * =================================================
         * FLIGHT
         * =================================================
         */

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

        /*
         * =================================================
         * PASSENGERS
         * =================================================
         */

        passengers: true,

        /*
         * =================================================
         * PAYMENT
         * =================================================
         *
         * Singular relation.
         */

        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            stripePaymentIntentId: true,
            paidAt: true,
            refundedAt: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,

      take: limit,
    });

    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    const currentPage = Math.min(page, totalPages);

    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     *
     * Convert Decimal values to Number
     * so frontend receives normal JSON numbers.
     * =====================================================
     */

    const formattedBookings = bookings.map((booking) => ({
      ...booking,

      totalAmount: Number(booking.totalAmount),

      flight: {
        ...booking.flight,

        fare: Number(booking.flight.fare),
      },

      payment: booking.payment
        ? {
            ...booking.payment,

            amount: Number(booking.payment.amount),
          }
        : null,
    }));

    return res.status(200).json({
      success: true,

      count: formattedBookings.length,

      bookings: formattedBookings,

      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET ADMIN BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load bookings.",
    });
  }
};

/*
 * =====================================================
 * ADMIN CANCEL BOOKING
 * =====================================================
 */

export const cancelBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    /*
     * =====================================================
     * FIND BOOKING
     * =====================================================
     */

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        flight: true,
        payment: true,
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
     * =====================================================
     * ALREADY CANCELLED
     * =====================================================
     */

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,

        message: "Booking is already cancelled.",

        code: "BOOKING_ALREADY_CANCELLED",
      });
    }

    /*
     * =====================================================
     * CHECK PAYMENT
     * =====================================================
     *
     * Payment is a singular relation.
     *
     * We refund only if:
     *
     * status = SUCCEEDED
     *
     * and Stripe payment intent exists.
     * =====================================================
     */

    const successfulPayment =
      booking.payment &&
      booking.payment.status === "SUCCEEDED" &&
      booking.payment.stripePaymentIntentId
        ? booking.payment
        : null;

    /*
     * =====================================================
     * STRIPE REFUND
     * =====================================================
     */

    let refundId: string | null = null;

    if (successfulPayment) {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: successfulPayment.stripePaymentIntentId,
        });

        refundId = refund.id;
      } catch (stripeError) {
        console.error("STRIPE REFUND ERROR:", stripeError);

        return res.status(502).json({
          success: false,

          message:
            "Stripe refund could not be processed. Booking was not cancelled and seats were not released.",

          code: "STRIPE_REFUND_FAILED",
        });
      }
    }

    /*
     * =====================================================
     * DATABASE TRANSACTION
     * =====================================================
     */

    const cancelledBooking = await prisma.$transaction(async (tx) => {
      /*
       * =================================================
       * RE-CHECK BOOKING
       * =================================================
       */

      const currentBooking = await tx.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

      if (!currentBooking) {
        throw new Error("Booking not found.");
      }

      /*
       * Prevent duplicate cancellation.
       */

      if (currentBooking.status === "CANCELLED") {
        throw new Error("Booking is already cancelled.");
      }

      /*
       * =================================================
       * RELEASE SEATS
       * =================================================
       */

      await tx.flight.update({
        where: {
          id: currentBooking.flightId,
        },

        data: {
          availableSeats: {
            increment: currentBooking.passengerCount,
          },
        },
      });

      /*
       * =================================================
       * CANCEL BOOKING
       * =================================================
       *
       * Your Booking model does NOT have:
       *
       * cancelledAt
       *
       * Therefore we only update status.
       */

      const cancelled = await tx.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          status: "CANCELLED",
        },
      });

      /*
       * =================================================
       * UPDATE PAYMENT
       * =================================================
       *
       * Payment has:
       *
       * status
       * refundedAt
       *
       * It does NOT have stripeRefundId.
       */

      if (successfulPayment && refundId) {
        await tx.payment.update({
          where: {
            id: successfulPayment.id,
          },

          data: {
            status: "REFUNDED",

            refundedAt: new Date(),
          },
        });
      }

      return cancelled;
    });

    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    return res.json({
      success: true,

      message: successfulPayment
        ? "Booking cancelled and Stripe refund processed successfully."
        : "Booking cancelled and seats released successfully.",

      booking: cancelledBooking,

      refundId,
    });
  } catch (error) {
    console.error("ADMIN CANCEL BOOKING ERROR:", error);

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Unable to cancel booking.",
    });
  }
};

/*
 * =====================================================
 * DASHBOARD STATISTICS
 * =====================================================
 */

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    /*
     * =================================================
     * TODAY RANGE
     * =================================================
     */

    const startOfToday = new Date();

    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();

    endOfToday.setHours(23, 59, 59, 999);

    /*
     * =================================================
     * PARALLEL QUERIES
     * =================================================
     */

    const [
      bookingsToday,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      paymentRevenue,
    ] = await Promise.all([
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
       *
       * Only successful payments.
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

    /*
     * =================================================
     * CANCELLATION RATE
     * =================================================
     */

    const cancellationRate =
      totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

    /*
     * =================================================
     * RESPONSE
     * =================================================
     */

    return res.json({
      success: true,

      stats: {
        bookingsToday,

        totalBookings,

        pendingBookings,

        confirmedBookings,

        cancelledBookings,

        revenue: Number(paymentRevenue._sum.amount || 0),

        cancellationRate: Number(cancellationRate.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load dashboard statistics.",
    });
  }
};

/*
 * =====================================================
 * GET FLIGHTS
 * =====================================================
 *
 * Supports:
 *
 * ?search=AI101
 * ?search=Air India
 * ?search=Chennai
 * ?search=Mumbai
 *
 * Pagination:
 *
 * ?page=1&limit=10
 *
 * =====================================================
 */

export const getFlights = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const requestedPage = Number(req.query.page);

    const requestedLimit = Number(req.query.limit);

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 10;

    const skip = (page - 1) * limit;

    /*
     * =================================================
     * SEARCH
     * =================================================
     */

    const where: any = {};

    if (search.length > 0) {
      where.OR = [
        {
          flightNumber: {
            contains: search,

            mode: "insensitive",
          },
        },

        {
          airline: {
            contains: search,

            mode: "insensitive",
          },
        },

        {
          origin: {
            contains: search,

            mode: "insensitive",
          },
        },

        {
          destination: {
            contains: search,

            mode: "insensitive",
          },
        },
      ];
    }

    /*
     * =================================================
     * COUNT
     * =================================================
     */

    const total = await prisma.flight.count({
      where,
    });

    /*
     * =================================================
     * FLIGHTS
     * =================================================
     */

    const flights = await prisma.flight.findMany({
      where,

      orderBy: {
        departureAt: "asc",
      },

      skip,

      take: limit,
    });

    /*
     * =================================================
     * PAGINATION
     * =================================================
     */

    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    const currentPage = Math.min(page, totalPages);

    /*
     * =================================================
     * FORMAT DECIMAL
     * =================================================
     */

    const formattedFlights = flights.map((flight) => ({
      ...flight,

      fare: Number(flight.fare),
    }));

    /*
     * =================================================
     * RESPONSE
     * =================================================
     */

    return res.status(200).json({
      success: true,

      flights: formattedFlights,

      pagination: {
        page: currentPage,

        limit,

        total,

        totalPages,
      },
    });
  } catch (error) {
    console.error("GET ADMIN FLIGHTS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load flights.",
    });
  }
};

/*
 * =====================================================
 * CREATE FLIGHT
 * =====================================================
 */

export const createFlight = async (req: Request, res: Response) => {
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

    /*
     * =================================================
     * REQUIRED FIELDS
     * =================================================
     */

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

        message: "All flight fields are required.",
      });
    }

    /*
     * =================================================
     * DATE VALIDATION
     * =================================================
     */

    const departureDate = new Date(departureAt);

    const arrivalDate = new Date(arrivalAt);

    if (
      Number.isNaN(departureDate.getTime()) ||
      Number.isNaN(arrivalDate.getTime())
    ) {
      return res.status(400).json({
        success: false,

        message: "Invalid departure or arrival date.",
      });
    }

    if (arrivalDate <= departureDate) {
      return res.status(400).json({
        success: false,

        message: "Arrival time must be after departure time.",
      });
    }

    /*
     * =================================================
     * SEAT VALIDATION
     * =================================================
     */

    const seats = Number(totalSeats);

    if (!Number.isInteger(seats) || seats <= 0) {
      return res.status(400).json({
        success: false,

        message: "Total seats must be a positive integer.",
      });
    }

    /*
     * =================================================
     * FARE VALIDATION
     * =================================================
     */

    const flightFare = Number(fare);

    if (!Number.isFinite(flightFare) || flightFare < 0) {
      return res.status(400).json({
        success: false,

        message: "Fare must be a valid non-negative number.",
      });
    }

    /*
     * =================================================
     * CREATE FLIGHT
     * =================================================
     */

    const flight = await prisma.flight.create({
      data: {
        airline: String(airline).trim(),

        flightNumber: String(flightNumber).trim(),

        origin: String(origin).trim(),

        destination: String(destination).trim(),

        departureAt: departureDate,

        arrivalAt: arrivalDate,

        fare: flightFare,

        totalSeats: seats,

        availableSeats: seats,
      },
    });

    return res.status(201).json({
      success: true,

      message: "Flight created successfully.",

      flight: {
        ...flight,

        fare: Number(flight.fare),
      },
    });
  } catch (error) {
    console.error("CREATE FLIGHT ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to create flight.",
    });
  }
};

/*
 * =====================================================
 * UPDATE FLIGHT
 * =====================================================
 */

export const updateFlight = async (req: Request, res: Response) => {
  try {
    const { flightId } = req.params;

    /*
     * =================================================
     * FIND EXISTING FLIGHT
     * =================================================
     */

    const existingFlight = await prisma.flight.findUnique({
      where: {
        id: flightId,
      },
    });

    if (!existingFlight) {
      return res.status(404).json({
        success: false,

        message: "Flight not found.",
      });
    }

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

    /*
     * =================================================
     * DATE VALIDATION
     * =================================================
     */

    let departureDate: Date | undefined;

    let arrivalDate: Date | undefined;

    if (departureAt !== undefined) {
      departureDate = new Date(departureAt);

      if (Number.isNaN(departureDate.getTime())) {
        return res.status(400).json({
          success: false,

          message: "Invalid departure date.",
        });
      }
    }

    if (arrivalAt !== undefined) {
      arrivalDate = new Date(arrivalAt);

      if (Number.isNaN(arrivalDate.getTime())) {
        return res.status(400).json({
          success: false,

          message: "Invalid arrival date.",
        });
      }
    }

    /*
     * =================================================
     * FINAL DATE VALUES
     * =================================================
     */

    const finalDeparture = departureDate ?? existingFlight.departureAt;

    const finalArrival = arrivalDate ?? existingFlight.arrivalAt;

    if (finalArrival <= finalDeparture) {
      return res.status(400).json({
        success: false,

        message: "Arrival time must be after departure time.",
      });
    }

    /*
     * =================================================
     * TOTAL SEATS
     * =================================================
     */

    let newTotalSeats = existingFlight.totalSeats;

    if (totalSeats !== undefined) {
      newTotalSeats = Number(totalSeats);

      if (!Number.isInteger(newTotalSeats) || newTotalSeats < 1) {
        return res.status(400).json({
          success: false,

          message: "Total seats must be at least 1.",
        });
      }
    }

    /*
     * =================================================
     * CALCULATE BOOKED SEATS
     * =================================================
     */

    const bookedSeats = Math.max(
      0,

      Number(existingFlight.totalSeats) - Number(existingFlight.availableSeats),
    );

    /*
     * =================================================
     * PREVENT INVALID TOTAL SEATS
     * =================================================
     */

    if (newTotalSeats < bookedSeats) {
      return res.status(400).json({
        success: false,

        message: `Total seats cannot be less than ${bookedSeats}, because ${bookedSeats} seat(s) are already booked.`,
      });
    }

    /*
     * =================================================
     * AVAILABLE SEATS
     * =================================================
     */

    const newAvailableSeats = newTotalSeats - bookedSeats;

    /*
     * =================================================
     * FARE
     * =================================================
     */

    let newFare: number | undefined;

    if (fare !== undefined) {
      newFare = Number(fare);

      if (!Number.isFinite(newFare) || newFare < 0) {
        return res.status(400).json({
          success: false,

          message: "Fare must be a valid non-negative number.",
        });
      }
    }

    /*
     * =================================================
     * UPDATE
     * =================================================
     */

    const flight = await prisma.flight.update({
      where: {
        id: flightId,
      },

      data: {
        ...(airline !== undefined && {
          airline: String(airline).trim(),
        }),

        ...(flightNumber !== undefined && {
          flightNumber: String(flightNumber).trim(),
        }),

        ...(origin !== undefined && {
          origin: String(origin).trim(),
        }),

        ...(destination !== undefined && {
          destination: String(destination).trim(),
        }),

        ...(departureDate && {
          departureAt: departureDate,
        }),

        ...(arrivalDate && {
          arrivalAt: arrivalDate,
        }),

        ...(newFare !== undefined && {
          fare: newFare,
        }),

        totalSeats: newTotalSeats,

        availableSeats: newAvailableSeats,
      },
    });

    return res.json({
      success: true,

      message: "Flight updated successfully.",

      flight: {
        ...flight,

        fare: Number(flight.fare),
      },
    });
  } catch (error) {
    console.error("UPDATE FLIGHT ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update flight.",
    });
  }
};

/*
 * =====================================================
 * DELETE FLIGHT
 * =====================================================
 */

export const deleteFlight = async (req: Request, res: Response) => {
  try {
    const { flightId } = req.params;

    /*
     * =================================================
     * CHECK FLIGHT
     * =================================================
     */

    const flight = await prisma.flight.findUnique({
      where: {
        id: flightId,
      },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,

        message: "Flight not found.",
      });
    }

    /*
     * =================================================
     * CHECK ACTIVE BOOKINGS
     * =================================================
     *
     * Your enum has:
     *
     * PENDING
     * CONFIRMED
     * CANCELLED
     * PAYMENT_FAILED
     * REFUNDED
     *
     * =================================================
     */

    const activeBookings = await prisma.booking.count({
      where: {
        flightId,

        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,

        message: "Cannot delete a flight with active bookings.",
      });
    }

    /*
     * =================================================
     * DELETE
     * =================================================
     */

    await prisma.flight.delete({
      where: {
        id: flightId,
      },
    });

    return res.json({
      success: true,

      message: "Flight deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE FLIGHT ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to delete flight.",
    });
  }
};
