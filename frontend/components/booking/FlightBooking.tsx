"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  CalendarDays,
  Clock3,
  Users,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

import type { Flight } from "@/services/flight.service";

interface FlightBookingProps {
  flight: Flight;
}

export default function FlightBooking({
  flight,
}: FlightBookingProps) {
  const router = useRouter();

  const [passengers, setPassengers] = useState(1);

  const departure = new Date(flight.departureAt);
  const arrival = new Date(flight.arrivalAt);

  const total = flight.fare * passengers;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleContinue = () => {
    router.push(
      `/booking/${flight.id}/passengers?passengers=${passengers}`
    );
  };

  const maxPassengers = Math.min(
    flight.availableSeats,
    8
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5">
          <Link
            href="/flights"
            className="flex items-center gap-2 font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Flights
          </Link>

          <div className="mx-auto hidden items-center gap-2 sm:flex">
            <Plane
              className="text-blue-600"
              size={22}
            />

            <span className="text-xl font-bold text-slate-900">
              SkyBook
            </span>
          </div>

          <div className="w-28" />
        </div>
      </header>

      {/* PAGE */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Booking
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            Review your flight
          </h1>

          <p className="mt-2 text-slate-500">
            Confirm your flight details before continuing.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
          {/* FLIGHT CARD */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* AIRLINE */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-700 to-sky-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <Plane size={24} />
                </div>

                <div>
                  <p className="text-xl font-bold">
                    {flight.airline}
                  </p>

                  <p className="text-sm text-blue-100">
                    Flight {flight.flightNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-7">
              {/* ROUTE */}
              <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
                {/* DEPARTURE */}
                <div>
                  <p className="text-sm font-semibold text-slate-400">
                    Departure
                  </p>

                  <p className="mt-2 text-4xl font-extrabold text-slate-900">
                    {formatTime(departure)}
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-600">
                    {flight.origin}
                  </p>
                </div>

                {/* PLANE */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-12 bg-slate-300" />

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Plane size={19} />
                    </div>

                    <div className="h-px w-12 bg-slate-300" />
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 size={14} />
                    Direct
                  </div>
                </div>

                {/* ARRIVAL */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-400">
                    Arrival
                  </p>

                  <p className="mt-2 text-4xl font-extrabold text-slate-900">
                    {formatTime(arrival)}
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-600">
                    {flight.destination}
                  </p>
                </div>
              </div>

              {/* DATE */}
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <CalendarDays
                  size={20}
                  className="text-blue-600"
                />

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Departure date
                  </p>

                  <p className="font-semibold text-slate-800">
                    {formatDate(departure)}
                  </p>
                </div>
              </div>

              {/* PASSENGERS */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  <Users
                    size={16}
                    className="mr-2 inline"
                  />
                  Number of passengers
                </label>

                <select
                  value={passengers}
                  onChange={(event) =>
                    setPassengers(
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {Array.from(
                    {
                      length: maxPassengers,
                    },
                    (_, index) => index + 1
                  ).map((count) => (
                    <option
                      key={count}
                      value={count}
                    >
                      {count}{" "}
                      {count === 1
                        ? "Passenger"
                        : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Price Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Base fare
                </span>

                <span className="font-semibold text-slate-800">
                  ₹{flight.fare.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Passengers
                </span>

                <span className="font-semibold text-slate-800">
                  × {passengers}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-end justify-between">
                  <span className="font-semibold text-slate-700">
                    Total
                  </span>

                  <span className="text-3xl font-extrabold text-blue-700">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Continue
              <ArrowRight size={18} />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <CreditCard size={14} />
              Secure payment
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}