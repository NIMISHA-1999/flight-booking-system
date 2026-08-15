import {
  CalendarDays,
  Plane,
  Users,
} from "lucide-react";

import type { Booking } from "@/services/booking.service";

interface Props {
  booking: Booking;
}

export default function BookingSummary({ booking }: Props) {
  const flight = booking.flight;

  if (!flight) {
    return null;
  }

  const departure = new Date(flight.departureAt);
  const arrival = new Date(flight.arrivalAt);

  const isValidDate = (date: Date) =>
    !Number.isNaN(date.getTime());

  const formatTime = (date: Date) => {
    if (!isValidDate(date)) {
      return "--:--";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    if (!isValidDate(date)) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <aside className="lg:sticky lg:top-8 lg:h-fit">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

        {/* HEADER */}
        <div className="bg-slate-900 px-6 py-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Order Summary
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Your booking
          </h2>
        </div>

        <div className="p-6">

          {/* BOOKING REFERENCE */}
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Booking Reference
            </p>

            <p className="mt-2 text-2xl font-black tracking-wide text-slate-900">
              {booking.bookingReference}
            </p>
          </div>

          {/* FLIGHT */}
          <div className="mt-5 rounded-2xl bg-slate-50 p-5">

            {/* AIRLINE */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Plane size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {flight.airline}
                </p>

                <p className="text-xs text-slate-400">
                  Flight {flight.flightNumber}
                </p>
              </div>
            </div>

            {/* ROUTE + TIME */}
            <div className="mt-6 flex items-center justify-between">

              {/* DEPARTURE */}
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  {flight.origin}
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatTime(departure)}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Departure
                </p>
              </div>

              {/* PLANE */}
              <div className="flex flex-col items-center px-3">
                <Plane
                  size={20}
                  className="rotate-90 text-blue-600"
                />

                <div className="mt-2 h-px w-10 bg-slate-300" />
              </div>

              {/* ARRIVAL */}
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  {flight.destination}
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatTime(arrival)}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Arrival
                </p>
              </div>

            </div>

            {/* DATE */}
            <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
              <CalendarDays size={14} />

              <span>
                {formatDate(departure)}
              </span>
            </div>

          </div>

          {/* PASSENGERS */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">

            <div className="flex items-center gap-2">
              <Users
                size={16}
                className="text-slate-500"
              />

              <span className="text-sm text-slate-500">
                Passengers
              </span>
            </div>

            <span className="font-bold text-slate-800">
              {booking.passengerCount}
            </span>

          </div>

          {/* STATUS */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">

            <span className="text-sm font-medium text-orange-700">
              Status
            </span>

            <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-700">
              {booking.status}
            </span>

          </div>

          {/* TOTAL */}
          <div className="my-6 border-t border-dashed border-slate-200" />

          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Amount Due
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-700">
                ₹
                {Number(booking.totalAmount).toLocaleString("en-IN")}
              </p>
            </div>

            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              INR
            </span>

          </div>

        </div>
      </div>
    </aside>
  );
}