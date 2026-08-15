import { Plane, Sparkles } from "lucide-react";

interface FlightHeaderProps {
  hasSearch: boolean;
}

export default function FlightHeader({
  hasSearch,
}: FlightHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 pb-24 pt-20 text-white">

      {/* Background decoration */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />

      {/* Decorative plane */}
      <Plane
        size={280}
        strokeWidth={1}
        className="absolute right-10 top-10 hidden rotate-[-15deg] text-white/5 lg:block"
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Small label */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
          <Sparkles size={16} className="text-orange-400" />

          {hasSearch
            ? "Flight Search"
            : "Explore Flights"}
        </div>

        {/* Title */}
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          {hasSearch
            ? "Find Your Perfect Flight"
            : "Available Flights"}
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
          {hasSearch
            ? "Compare available flights, check fares and choose the best option for your journey."
            : "Explore available flights and discover your next destination with SkyBook."}
        </p>

        {/* Bottom information */}
        <div className="mt-8 flex flex-wrap gap-3">

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
            <p className="text-xs text-blue-200">
              Easy booking
            </p>

            <p className="mt-1 font-semibold">
              Fast & Secure
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
            <p className="text-xs text-blue-200">
              Best fares
            </p>

            <p className="mt-1 font-semibold">
              Compare Flights
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
            <p className="text-xs text-blue-200">
              Your journey
            </p>

            <p className="mt-1 font-semibold">
              Travel with SkyBook
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}