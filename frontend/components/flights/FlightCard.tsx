"use client";

import {
  Plane,
  ArrowRight,
} from "lucide-react";

import type { Flight } from "@/services/flight.service";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({
  flight,
}: FlightCardProps) {
  const departure = new Date(
    flight.departureAt
  );

  const arrival = new Date(
    flight.arrivalAt
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="grid items-center gap-6 md:grid-cols-5">

        {/* AIRLINE */}

        <div>
          <p className="text-lg font-bold text-slate-900">
            {flight.airline}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {flight.flightNumber}
          </p>
        </div>

        {/* ROUTE */}

        <div className="md:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatTime(departure)}
              </p>

              <p className="text-sm text-slate-500">
                {flight.origin}
              </p>
            </div>

            <div className="flex flex-1 items-center px-5">

              <div className="h-px flex-1 bg-slate-300" />

              <div className="mx-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                <Plane
                  size={18}
                  className="text-blue-600"
                />
              </div>

              <div className="h-px flex-1 bg-slate-300" />

            </div>

            <div className="text-right">

              <p className="text-2xl font-bold text-slate-900">
                {formatTime(arrival)}
              </p>

              <p className="text-sm text-slate-500">
                {flight.destination}
              </p>

            </div>

          </div>

          <p className="mt-2 text-center text-xs text-slate-400">
            {formatDate(departure)}
          </p>

        </div>

        {/* SEATS */}

        <div className="text-center">

          <p className="text-sm text-slate-500">
            Available seats
          </p>

          <p
            className={`mt-1 text-lg font-bold ${
              flight.availableSeats > 10
                ? "text-green-600"
                : flight.availableSeats > 0
                ? "text-orange-500"
                : "text-red-600"
            }`}
          >
            {flight.availableSeats}
          </p>

        </div>

        {/* PRICE */}

        <div className="text-right">

          <p className="text-sm text-slate-500">
            From
          </p>

          <p className="text-3xl font-bold text-blue-700">
            ₹{flight.fare.toLocaleString("en-IN")}
          </p>

          <button
            disabled={flight.availableSeats === 0}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {flight.availableSeats === 0
              ? "Sold Out"
              : "Select"}

            {flight.availableSeats > 0 && (
              <ArrowRight size={17} />
            )}
          </button>

        </div>

      </div>
    </div>
  );
}