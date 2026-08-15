import Link from "next/link";
import {
  Plane,
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  Users,
  CreditCard,
} from "lucide-react";

import BookingInfo from "./BookingInfo";
import StatusBadge, {
  BookingStatus,
} from "./StatusBadge";

export interface Booking {
  id: string;
  bookingReference: string;
  status: BookingStatus;

  flight: {
    airline: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureAt: string;
    arrivalAt: string;
    fare: number;
  };

  passengers: number;
  totalAmount: number;
}

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({
  booking,
}: BookingCardProps) {
  const departure = new Date(
    booking.flight.departureAt
  );

  const arrival = new Date(
    booking.flight.arrivalAt
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(15,23,42,0.10)]">

      {/* Booking Header */}

      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center md:px-8">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <Plane size={21} />
          </div>

          <div>
            <p className="font-bold text-slate-950">
              {booking.flight.airline}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Flight {booking.flight.flightNumber}
            </p>
          </div>

        </div>

        <StatusBadge status={booking.status} />

      </div>

      {/* Route */}

      <div className="px-6 py-7 md:px-8">

        <div className="grid items-center gap-7 md:grid-cols-[1fr_180px_1fr]">

          {/* Departure */}

          <div>

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Departure
            </p>

            <div className="mt-2 flex items-center gap-3">

              <p className="text-3xl font-black text-slate-950">
                {booking.flight.origin}
              </p>

              <MapPin
                size={17}
                className="text-orange-500"
              />

            </div>

            <p className="mt-1 text-xl font-bold text-orange-500">
              {formatTime(departure)}
            </p>

          </div>

          {/* Center */}

          <div className="flex flex-col items-center">

            <span className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Non-stop
            </span>

            <div className="flex w-full items-center">

              <div className="h-px flex-1 bg-slate-200" />

              <div className="mx-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">

                <Plane
                  size={16}
                  className="rotate-90"
                />

              </div>

              <div className="h-px flex-1 bg-slate-200" />

            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
              <Clock3 size={12} />
              Direct flight
            </div>

          </div>

          {/* Arrival */}

          <div className="md:text-right">

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Arrival
            </p>

            <div className="mt-2 flex items-center gap-3 md:justify-end">

              <p className="text-3xl font-black text-slate-950">
                {booking.flight.destination}
              </p>

              <MapPin
                size={17}
                className="text-orange-500"
              />

            </div>

            <p className="mt-1 text-xl font-bold text-orange-500">
              {formatTime(arrival)}
            </p>

          </div>

        </div>

        {/* Details */}

        <div className="mt-8 grid gap-4 border-t border-slate-100 pt-7 sm:grid-cols-3">

          <BookingInfo
            icon={<CalendarDays size={18} />}
            label="Departure"
            value={formatDate(departure)}
          />

          <BookingInfo
            icon={<Users size={18} />}
            label="Passengers"
            value={`${booking.passengers} ${
              booking.passengers === 1
                ? "Passenger"
                : "Passengers"
            }`}
          />

          <BookingInfo
            icon={<CreditCard size={18} />}
            label="Total Fare"
            value={`₹${booking.totalAmount.toLocaleString(
              "en-IN"
            )}`}
            highlight
          />

        </div>

      </div>

      {/* Footer */}

      <div className="flex flex-col justify-between gap-4 border-t border-slate-100 bg-[#fafaf8] px-6 py-5 sm:flex-row sm:items-center md:px-8">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Booking Reference
          </p>

          <p className="mt-1 font-black tracking-wider text-slate-950">
            {booking.bookingReference}
          </p>

        </div>

        <Link
          href={`/bookings/${booking.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-500"
        >
          View Details
          <ArrowRight size={16} />
        </Link>

      </div>

    </div>
  );
}