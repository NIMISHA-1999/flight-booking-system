"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Plane,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import BookingCard, {
  Booking,
} from "@/components/mybookings/BookingCard";

import BookingsHeader from "@/components/mybookings/BookingsHeader";

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

interface BookingResponse {
  success: boolean;
  bookings: Booking[];
  message?: string;
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default function MyBookingsPage() {
  const [user, setUser] =
    useState<UserData | null>(null);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ===================================================
   * LOAD USER + BOOKINGS
   * ===================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * =============================================
         * GET USER
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
         *
         * We only check whether a token exists.
         *
         * We DO NOT check JWT expiry manually.
         *
         * Axios interceptor handles:
         *
         * access token expired
         *        ↓
         * backend returns 401
         *        ↓
         * /auth/refresh
         *        ↓
         * new access token
         *        ↓
         * retry /bookings
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
         * GET BOOKINGS
         * =============================================
         *
         * IMPORTANT:
         *
         * Use Axios here.
         *
         * api.ts automatically adds:
         *
         * Authorization: Bearer <accessToken>
         *
         * If access token is expired, the interceptor
         * automatically refreshes it and retries this
         * request.
         */

        console.log(
          "========== LOADING BOOKINGS ==========",
        );

        const response =
          await api.get<BookingResponse>(
            "/bookings",
          );

        console.log(
          "BOOKINGS RESPONSE:",
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
              "Unable to fetch bookings.",
          );
        }

        /*
         * =============================================
         * SET BOOKINGS
         * =============================================
         */

        if (mounted) {
          setBookings(
            response.data.bookings || [],
          );
        }

        console.log(
          "BOOKINGS LOADED SUCCESSFULLY",
        );
      } catch (error: unknown) {
        console.error(
          "LOAD BOOKINGS ERROR:",
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
           *
           * Normally the Axios interceptor should
           * refresh the token before this reaches here.
           *
           * If it still reaches here with 401, the
           * refresh token is probably expired/invalid.
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
           * OTHER API ERROR
           * =========================================
           */

          if (mounted) {
            setError(
              message ||
                "Unable to load your bookings.",
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
              "Unable to load your bookings.",
            );
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    /*
     * Cleanup
     */

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <Navbar user={user} />

      {/* ================================================= */}
      {/* BOOKINGS HEADER */}
      {/* ================================================= */}

      <BookingsHeader
        bookingCount={bookings.length}
      />

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-14">

        {/* ================================================= */}
        {/* CONTENT HEADER */}
        {/* ================================================= */}

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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Plane size={17} />

            Book New Flight
          </Link>
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">

            <p>{error}</p>

            <div className="mt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
              >
                Login Again

                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
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

            <p className="mt-2 text-xs text-slate-400">
              Checking your session and retrieving
              your bookings.
            </p>

          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          bookings.length === 0 && (
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
          )}

        {/* ================================================= */}
        {/* BOOKINGS */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          bookings.length > 0 && (
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

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <Footer />

    </main>
  );
}