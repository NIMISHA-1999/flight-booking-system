"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Search,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";

interface Props {
  origin: string;
  destination: string;
  date: string;
  passengers: string;
}

export default function FlightSearchSummary({
  origin,
  destination,
  date,
  passengers,
}: Props) {
  const router = useRouter();

  const [from, setFrom] = useState(origin);
  const [to, setTo] = useState(destination);
  const [departureDate, setDepartureDate] = useState(date);
  const [passengerCount, setPassengerCount] =
    useState(passengers);

  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (from.trim()) {
      params.set("origin", from.trim().toUpperCase());
    }

    if (to.trim()) {
      params.set(
        "destination",
        to.trim().toUpperCase()
      );
    }

    if (departureDate) {
      params.set("date", departureDate);
    }

    params.set("passengers", passengerCount);

    router.push(`/flights?${params.toString()}`);
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setDepartureDate("");
    setPassengerCount("1");

    router.push("/flights");
  };

  return (
    <div className="relative z-20 -mt-8 mb-10">

      {/* MAIN SEARCH CARD */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

        {/* Header */}

        <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-sky-50 px-6 py-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Search size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Search Flights
                </h2>

                <p className="text-sm text-slate-500">
                  Find the perfect flight for your journey
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                showFilters
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

          </div>

        </div>

        {/* SEARCH FORM */}

        <div className="p-6">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            {/* FROM */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                From
              </label>

              <div className="relative">

                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <input
                  value={from}
                  onChange={(e) =>
                    setFrom(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Origin"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* TO */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                To
              </label>

              <div className="relative">

                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <input
                  value={to}
                  onChange={(e) =>
                    setTo(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Destination"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* DATE */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Departure
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) =>
                    setDepartureDate(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* PASSENGERS */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Passengers
              </label>

              <div className="relative">

                <Users
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <select
                  value={passengerCount}
                  onChange={(e) =>
                    setPassengerCount(e.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  {Array.from(
                    { length: 8 },
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

            {/* SEARCH BUTTON */}

            <div className="flex items-end">

              <button
                type="button"
                onClick={handleSearch}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 font-bold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md"
              >
                <Search size={19} />
                Search
              </button>

            </div>

          </div>

          {/* FILTER PANEL */}

          {showFilters && (
            <div className="mt-6 border-t border-slate-100 pt-6">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-bold text-slate-900">
                    Flight Filters
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Refine your flight results
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(false)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* AIRLINE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Airline
                  </label>

                  <select className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                    <option value="">
                      All Airlines
                    </option>
                    <option value="air-india">
                      Air India
                    </option>
                    <option value="indigo">
                      IndiGo
                    </option>
                    <option value="emirates">
                      Emirates
                    </option>
                  </select>
                </div>

                {/* PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Maximum Price
                  </label>

                  <select className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                    <option value="">
                      Any Price
                    </option>
                    <option value="5000">
                      Under ₹5,000
                    </option>
                    <option value="10000">
                      Under ₹10,000
                    </option>
                    <option value="25000">
                      Under ₹25,000
                    </option>
                    <option value="50000">
                      Under ₹50,000
                    </option>
                  </select>
                </div>

                {/* STOPS */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stops
                  </label>

                  <select className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                    <option value="">
                      Any
                    </option>
                    <option value="direct">
                      Direct
                    </option>
                    <option value="1">
                      1 Stop
                    </option>
                    <option value="2">
                      2+ Stops
                    </option>
                  </select>
                </div>

              </div>

              <button
                type="button"
                onClick={handleClear}
                className="mt-5 text-sm font-semibold text-slate-500 hover:text-red-500"
              >
                Clear search
              </button>

            </div>
          )}

        </div>

      </div>

      {/* SEARCH RESULT SUMMARY */}

      {(origin || destination || date) && (
        <div className="mt-4 flex flex-wrap items-center gap-3">

          <span className="text-sm font-medium text-slate-500">
            Current search:
          </span>

          {origin && (
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {origin}
            </span>
          )}

          {destination && (
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {destination}
            </span>
          )}

          {date && (
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {date}
            </span>
          )}

          <button
            onClick={handleClear}
            className="text-xs font-semibold text-red-500 hover:text-red-600"
          >
            Clear
          </button>

        </div>
      )}

    </div>
  );
}