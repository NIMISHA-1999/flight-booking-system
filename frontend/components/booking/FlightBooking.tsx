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
  ShieldCheck,
  Luggage,
  CheckCircle2,
  MapPin,
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

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Back */}
          <Link
            href="/flights"
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition group-hover:border-blue-200 group-hover:bg-blue-50">
              <ArrowLeft size={18} />
            </span>

            <span className="hidden sm:block">
              Back to Flights
            </span>
          </Link>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
              <Plane size={20} />
            </div>

            <span className="text-2xl font-bold text-slate-900">
              SkyBook
            </span>
          </Link>

          {/* Secure */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
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
      {/* PAGE */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/flights"
            className="text-slate-400 hover:text-blue-600"
          >
            Flights
          </Link>

          <span className="text-slate-300">
            /
          </span>

          <span className="font-semibold text-blue-600">
            Booking
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600">
            <Plane size={14} />
            Flight Booking
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Review your flight
          </h1>

          <p className="mt-3 max-w-2xl text-base text-slate-500">
            Check your flight details and select the number
            of passengers before continuing.
          </p>

        </div>

        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="space-y-7">

            {/* FLIGHT CARD */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* Blue Header */}

              <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-7 py-7 text-white">

                {/* Decorative circles */}

                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

                <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-white/5" />

                <div className="relative flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                      <Plane size={24} />
                    </div>

                    <div>
                      <p className="text-lg font-bold">
                        {flight.airline}
                      </p>

                      <p className="mt-1 text-sm text-blue-100">
                        Flight {flight.flightNumber}
                      </p>
                    </div>

                  </div>

                  <div className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">

                    <div className="flex items-center gap-1.5">

                      <CheckCircle2 size={14} />

                      <span className="text-xs font-bold">
                        Available
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* Route */}

              <div className="p-7 md:p-9">

                <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">

                  {/* Departure */}

                  <div>

                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      <MapPin size={14} />
                      Departure
                    </div>

                    <div className="mt-3">

                      <p className="text-4xl font-bold text-slate-900">
                        {flight.origin}
                      </p>

                      <p className="mt-1 text-2xl font-bold text-blue-700">
                        {formatTime(departure)}
                      </p>

                    </div>

                  </div>

                  {/* Route line */}

                  <div className="flex flex-col items-center">

                    <span className="mb-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      Direct
                    </span>

                    <div className="flex w-full min-w-[120px] items-center">

                      <div className="h-px flex-1 bg-slate-300" />

                      <div className="mx-2 flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/20">
                        <Plane
                          size={18}
                          className="rotate-90"
                        />
                      </div>

                      <div className="h-px flex-1 bg-slate-300" />

                    </div>

                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                      <Clock3 size={13} />
                      Non-stop
                    </div>

                  </div>

                  {/* Arrival */}

                  <div className="text-left md:text-right">

                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 md:justify-end">
                      <MapPin size={14} />
                      Arrival
                    </div>

                    <div className="mt-3">

                      <p className="text-4xl font-bold text-slate-900">
                        {flight.destination}
                      </p>

                      <p className="mt-1 text-2xl font-bold text-blue-700">
                        {formatTime(arrival)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Date */}

                <div className="mt-9 grid gap-4 border-t border-slate-100 pt-7 sm:grid-cols-2">

                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <CalendarDays size={20} />
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-slate-400">
                        Departure Date
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {formatDate(departure)}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Clock3 size={20} />
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-slate-400">
                        Flight Status
                      </p>

                      <p className="mt-1 text-sm font-bold text-emerald-600">
                        On schedule
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* PASSENGER CARD */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Users size={21} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Select passengers
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    How many people will be travelling?
                  </p>

                </div>

              </div>

              <div className="mt-7">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Number of passengers
                </label>

                <div className="relative">

                  <Users
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={passengers}
                    onChange={(event) =>
                      setPassengers(
                        Number(event.target.value)
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-11 py-4 text-sm font-semibold text-slate-800 outline-none transition hover:border-blue-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Luggage size={14} />

                  <span>
                    {flight.availableSeats} seats currently available
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* RIGHT SUMMARY */}
          {/* ================================================= */}

          <aside className="lg:sticky lg:top-8 lg:h-fit">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

              {/* Summary Header */}

              <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-6 text-white">

                <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
                  Booking Summary
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Your trip
                </h2>

              </div>

              <div className="p-6">

                {/* Mini route */}

                <div className="rounded-2xl bg-slate-50 p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold text-slate-400">
                        {flight.origin}
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {formatTime(departure)}
                      </p>

                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <Plane
                        size={16}
                        className="rotate-90"
                      />
                    </div>

                    <div className="text-right">

                      <p className="text-xs font-semibold text-slate-400">
                        {flight.destination}
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {formatTime(arrival)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Price */}

                <div className="mt-7 space-y-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Fare per passenger
                    </span>

                    <span className="font-bold text-slate-800">
                      ₹{flight.fare.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Passengers
                    </span>

                    <span className="font-bold text-slate-800">
                      × {passengers}
                    </span>

                  </div>

                </div>

                <div className="my-6 border-t border-dashed border-slate-200" />

                {/* Total */}

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Total Fare
                    </p>

                    <p className="mt-1 text-3xl font-bold text-blue-700">
                      ₹{total.toLocaleString("en-IN")}
                    </p>

                  </div>

                  <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                    INR
                  </span>

                </div>

                {/* Continue */}

                <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98]"
                >
                  Continue Booking

                  <ArrowRight size={18} />
                </button>

                {/* Security */}

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex gap-3">

                    <ShieldCheck
                      size={19}
                      className="shrink-0 text-blue-700"
                    />

                    <div>

                      <p className="text-xs font-bold text-blue-800">
                        Safe & Secure
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-blue-600">
                        Your booking details are securely
                        processed and protected.
                      </p>

                    </div>

                  </div>

                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <CreditCard size={14} />
                  Secure payment
                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>
    </main>
  );
}