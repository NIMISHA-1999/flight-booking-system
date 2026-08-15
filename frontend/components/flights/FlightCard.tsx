"use client";

import {
  Plane,
  ArrowRight,
  Clock3,
  Armchair,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import type { Flight } from "@/services/flight.service";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({
  flight,
}: FlightCardProps) {
  const departure = new Date(flight.departureAt);
  const arrival = new Date(flight.arrivalAt);

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

  const durationMs =
    arrival.getTime() - departure.getTime();

  const durationHours = Math.floor(
    durationMs / (1000 * 60 * 60)
  );

  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) /
      (1000 * 60)
  );

  const duration = `${durationHours}h ${durationMinutes}m`;

  const soldOut = flight.availableSeats === 0;

  const fewSeats =
    flight.availableSeats > 0 &&
    flight.availableSeats <= 10;

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        {/* Airline */}

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Plane size={22} />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              {flight.airline}
            </p>

            <p className="text-sm text-slate-500">
              Flight {flight.flightNumber}
            </p>
          </div>

        </div>

        {/* Date */}

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
          <CalendarDays
            size={16}
            className="text-blue-600"
          />

          {formatDate(departure)}
        </div>

      </div>

      {/* =====================================================
          FLIGHT INFORMATION
      ===================================================== */}

      <div className="px-6 py-7 lg:px-8">

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.7fr_1fr_1.1fr]">

          {/* =================================================
              DEPARTURE
          ================================================= */}

          <div className="text-left">

            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              Departure
            </p>

            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              {formatTime(departure)}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {flight.origin}
            </p>

          </div>

          {/* =================================================
              ROUTE
          ================================================= */}

          <div>

            <div className="flex items-center">

              {/* Left line */}

              <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-200 to-blue-400" />

              {/* Plane */}

              <div className="relative mx-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-blue-50 bg-blue-600 text-white shadow-lg shadow-blue-600/20">

                <Plane
                  size={20}
                  className="rotate-90"
                />

              </div>

              {/* Right line */}

              <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-400 to-blue-200" />

            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">

              <Clock3 size={14} />

              <span>{duration}</span>

              <span className="text-slate-300">
                •
              </span>

              <span>Direct flight</span>

            </div>

          </div>

          {/* =================================================
              ARRIVAL
          ================================================= */}

          <div className="lg:text-right">

            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              Arrival
            </p>

            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              {formatTime(arrival)}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {flight.destination}
            </p>

          </div>

          {/* =================================================
              PRICE
          ================================================= */}

          <div className="border-t border-slate-100 pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Fare from
            </p>

            <p className="mt-1 text-3xl font-extrabold text-blue-700">
              ₹{flight.fare.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              per passenger
            </p>

            <button
              disabled={soldOut}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              {soldOut
                ? "Sold Out"
                : "Select Flight"}

              {!soldOut && (
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}
            </button>

          </div>

        </div>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div className="relative my-7">

          <div className="border-t border-dashed border-slate-200" />

          <div className="absolute -left-9 -top-3 h-6 w-6 rounded-full bg-slate-50 lg:-left-11" />

          <div className="absolute -right-9 -top-3 h-6 w-6 rounded-full bg-slate-50 lg:-right-11" />

        </div>

        {/* =====================================================
            BOTTOM INFORMATION
        ===================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Seat information */}

          <div className="flex items-center gap-3">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                soldOut
                  ? "bg-red-50"
                  : fewSeats
                  ? "bg-orange-50"
                  : "bg-green-50"
              }`}
            >
              <Armchair
                size={19}
                className={
                  soldOut
                    ? "text-red-500"
                    : fewSeats
                    ? "text-orange-500"
                    : "text-green-600"
                }
              />
            </div>

            <div>

              <p className="text-xs font-medium text-slate-400">
                Seat availability
              </p>

              <p className="font-semibold text-slate-700">
                {flight.availableSeats} seats remaining
              </p>

            </div>

          </div>

          {/* Status */}

          <div
            className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-xs font-bold sm:self-auto ${
              soldOut
                ? "bg-red-50 text-red-600"
                : fewSeats
                ? "bg-orange-50 text-orange-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {!soldOut && (
              <CheckCircle2 size={14} />
            )}

            {soldOut
              ? "Flight Sold Out"
              : fewSeats
              ? "Only a few seats left"
              : "Seats available"}
          </div>

        </div>

      </div>

    </article>
  );
}