"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Plane,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import BookingsHeader from "@/components/mybookings/BookingsHeader";
import BookingCard from "@/components/mybookings/BookingCard";

import type { Booking } from "@/components/mybookings/BookingCard";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function MyBookingsPage() {
  const [user, setUser] =
    useState<UserData | null>(null);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const parsedUser: UserData =
          JSON.parse(storedUser);

        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );
    }

    /*
     * Connect your bookings API here.
     *
     * const response = await fetch(
     *   `${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`,
     *   {
     *     headers: {
     *       Authorization:
     *         `Bearer ${localStorage.getItem("accessToken")}`,
     *     },
     *   }
     * );
     *
     * const data = await response.json();
     *
     * setBookings(data.bookings);
     */

    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <Navbar user={user} />

      {/* Header */}

      <BookingsHeader
        bookingCount={bookings.length}
      />

      {/* Content */}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-14">

        {/* Top */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <p className="text-sm font-semibold text-slate-400">
              Total bookings
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {bookings.length}{" "}
              {bookings.length === 1
                ? "Booking"
                : "Bookings"}
            </h2>

          </div>

          <Link
            href="/flights"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <Plane size={17} />
            Book New Flight
          </Link>

        </div>

        {/* Loading */}

        {loading ? (

          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-orange-50">

              <Plane
                size={25}
                className="text-orange-500"
              />

            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading your bookings...
            </p>

          </div>

        ) : bookings.length === 0 ? (

          /* Empty state */

          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-500">
              <Plane size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-950">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              You haven't booked a flight yet.
              Start exploring destinations and
              find your next journey.
            </p>

            <Link
              href="/flights"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Search Flights
              <ArrowRight size={17} />
            </Link>

          </div>

        ) : (

          /* Booking list */

          <div className="space-y-6">

            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
              />
            ))}

          </div>

        )}

      </section>

      {/* Footer */}

      <Footer />

    </main>
  );
}