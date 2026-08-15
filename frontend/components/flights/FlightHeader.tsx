import {
  Plane,
  Sparkles,
  ShieldCheck,
  Clock3,
  Globe2,
} from "lucide-react";

interface FlightHeaderProps {
  hasSearch: boolean;
}

export default function FlightHeader({
  hasSearch,
}: FlightHeaderProps) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-6 pb-24 pt-20 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600')",
      }}
    >
      {/* ================= OVERLAY ================= */}

      {/* Main dark overlay - similar to Home */}
      <div className="absolute inset-0 bg-black/60" />

      
     

      {/* Orange glow */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
     

      {/* ================= CONTENT ================= */}

      <div className="relative mx-auto max-w-7xl">

        {/* Label */}

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md">

          <Sparkles
            size={16}
            className="text-orange-400"
          />

          <span>
            {hasSearch
              ? "Flight Search"
              : "Explore Flights"}
          </span>

        </div>

        {/* Heading */}

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">

          {hasSearch ? (
            <>
              Find Your{" "}
              <span className="text-orange-400">
                Perfect Flight
              </span>
            </>
          ) : (
            <>
              Available{" "}
              <span className="text-orange-400">
                Flights
              </span>
            </>
          )}

        </h1>

        {/* Description */}

        <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
          {hasSearch
            ? "Compare available flights, check fares and choose the best option for your journey."
            : "Explore available flights and discover your next destination with SkyBook."}
        </p>

        {/* ================= FEATURE CARDS ================= */}

        <div className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">

          {/* Fast & Secure */}

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">

              <Clock3 size={21} />

            </div>

            <p className="text-xs font-medium text-white/70">
              Easy booking
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              Fast & Secure
            </p>

          </div>

          {/* Best Fares */}

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">

              <ShieldCheck size={21} />

            </div>

            <p className="text-xs font-medium text-white/70">
              Best fares
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              Compare Flights
            </p>

          </div>

          {/* Worldwide */}

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15">

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

        {/* ================= SEARCH STATUS ================= */}

        {hasSearch && (
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">

              <Plane size={16} />

            </div>

            <span>
              Showing flights matching your search
            </span>

          </div>
        )}

      </div>
    </section>
  );
}