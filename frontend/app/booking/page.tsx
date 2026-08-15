"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Plane,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
 * PAGINATION
 * =====================================================
 */

const ITEMS_PER_PAGE = 5;

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
   * CURRENT PAGE
   * ===================================================
   */

  const [currentPage, setCurrentPage] =
    useState(1);

  /*
   * ===================================================
   * TOTAL PAGES
   * ===================================================
   */

  const totalPages = Math.ceil(
    bookings.length / ITEMS_PER_PAGE,
  );

  /*
   * ===================================================
   * PAGINATED BOOKINGS
   * ===================================================
   */

  const paginatedBookings = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return bookings.slice(
      startIndex,
      endIndex,
    );
  }, [bookings, currentPage]);

  /*
   * ===================================================
   * PAGE NUMBERS
   * ===================================================
   */

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      pages.push(page);
    }

    return pages;
  }, [totalPages]);

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

          /*
           * Always start from first page
           */

          setCurrentPage(1);
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
   * SAFETY
   * =====================================================
   *
   * If bookings are removed and current page no longer
   * exists, move back to the last available page.
   */

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /*
   * =====================================================
   * PAGE CHANGE
   * =====================================================
   */

  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    /*
     * Scroll smoothly to bookings section
     */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
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

            Book New Flight
          </Link>
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div
            className="
              mb-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              font-semibold
              text-red-600
            "
          >
            <p>{error}</p>

            <div className="mt-4">
              <Link
                href="/login"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-red-700
                "
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
          <div
            className="
              rounded-[28px]
              border
              border-slate-200
              bg-white
              px-6
              py-20
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                animate-pulse
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
              "
            >
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
            <div
              className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                px-6
                py-20
                text-center
                shadow-[0_10px_40px_rgba(15,23,42,0.06)]
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-orange-50
                  text-orange-500
                "
              >
                <Plane size={36} />
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-950">
                No bookings yet
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                You haven't booked a flight yet.
                Start exploring destinations and
                find your next journey.
              </p>

              <Link
                href="/flights"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-orange-500/20
                  transition
                  hover:bg-orange-600
                "
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
            <>
              <div className="space-y-6">
                {paginatedBookings.map(
                  (booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                    />
                  ),
                )}
              </div>

              {/* ================================================= */}
              {/* PAGINATION */}
              {/* ================================================= */}

             {/* ================================================= */}
{/* PAGINATION */}
{/* ================================================= */}

{totalPages > 1 && (
  <div className="mt-10 border-t border-slate-200 pt-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

      {/* ============================================= */}
      {/* RESULTS */}
      {/* ============================================= */}

      <div className="text-center sm:text-left">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>
          {" – "}
          <span className="font-bold text-slate-900">
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              bookings.length,
            )}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-900">
            {bookings.length}
          </span>{" "}
          bookings
        </p>
      </div>

      {/* ============================================= */}
      {/* PAGINATION */}
      {/* ============================================= */}

      <div className="flex items-center justify-center gap-2">

        {/* Previous */}

        <button
          type="button"
          onClick={() =>
            goToPage(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="
            group
            inline-flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            text-sm
            font-bold
            text-slate-600
            shadow-sm
            transition-all
            duration-200
            hover:border-orange-200
            hover:bg-orange-50
            hover:text-orange-500
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-600
            sm:px-4
          "
        >
          <ChevronLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />

          <span className="hidden sm:inline">
            Previous
          </span>
        </button>

        {/* ============================================= */}
        {/* DESKTOP PAGE NUMBERS */}
        {/* ============================================= */}

        <div className="hidden items-center gap-1.5 sm:flex">

          {/* First page */}

          <button
            type="button"
            onClick={() => goToPage(1)}
            className={`
              flex
              h-10
              min-w-10
              items-center
              justify-center
              rounded-xl
              px-3
              text-sm
              font-bold
              transition-all
              duration-200
              ${
                currentPage === 1
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
              }
            `}
          >
            1
          </button>

          {/* Left ellipsis */}

          {currentPage > 3 && (
            <span className="flex h-10 w-8 items-center justify-center text-sm font-bold text-slate-400">
              ...
            </span>
          )}

          {/* Middle pages */}

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1,
          )
            .filter((page) => {
              if (page === 1) return false;
              if (page === totalPages) return false;

              return (
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1
              );
            })
            .map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`
                  flex
                  h-10
                  min-w-10
                  items-center
                  justify-center
                  rounded-xl
                  px-3
                  text-sm
                  font-bold
                  transition-all
                  duration-200
                  ${
                    currentPage === page
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
                  }
                `}
              >
                {page}
              </button>
            ))}

          {/* Right ellipsis */}

          {currentPage < totalPages - 2 && (
            <span className="flex h-10 w-8 items-center justify-center text-sm font-bold text-slate-400">
              ...
            </span>
          )}

          {/* Last page */}

          {totalPages > 1 && (
            <button
              type="button"
              onClick={() =>
                goToPage(totalPages)
              }
              className={`
                flex
                h-10
                min-w-10
                items-center
                justify-center
                rounded-xl
                px-3
                text-sm
                font-bold
                transition-all
                duration-200
                ${
                  currentPage === totalPages
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
                }
              `}
            >
              {totalPages}
            </button>
          )}
        </div>

        {/* ============================================= */}
        {/* MOBILE PAGE INDICATOR */}
        {/* ============================================= */}

        <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm sm:hidden">
          <span className="text-orange-500">
            {currentPage}
          </span>

          <span className="mx-2 text-slate-300">
            /
          </span>

          <span>
            {totalPages}
          </span>
        </div>

        {/* ============================================= */}
        {/* NEXT */}
        {/* ============================================= */}

        <button
          type="button"
          onClick={() =>
            goToPage(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
          className="
            group
            inline-flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            text-sm
            font-bold
            text-slate-600
            shadow-sm
            transition-all
            duration-200
            hover:border-orange-200
            hover:bg-orange-50
            hover:text-orange-500
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-600
            sm:px-4
          "
        >
          <span className="hidden sm:inline">
            Next
          </span>

          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>

      </div>
    </div>
  </div>
)}
            </>
          )}
      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <Footer />
    </main>
  );
}