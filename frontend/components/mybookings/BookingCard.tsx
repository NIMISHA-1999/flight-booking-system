"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Plane,
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  Users,
  CreditCard,
  Ticket,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import StatusBadge, {
  BookingStatus,
} from "./StatusBadge";

export interface Booking {
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

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({
  booking,
}: BookingCardProps) {
  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  const [cancelling, setCancelling] =
    useState(false);

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [cancelError, setCancelError] =
    useState("");

  /*
   * =====================================================
   * DATE / TIME
   * =====================================================
   */

  const departure = new Date(
    booking.flight.departureAt,
  );

  const arrival = new Date(
    booking.flight.arrivalAt,
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /*
   * =====================================================
   * AMOUNT
   * =====================================================
   */

  const totalAmount = Number(
    booking.totalAmount,
  );

  /*
   * =====================================================
   * STATUS
   * =====================================================
   */

  const isPending =
    booking.status === "PENDING";

  const isConfirmed =
    booking.status === "CONFIRMED";

  const isPaymentFailed =
    booking.status === "PAYMENT_FAILED";

  const isCancelled =
    booking.status === "CANCELLED";

  /*
   * =====================================================
   * PAYMENT URL
   * =====================================================
   */

  const paymentUrl = `/booking/${
    booking.flight.id || ""
  }/payment?bookingId=${encodeURIComponent(
    booking.id,
  )}`;

  /*
   * =====================================================
   * BOOKING DETAILS URL
   * =====================================================
   */

  const bookingUrl =
    `/bookings/${booking.id}`;

  /*
   * =====================================================
   * OPEN CANCEL MODAL
   * =====================================================
   */

  const openCancelModal = () => {
    setCancelError("");
    setShowCancelModal(true);
  };

  /*
   * =====================================================
   * CLOSE CANCEL MODAL
   * =====================================================
   */

  const closeCancelModal = () => {
    if (cancelling) {
      return;
    }

    setShowCancelModal(false);
    setCancelError("");
  };

  /*
   * =====================================================
   * CANCEL BOOKING
   * =====================================================
   */

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      setCancelError("");

      const token =
        localStorage.getItem("accessToken");

      if (!token) {
        setCancelError(
          "Your session has expired. Please login again.",
        );

        setCancelling(false);

        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "API URL is not configured.",
        );
      }

      const response = await fetch(
        `${apiUrl}/bookings/${booking.id}/cancel`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      let data: {
        success?: boolean;
        message?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "CANCEL BOOKING RESPONSE:",
        data,
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to cancel booking.",
        );
      }

      /*
       * Close popup after successful cancellation
       */
      setShowCancelModal(false);

      /*
       * Reload booking list so the new
       * CANCELLED status is displayed.
       */
      window.location.reload();
    } catch (error) {
      console.error(
        "CANCEL BOOKING ERROR:",
        error,
      );

      setCancelError(
        error instanceof Error
          ? error.message
          : "Unable to cancel booking.",
      );
    } finally {
      setCancelling(false);
    }
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <>
      <article
        className="
          group
          overflow-hidden
          rounded-[26px]
          border
          border-slate-200
          bg-white
          shadow-[0_10px_35px_rgba(15,23,42,0.05)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-orange-200
          hover:shadow-[0_18px_50px_rgba(15,23,42,0.09)]
        "
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            border-b
            border-orange-100
            bg-gradient-to-r
            from-orange-50
            via-white
            to-orange-50/40
            px-5
            py-4
            md:px-7
            md:py-5
          "
        >
          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-16
              -top-20
              h-40
              w-40
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

          {/* Decorative plane */}

          <Plane
            size={110}
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
              justify-between
              gap-4
              sm:flex-row
              sm:items-center
            "
          >
            {/* Airline */}

            <div className="flex items-center gap-3.5">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-500
                  text-white
                  shadow-md
                  shadow-orange-500/20
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              >
                <Plane
                  size={20}
                  className="rotate-[-8deg]"
                />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-extrabold
                    tracking-tight
                    text-slate-950
                    sm:text-base
                  "
                >
                  {booking.flight.airline}
                </p>

                <div
                  className="
                    mt-1
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                    text-[11px]
                    text-slate-400
                  "
                >
                  <Ticket
                    size={11}
                    className="text-orange-500"
                  />

                  <span>
                    Flight{" "}
                    {booking.flight.flightNumber}
                  </span>

                  <span className="text-slate-300">
                    •
                  </span>

                  <span>
                    {booking.flight.origin} →{" "}
                    {booking.flight.destination}
                  </span>
                </div>
              </div>
            </div>

            {/* STATUS */}

            <div className="relative z-10">
              <StatusBadge
                status={booking.status}
              />
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <div className="px-5 py-6 md:px-7 md:py-7">
          {/* DATE */}

          <div
            className="
              mb-6
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-slate-400
              "
            >
              <CalendarDays
                size={13}
                className="text-orange-500"
              />

              <span>
                {formatDate(departure)}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-[11px]
                font-semibold
                text-slate-400
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span>
                Flight itinerary
              </span>
            </div>
          </div>

          {/* ================================================= */}
          {/* ROUTE */}
          {/* ================================================= */}

          <div
            className="
              grid
              items-center
              gap-5
              md:grid-cols-[1fr_190px_1fr]
            "
          >
            {/* DEPARTURE */}

            <div>
              <p
                className="
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-slate-400
                "
              >
                Departure
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                <h2
                  className="
                    text-xl
                    font-black
                    tracking-tight
                    text-slate-950
                    sm:text-2xl
                    lg:text-3xl
                  "
                >
                  {booking.flight.origin}
                </h2>

                <MapPin
                  size={16}
                  className="text-orange-500"
                />
              </div>

              <p
                className="
                  mt-1.5
                  text-base
                  font-extrabold
                  text-orange-500
                  sm:text-lg
                "
              >
                {formatTime(departure)}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Departure time
              </p>
            </div>

            {/* CENTER */}

            <div className="order-first md:order-none">
              <div className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />

                <span
                  className="
                    text-[9px]
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

              <div className="mt-3 flex items-center">
                <div className="h-px flex-1 border-t border-dashed border-slate-300" />

                <div
                  className="
                    mx-2.5
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[4px]
                    border-orange-50
                    bg-orange-500
                    text-white
                    shadow-md
                    shadow-orange-500/20
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <Plane
                    size={16}
                    className="rotate-90"
                  />
                </div>

                <div className="h-px flex-1 border-t border-dashed border-slate-300" />
              </div>

              <div
                className="
                  mt-2.5
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  text-[11px]
                  font-medium
                  text-slate-400
                "
              >
                <Clock3 size={12} />

                <span>
                  Direct flight
                </span>
              </div>
            </div>

            {/* ARRIVAL */}

            <div className="md:text-right">
              <p
                className="
                  text-[9px]
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
                  mt-1.5
                  flex
                  items-center
                  gap-2
                  md:justify-end
                "
              >
                <h2
                  className="
                    text-xl
                    font-black
                    tracking-tight
                    text-slate-950
                    sm:text-2xl
                    lg:text-3xl
                  "
                >
                  {booking.flight.destination}
                </h2>

                <MapPin
                  size={16}
                  className="text-orange-500"
                />
              </div>

              <p
                className="
                  mt-1.5
                  text-base
                  font-extrabold
                  text-orange-500
                  sm:text-lg
                "
              >
                {formatTime(arrival)}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Arrival time
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* DIVIDER */}
          {/* ================================================= */}

          <div className="relative my-6">
            <div className="border-t border-dashed border-slate-200" />

            <div
              className="
                absolute
                -left-8
                -top-3
                h-6
                w-6
                rounded-full
                bg-slate-50
                md:-left-10
              "
            />

            <div
              className="
                absolute
                -right-8
                -top-3
                h-6
                w-6
                rounded-full
                bg-slate-50
                md:-right-10
              "
            />
          </div>

          {/* ================================================= */}
          {/* INFORMATION */}
          {/* ================================================= */}

          <div className="grid gap-3 sm:grid-cols-3">
            {/* DEPARTURE */}

            <div
              className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50/70
                p-3.5
                transition
                duration-300
                group-hover:border-orange-100
                group-hover:bg-orange-50/30
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-orange-500
                    shadow-sm
                  "
                >
                  <CalendarDays size={17} />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Departure
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      font-extrabold
                      text-slate-800
                    "
                  >
                    {formatDate(departure)}
                  </p>
                </div>
              </div>
            </div>

            {/* PASSENGERS */}

            <div
              className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50/70
                p-3.5
                transition
                duration-300
                group-hover:border-blue-100
                group-hover:bg-blue-50/30
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-blue-500
                    shadow-sm
                  "
                >
                  <Users size={17} />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Passengers
                  </p>

                  <p className="mt-1 text-xs font-extrabold text-slate-800">
                    {booking.passengerCount}{" "}
                    {booking.passengerCount === 1
                      ? "Passenger"
                      : "Passengers"}
                  </p>
                </div>
              </div>
            </div>

            {/* FARE */}

            <div
              className="
                rounded-xl
                border
                border-orange-100
                bg-orange-50/70
                p-3.5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-orange-500
                    text-white
                    shadow-sm
                    shadow-orange-500/20
                  "
                >
                  <CreditCard size={17} />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-orange-500/70
                    "
                  >
                    Total Fare
                  </p>

                  <p className="mt-1 text-base font-black text-slate-950">
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div
          className="
            border-t
            border-slate-100
            bg-slate-50/60
            px-5
            py-4
            md:px-7
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* BOOKING REFERENCE */}

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  text-orange-500
                  shadow-sm
                  ring-1
                  ring-slate-100
                "
              >
                <Ticket size={17} />
              </div>

              <div>
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-400
                  "
                >
                  Booking Reference
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-black
                    tracking-[0.14em]
                    text-slate-950
                  "
                >
                  {booking.bookingReference}
                </p>
              </div>
            </div>

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* PENDING */}

              {isPending && (
                <Link
                  href={paymentUrl}
                  className="
                    group/pay
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-orange-500
                    px-5
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    shadow-md
                    shadow-orange-500/20
                    transition-all
                    duration-200
                    hover:bg-orange-600
                    hover:shadow-lg
                    hover:shadow-orange-500/30
                  "
                >
                  <CreditCard size={15} />

                  Pay Now

                  <ArrowRight
                    size={15}
                    className="
                      transition-transform
                      duration-200
                      group-hover/pay:translate-x-1
                    "
                  />
                </Link>
              )}

              {/* PAYMENT FAILED */}

              {isPaymentFailed && (
                <Link
                  href={paymentUrl}
                  className="
                    group/pay
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-red-500
                    px-5
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    shadow-md
                    shadow-red-500/20
                    transition-all
                    duration-200
                    hover:bg-red-600
                    hover:shadow-lg
                  "
                >
                  <CreditCard size={15} />

                  Retry Payment

                  <ArrowRight
                    size={15}
                    className="
                      transition-transform
                      duration-200
                      group-hover/pay:translate-x-1
                    "
                  />
                </Link>
              )}

              {/* CONFIRMED */}

              {isConfirmed && (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-emerald-50
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-emerald-600
                  "
                >
                  <ShieldCheck size={15} />

                  Payment Complete
                </div>
              )}

              {/* CANCEL BOOKING */}

              {(isPending || isConfirmed) && (
                <button
                  type="button"
                  onClick={openCancelModal}
                  disabled={cancelling}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-200
                    bg-white
                    px-5
                    py-2.5
                    text-xs
                    font-bold
                    text-red-600
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-red-300
                    hover:bg-red-50
                    hover:text-red-700
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <XCircle size={15} />

                  Cancel Booking
                </button>
              )}

              {/* CANCELLED */}

              {isCancelled && (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-red-50
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-red-600
                  "
                >
                  <XCircle size={15} />

                  Booking Cancelled
                </div>
              )}

              {/* VIEW BOOKING */}

              <Link
                href={bookingUrl}
                className="
                  group/button
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-5
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  shadow-md
                  shadow-slate-900/10
                  transition-all
                  duration-200
                  hover:bg-slate-800
                  hover:shadow-lg
                "
              >
                View Booking

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    duration-200
                    group-hover/button:translate-x-1
                  "
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* PAYMENT NOTICE */}
        {/* ================================================= */}

        {isPending && (
          <div
            className="
              flex
              items-center
              gap-2
              border-t
              border-orange-100
              bg-orange-50
              px-5
              py-3
              text-[11px]
              font-medium
              text-orange-700
              md:px-7
            "
          >
            <CreditCard
              size={14}
              className="shrink-0"
            />

            <span>
              Your booking is reserved.
              Complete payment to confirm your
              flight.
            </span>
          </div>
        )}

        {/* ================================================= */}
        {/* CANCELLED NOTICE */}
        {/* ================================================= */}

        {isCancelled && (
          <div
            className="
              flex
              items-center
              gap-2
              border-t
              border-red-100
              bg-red-50
              px-5
              py-3
              text-[11px]
              font-medium
              text-red-700
              md:px-7
            "
          >
            <XCircle
              size={14}
              className="shrink-0"
            />

            <span>
              This booking has been cancelled.
            </span>
          </div>
        )}

        {/* ================================================= */}
        {/* BOTTOM ACCENT */}
        {/* ================================================= */}

        <div
          className="
            h-1
            bg-gradient-to-r
            from-orange-500
            via-orange-400
            to-sky-400
          "
        />
      </article>

      {/* ===================================================== */}
      {/* CANCEL CONFIRMATION MODAL */}
      {/* ===================================================== */}

      {showCancelModal && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-slate-950/60
            px-4
            py-6
            backdrop-blur-sm
          "
          onClick={closeCancelModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200
              bg-white
              shadow-[0_25px_80px_rgba(15,23,42,0.25)]
              animate-in
              fade-in
              zoom-in-95
              duration-200
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}

            <div
              className="
                relative
                overflow-hidden
                border-b
                border-red-100
                bg-gradient-to-br
                from-red-50
                via-white
                to-orange-50
                px-6
                py-6
              "
            >
              <div
                className="
                  absolute
                  -right-12
                  -top-12
                  h-32
                  w-32
                  rounded-full
                  bg-red-400/10
                  blur-2xl
                "
              />

              <div className="relative flex items-start gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-100
                    text-red-600
                  "
                >
                  <AlertTriangle
                    size={24}
                    strokeWidth={2.2}
                  />
                </div>

                <div>
                  <h3
                    id="cancel-booking-title"
                    className="
                      text-lg
                      font-black
                      tracking-tight
                      text-slate-950
                    "
                  >
                    Cancel Booking?
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    Are you sure you want to
                    cancel this flight booking?
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Information */}

            <div className="px-6 py-5">
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-slate-400
                      "
                    >
                      Booking Reference
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-black
                        tracking-wider
                        text-slate-900
                      "
                    >
                      {booking.bookingReference}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-slate-400
                      "
                    >
                      Total Fare
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-black
                        text-orange-500
                      "
                    >
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>

                <div className="my-4 border-t border-slate-200" />

                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-white
                      text-orange-500
                      shadow-sm
                    "
                  >
                    <Plane size={17} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-extrabold
                        text-slate-900
                      "
                    >
                      {booking.flight.origin}
                      {" → "}
                      {booking.flight.destination}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-400
                      "
                    >
                      {booking.flight.airline}{" "}
                      •{" "}
                      {booking.flight.flightNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}

              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-2.5
                  rounded-xl
                  border
                  border-amber-100
                  bg-amber-50
                  px-3.5
                  py-3
                  text-xs
                  leading-5
                  text-amber-700
                "
              >
                <AlertTriangle
                  size={15}
                  className="
                    mt-0.5
                    shrink-0
                  "
                />

                <span>
                  This action cannot be undone.
                  Your booking will be marked as
                  cancelled.
                </span>
              </div>

              {/* Error */}

              {cancelError && (
                <div
                  className="
                    mt-4
                    flex
                    items-start
                    gap-2.5
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-3.5
                    py-3
                    text-xs
                    leading-5
                    text-red-700
                  "
                >
                  <XCircle
                    size={15}
                    className="
                      mt-0.5
                      shrink-0
                    "
                  />

                  <span>
                    {cancelError}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Actions */}

            <div
              className="
                flex
                flex-col-reverse
                gap-2
                border-t
                border-slate-100
                bg-slate-50/70
                px-6
                py-4
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelling}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  text-sm
                  font-bold
                  text-slate-700
                  shadow-sm
                  transition-all
                  duration-200
                  hover:border-slate-300
                  hover:bg-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  shadow-red-500/20
                  transition-all
                  duration-200
                  hover:bg-red-600
                  hover:shadow-lg
                  hover:shadow-red-500/25
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {cancelling ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Cancelling...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={16}
                    />

                    Yes, Cancel Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}