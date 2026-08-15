import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Search,
  Users,
  ArrowRight,
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
  const hasSearch = Boolean(
    origin || destination || date
  );

  if (!hasSearch) {
    return null;
  }

  return (
    <div className="relative z-10 -mt-10 mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

      {/* Header */}

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your Search
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Flight search details
          </h2>
        </div>

        <Link
          href="/flights"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
        >
          <Search size={16} />
          View all flights
        </Link>

      </div>

      {/* Search details */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* From */}

        {origin && (
          <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50">

            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <MapPin
                size={16}
                className="text-blue-600"
              />

              From
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {origin}
            </p>

          </div>
        )}

        {/* To */}

        {destination && (
          <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50">

            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <MapPin
                size={16}
                className="text-blue-600"
              />

              To
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {destination}
            </p>

          </div>
        )}

        {/* Date */}

        {date && (
          <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50">

            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <CalendarDays
                size={16}
                className="text-blue-600"
              />

              Departure
            </div>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {date}
            </p>

          </div>
        )}

        {/* Passengers */}

        <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50">

          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Users
              size={16}
              className="text-blue-600"
            />

            Passengers
          </div>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {passengers}
          </p>

        </div>

      </div>

    </div>
  );
}