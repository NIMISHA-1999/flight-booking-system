"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Plane,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  CreditCard,
  Ticket,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import Footer from "@/components/layout/Footer";

import StatusBadge, {
  BookingStatus,
} from "@/components/mybookings/StatusBadge";

import api from "@/lib/axios";

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Booking {
  id: string;
  bookingReference: string;
  status: BookingStatus;

  flight: {
    id?: string;
    airline: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureAt: string;
    arrivalAt: string;
    fare: number | string;
  };

  passengerCount: number;
  totalAmount: number | string;
}

interface BookingResponse {
  success: boolean;
  booking: Booking;
  message?: string;
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, setUser] =
    useState<UserData | null>(null);

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ===================================================
   * LOAD BOOKING
   * ===================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * =============================================
         * GET LOGGED-IN USER
         * =============================================
         */

        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const parsedUser =
              JSON.parse(storedUser);

            if (mounted) {
              setUser(parsedUser);
            }
          } catch (userError) {
            console.error(
              "INVALID STORED USER:",
              userError,
            );

            localStorage.removeItem("user");
          }
        }

        /*
         * =============================================
         * CHECK ACCESS TOKEN
         * =============================================
         */

        const accessToken =
          localStorage.getItem("accessToken");

        if (!accessToken) {
          if (mounted) {
            setError(
              "Your session has expired. Please login again.",
            );
          }

          return;
        }

        /*
         * =============================================
         * GET BOOKING ID
         * =============================================
         */

        const { id } = await params;

        if (!id) {
          throw new Error(
            "Booking ID is missing.",
          );
        }

        console.log(
          "========== LOADING BOOKING ==========",
        );

        console.log(
          "BOOKING ID:",
          id,
        );

        /*
         * =============================================
         * GET BOOKING
         * =============================================
         */

        const response =
          await api.get<BookingResponse>(
            `/bookings/${id}`,
          );

        console.log(
          "BOOKING RESPONSE:",
          response.data,
        );

        /*
         * =============================================
         * VALIDATE RESPONSE
         * =============================================
         */

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Unable to fetch booking.",
          );
        }

        /*
         * =============================================
         * SET BOOKING
         * =============================================
         */

        if (mounted) {
          setBooking(
            response.data.booking,
          );
        }
      } catch (error: unknown) {
        console.error(
          "LOAD BOOKING ERROR:",
          error,
        );

        /*
         * =============================================
         * AXIOS ERROR
         * =============================================
         */

        if (
          error &&
          typeof error === "object" &&
          "response" in error
        ) {
          const axiosError =
            error as {
              response?: {
                status?: number;
                data?: {
                  message?: string;
                };
              };
            };

          const status =
            axiosError.response?.status;

          const message =
            axiosError.response?.data?.message;

          /*
           * =========================================
           * UNAUTHORIZED
           * =========================================
           */

          if (status === 401) {
            if (mounted) {
              setError(
                "Your session has expired. Please login again.",
              );
            }

            localStorage.removeItem(
              "accessToken",
            );

            localStorage.removeItem(
              "refreshToken",
            );

            localStorage.removeItem(
              "user",
            );

            return;
          }

          /*
           * =========================================
           * NOT FOUND
           * =========================================
           */

          if (status === 404) {
            if (mounted) {
              setError(
                "Booking not found.",
              );
            }

            return;
          }

          /*
           * =========================================
           * OTHER API ERROR
           * =========================================
           */

          if (mounted) {
            setError(
              message ||
                "Unable to load booking.",
            );
          }

          return;
        }

        /*
         * =============================================
         * NORMAL ERROR
         * =============================================
         */

        if (error instanceof Error) {
          if (mounted) {
            setError(error.message);
          }
        } else {
          if (mounted) {
            setError(
              "Unable to load booking.",
            );
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBooking();

    return () => {
      mounted = false;
    };
  }, [params]);

  /*
   * =====================================================
   * DATE FORMAT
   * =====================================================
   */

  const formatDate = (
    value: string,
  ) => {
    const date = new Date(value);

    return date.toLocaleDateString(
      [],
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
  };

  /*
   * =====================================================
   * TIME FORMAT
   * =====================================================
   */

  const formatTime = (
    value: string,
  ) => {
    const date = new Date(value);

    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* SKYBOOK HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Back */}
          <Link
            href="/booking"
            className="
              group
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-600
              transition
              hover:text-blue-700
            "
          >
            <span
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                transition
                group-hover:border-blue-200
                group-hover:bg-blue-50
              "
            >
              <ArrowLeft size={18} />
            </span>

            <span className="hidden sm:block">
              Back to My Bookings
            </span>
          </Link>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-700
                text-white
                shadow-md
                shadow-blue-700/20
              "
            >
              <Plane size={20} />
            </div>

            <span className="text-2xl font-bold text-slate-900">
              SkyBook
            </span>
          </Link>

          {/* Secure */}
          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-400
            "
          >
            <ShieldCheck
              size={18}
              className="text-blue-600"
            />

            <span className="hidden sm:block">
              Secure Booking
            </span>
          </div>

        </div>
      </header>

      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <section
        className="
          mx-auto
          max-w-6xl
          px-5
          py-8
          md:px-7
          md:py-12
        "
      >

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div
            className="
              rounded-[28px]
              border
              border-slate-200
              bg-white
              px-6
              py-24
              text-center
              shadow-[0_10px_40px_rgba(15,23,42,0.06)]
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
              "
            >
              <Loader2
                size={25}
                className="
                  animate-spin
                  text-orange-500
                "
              />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-600">
              Loading booking details...
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Please wait while we retrieve your
              booking.
            </p>
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading && error && (
          <div
            className="
              rounded-[28px]
              border
              border-red-200
              bg-white
              px-6
              py-16
              text-center
              shadow-[0_10px_40px_rgba(15,23,42,0.06)]
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                text-red-500
              "
            >
              <XCircle size={32} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Unable to load booking
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            {error.includes("session") ? (
              <Link
                href="/login"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-orange-500/20
                  transition
                  hover:bg-orange-600
                "
              >
                Login Again

                <ArrowLeft size={16} />
              </Link>
            ) : (
              <Link
                href="/booking"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-orange-500/20
                  transition
                  hover:bg-orange-600
                "
              >
                <ArrowLeft size={16} />

                Back to Bookings
              </Link>
            )}
          </div>
        )}

        {/* ================================================= */}
        {/* BOOKING DETAILS */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          booking && (
            <div className="space-y-6">

              {/* ================================================= */}
              {/* BOOKING HEADER */}
              {/* ================================================= */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-orange-100
                  bg-gradient-to-r
                  from-orange-50
                  via-white
                  to-orange-50/40
                  px-6
                  py-7
                  shadow-[0_10px_40px_rgba(15,23,42,0.05)]
                  md:px-8
                "
              >
                <div
                  className="
                    absolute
                    -right-16
                    -top-20
                    h-44
                    w-44
                    rounded-full
                    bg-orange-400/10
                    blur-3xl
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-20
                    left-1/3
                    h-32
                    w-32
                    rounded-full
                    bg-blue-400/10
                    blur-3xl
                  "
                />

                <Plane
                  size={130}
                  strokeWidth={1}
                  className="
                    absolute
                    right-8
                    top-1/2
                    hidden
                    -translate-y-1/2
                    rotate-[-10deg]
                    text-orange-500/5
                    lg:block
                  "
                />

                <div
                  className="
                    relative
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-orange-500
                        text-white
                        shadow-lg
                        shadow-orange-500/20
                      "
                    >
                      <Ticket size={25} />
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          text-slate-400
                        "
                      >
                        Booking Reference
                      </p>

                      <h1
                        className="
                          mt-1
                          text-xl
                          font-black
                          tracking-[0.12em]
                          text-slate-950
                          sm:text-2xl
                        "
                      >
                        {booking.bookingReference}
                      </h1>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <StatusBadge
                      status={booking.status}
                    />
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* FLIGHT CARD */}
              {/* ================================================= */}

              <div
                className="
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-slate-200
                  bg-white
                  shadow-[0_10px_40px_rgba(15,23,42,0.05)]
                "
              >

                {/* Airline */}

                <div
                  className="
                    border-b
                    border-slate-100
                    px-6
                    py-5
                    md:px-8
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-orange-50
                        text-orange-500
                      "
                    >
                      <Plane size={21} />
                    </div>

                    <div>
                      <p className="text-base font-black text-slate-950">
                        {booking.flight.airline}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Flight{" "}
                        {booking.flight.flightNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route */}

                <div className="px-6 py-8 md:px-10 md:py-10">
                  <div
                    className="
                      grid
                      items-center
                      gap-7
                      md:grid-cols-[1fr_220px_1fr]
                    "
                  >

                    {/* Departure */}

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.18em]
                          text-slate-400
                        "
                      >
                        Departure
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <h2
                          className="
                            text-2xl
                            font-black
                            tracking-tight
                            text-slate-950
                            sm:text-3xl
                          "
                        >
                          {booking.flight.origin}
                        </h2>

                        <MapPin
                          size={17}
                          className="text-orange-500"
                        />
                      </div>

                      <p className="mt-2 text-xl font-black text-orange-500">
                        {formatTime(
                          booking.flight.departureAt,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(
                          booking.flight.departureAt,
                        )}
                      </p>
                    </div>

                    {/* Center */}

                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />

                        <span
                          className="
                            text-[10px]
                            font-extrabold
                            uppercase
                            tracking-[0.18em]
                            text-slate-400
                          "
                        >
                          Non-stop
                        </span>

                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      </div>

                      <div className="mt-4 flex items-center">
                        <div className="h-px flex-1 border-t border-dashed border-slate-300" />

                        <div
                          className="
                            mx-3
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-orange-500
                            text-white
                            shadow-lg
                            shadow-orange-500/20
                          "
                        >
                          <Plane
                            size={17}
                            className="rotate-90"
                          />
                        </div>

                        <div className="h-px flex-1 border-t border-dashed border-slate-300" />
                      </div>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-center
                          gap-1.5
                          text-xs
                          text-slate-400
                        "
                      >
                        <Clock3 size={13} />

                        Direct flight
                      </div>
                    </div>

                    {/* Arrival */}

                    <div className="md:text-right">
                      <p
                        className="
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.18em]
                          text-slate-400
                        "
                      >
                        Arrival
                      </p>

                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-2
                          md:justify-end
                        "
                      >
                        <h2
                          className="
                            text-2xl
                            font-black
                            tracking-tight
                            text-slate-950
                            sm:text-3xl
                          "
                        >
                          {booking.flight.destination}
                        </h2>

                        <MapPin
                          size={17}
                          className="text-orange-500"
                        />
                      </div>

                      <p className="mt-2 text-xl font-black text-orange-500">
                        {formatTime(
                          booking.flight.arrivalAt,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(
                          booking.flight.arrivalAt,
                        )}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* BOOKING INFORMATION */}
              {/* ================================================= */}

              <div className="grid gap-4 sm:grid-cols-3">

                {/* Date */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-orange-50
                        text-orange-500
                      "
                    >
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Travel Date
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-800">
                        {new Date(
                          booking.flight.departureAt,
                        ).toLocaleDateString(
                          [],
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passengers */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-500
                      "
                    >
                      <Users size={18} />
                    </div>

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Passengers
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-800">
                        {booking.passengerCount}{" "}
                        {booking.passengerCount === 1
                          ? "Passenger"
                          : "Passengers"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fare */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-orange-100
                    bg-orange-50/70
                    p-5
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-orange-500
                        text-white
                        shadow-sm
                      "
                    >
                      <CreditCard size={18} />
                    </div>

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-orange-500/70
                        "
                      >
                        Total Fare
                      </p>

                      <p className="mt-1 text-lg font-black text-slate-950">
                        ₹
                        {Number(
                          booking.totalAmount,
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* ================================================= */}
              {/* BOOKING SUMMARY */}
              {/* ================================================= */}

              <div
                className="
                  rounded-[28px]
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-[0_10px_40px_rgba(15,23,42,0.05)]
                  md:p-8
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-orange-50
                      text-orange-500
                    "
                  >
                    <Ticket size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-950">
                      Booking Summary
                    </h2>

                    <p className="text-xs text-slate-400">
                      Your flight booking information
                    </p>
                  </div>
                </div>

                <div className="mt-6 divide-y divide-slate-100">

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-slate-500">
                      Airline
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {booking.flight.airline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-slate-500">
                      Flight Number
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {booking.flight.flightNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-slate-500">
                      Route
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {booking.flight.origin} →{" "}
                      {booking.flight.destination}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-slate-500">
                      Passengers
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {booking.passengerCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-slate-500">
                      Booking Status
                    </span>

                    <StatusBadge
                      status={booking.status}
                    />
                  </div>

                  <div className="flex items-center justify-between py-5">
                    <span className="text-base font-bold text-slate-700">
                      Total Amount
                    </span>

                    <span className="text-2xl font-black text-orange-500">
                      ₹
                      {Number(
                        booking.totalAmount,
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                </div>
              </div>

              {/* ================================================= */}
              {/* SUCCESS MESSAGE */}
              {/* ================================================= */}

              {booking.status === "CONFIRMED" && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-5
                    py-4
                  "
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />

                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      Booking confirmed
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      Your flight booking is confirmed.
                      Please keep your booking reference
                      for future use.
                    </p>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* ACTIONS */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:justify-between
                "
              >
                <Link
                  href="/booking"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-slate-700
                    shadow-sm
                    transition
                    hover:border-orange-200
                    hover:bg-orange-50
                    hover:text-orange-500
                  "
                >
                  <ArrowLeft size={16} />

                  My Bookings
                </Link>

                <Link
                  href="/flights"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-orange-500
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-orange-500/20
                    transition
                    hover:bg-orange-600
                  "
                >
                  <Plane size={17} />

                  Book Another Flight
                </Link>
              </div>

            </div>
          )}

      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <Footer />

    </main>
  );
}