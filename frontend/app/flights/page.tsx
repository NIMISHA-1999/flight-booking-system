"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import FlightHeader from "@/components/flights/FlightHeader";
import FlightSearchSummary from "@/components/flights/FlightSearchSummary";
import FlightCard from "@/components/flights/FlightCard";
import FlightLoading from "@/components/flights/FlightLoading";
import FlightError from "@/components/flights/FlightError";
import NoFlights from "@/components/flights/NoFlights";

import {
  getAllFlights,
  searchFlights,
  type Flight,
} from "@/services/flight.service";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const FLIGHTS_PER_PAGE = 5;

export default function FlightsPage() {
  const searchParams = useSearchParams();

  const [user, setUser] = useState<UserData | null>(null);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
    }
  }, []);

  // =====================================================
  // LOAD FLIGHTS
  // =====================================================

  useEffect(() => {
    async function loadFlights() {
      try {
        setLoading(true);
        setError("");

        let result: Flight[];

        if (!origin && !destination && !date) {
          console.log("Fetching all flights...");

          result = await getAllFlights();
        } else {
          console.log("Searching flights...", {
            origin,
            destination,
            date,
            passengers,
          });

          result = await searchFlights({
            origin,
            destination,
            date,
            passengers,
          });
        }

        console.log("FLIGHTS:", result);

        setFlights(result);

        // Reset pagination when search changes
        setCurrentPage(1);
      } catch (err) {
        console.error("FLIGHT FETCH ERROR:", err);

        setError("Unable to load flights. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadFlights();
  }, [origin, destination, date, passengers]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    flights.length / FLIGHTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * FLIGHTS_PER_PAGE;

  const endIndex =
    startIndex + FLIGHTS_PER_PAGE;

  const currentFlights = flights.slice(
    startIndex,
    endIndex
  );

  const hasSearch = Boolean(
    origin || destination || date
  );

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar user={user} />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <FlightHeader hasSearch={hasSearch} />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* SEARCH SUMMARY */}

        <FlightSearchSummary
          origin={origin}
          destination={destination}
          date={date}
          passengers={passengers}
        />

        {/* LOADING */}

        {loading && <FlightLoading />}

        {/* ERROR */}

        {!loading && error && (
          <FlightError message={error} />
        )}

        {/* NO FLIGHTS */}

        {!loading &&
          !error &&
          flights.length === 0 && (
            <NoFlights />
          )}

        {/* FLIGHTS */}

        {!loading &&
          !error &&
          flights.length > 0 && (
            <>
              {/* Result heading */}

              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {flights.length}{" "}
                    {flights.length === 1
                      ? "Flight"
                      : "Flights"}{" "}
                    Available
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showing {startIndex + 1}–
                    {Math.min(
                      endIndex,
                      flights.length
                    )}{" "}
                    of {flights.length} flights
                  </p>
                </div>

                {totalPages > 1 && (
                  <p className="text-sm font-medium text-slate-500">
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </div>

              {/* Flight cards */}

              <div className="space-y-5">
                {currentFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                  />
                ))}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                  {/* Previous */}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  {/* Page numbers */}

                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                          currentPage === page
                            ? "bg-blue-700 text-white shadow-md shadow-blue-700/20"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next */}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </main>
  );
}