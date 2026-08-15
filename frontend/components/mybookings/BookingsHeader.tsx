import {
  Plane,
  Sparkles,
  Ticket,
  ShieldCheck,
  Globe2,
} from "lucide-react";

interface BookingsHeaderProps {
  bookingCount: number;
}

export default function BookingsHeader({
  bookingCount,
}: BookingsHeaderProps) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-6 pb-24 pt-20 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Orange glow */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Decorative plane */}
      {/* <Plane
        size={300}
        strokeWidth={1}
        className="absolute right-8 top-16 hidden rotate-[-15deg] text-white/10 lg:block"
      /> */}

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">

        {/* Label */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
          <Sparkles
            size={16}
            className="text-orange-400"
          />

          <span>Your Travel</span>
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          My{" "}
          <span className="text-orange-400">
            Bookings
          </span>
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
          View your upcoming trips, check your booking
          details and manage your flights with SkyBook.
        </p>

        {/* Status */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
            <Ticket size={16} />
          </div>

          <span>
            {bookingCount}{" "}
            {bookingCount === 1
              ? "booking"
              : "bookings"}{" "}
            in your account
          </span>

        </div>

        {/* Feature cards */}
        <div className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
              <Ticket size={21} />
            </div>

            <p className="text-xs font-medium text-white/70">
              Your trips
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              Easy Management
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <ShieldCheck size={21} />
            </div>

            <p className="text-xs font-medium text-white/70">
              Protected
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              Secure Bookings
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/30">
              <Globe2 size={21} />
            </div>

            <p className="text-xs font-medium text-white/70">
              Your journey
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              Travel Worldwide
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}