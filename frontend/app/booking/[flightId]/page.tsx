"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plane } from "lucide-react";

import {
  getFlightById,
  type Flight,
} from "@/services/flight.service";

import FlightBooking from "@/components/booking/FlightBooking";

export default function BookingPage() {
  const params = useParams();

  const flightId = String(params.flightId);

  const [flight, setFlight] = useState<Flight | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFlight() {
      try {
        setLoading(true);
        setError("");

        const result = await getFlightById(flightId);

        setFlight(result);
      } catch (error) {
        console.error("FLIGHT ERROR:", error);

        setError(
          "Unable to load flight details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (flightId) {
      loadFlight();
    }
  }, [flightId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-slate-500">
              Loading flight details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !flight) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <Plane
            size={50}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Flight not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error ||
              "This flight is no longer available."}
          </p>
        </div>
      </main>
    );
  }

  return <FlightBooking flight={flight} />;
}