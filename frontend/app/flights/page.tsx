"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

export default function FlightsPage() {
  const searchParams = useSearchParams();

  const [user, setUser] = useState<UserData | null>(null);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        // No search parameters
        // GET /api/flight
        if (!origin && !destination && !date) {
          console.log("Fetching all flights...");

          result = await getAllFlights();
        } else {
          // Search parameters
          // GET /api/flight/search
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
      } catch (err) {
        console.error("FLIGHT FETCH ERROR:", err);

        setError(
          "Unable to load flights. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFlights();
  }, [
    origin,
    destination,
    date,
    passengers,
  ]);

  const hasSearch = Boolean(
    origin || destination || date
  );

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar user={user} />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <FlightHeader
        hasSearch={hasSearch}
      />

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
            <div className="space-y-5">

              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-900">
                  {flights.length}{" "}
                  {flights.length === 1
                    ? "Flight"
                    : "Flights"}{" "}
                  Available
                </h2>
              </div>

              {flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                />
              ))}

            </div>
          )}

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </main>
  );
}