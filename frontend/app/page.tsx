"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Plane,
  ShieldCheck,
  Clock3,
  Globe2,
  Search,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

const destinations = [
  {
    city: "Dubai",
    price: "$199",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900",
  },
  {
    city: "London",
    price: "$349",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900",
  },
  {
    city: "Paris",
    price: "$289",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
  },
];

export default function Home() {
  const router = useRouter();

  // ================= SEARCH STATES =================

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  // ================= SEARCH =================

  const handleSearch = () => {
  // From and To are required
  if (!from || !to) {
    alert("Please select origin and destination.");
    return;
  }

  const params = new URLSearchParams({
    origin: from,
    destination: to,
    passengers,
  });

  // Departure date is optional
  if (departureDate) {
    params.append("date", departureDate);
  }

  // Return date is also optional
  if (returnDate) {
    params.append("returnDate", returnDate);
  }

  router.push(`/flights?${params.toString()}`);
};

  return (
    <main className="bg-slate-50">

      {/* ================= NAVBAR ================= */}

      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          <h1 className="text-3xl font-bold text-white">
            SkyBook
          </h1>

          <div className="hidden gap-8 font-medium text-white md:flex">
            <Link href="/">Home</Link>
            <Link href="/flights">Flights</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="flex gap-3">

            <Link
              href="/login"
              className="rounded-lg border border-white px-5 py-2 text-white transition hover:bg-white hover:text-slate-900"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-orange-500 px-5 py-2 text-white transition hover:bg-orange-600"
            >
              Register
            </Link>

          </div>

        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600')",
        }}
      >

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6">

          {/* HERO CONTENT */}

          <h1 className="max-w-3xl text-6xl font-bold text-white md:text-7xl">
            Discover the World with SkyBook
          </h1>

          <p className="mt-6 max-w-xl text-xl text-white">
            Book domestic and international flights at unbeatable prices.
          </p>

          {/* ================= SEARCH BOX ================= */}

          <div className="mt-12 rounded-3xl border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl md:p-8">

            <div className="mb-6 flex items-center gap-2 text-white">

              <Search size={22} />

              <h2 className="text-xl font-semibold">
                Search Flights
              </h2>

            </div>

            <div className="grid gap-4 md:grid-cols-6">

              {/* ================= FROM ================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-white">
                  From
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={from}
                    onChange={(e) =>
                      setFrom(e.target.value.toUpperCase())
                    }
                    placeholder="Chennai"
                    className="
                      w-full
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      pl-10
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:ring-4
                      focus:ring-orange-200
                    "
                  />

                </div>

              </div>

              {/* ================= TO ================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-white">
                  To
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={to}
                    onChange={(e) =>
                      setTo(e.target.value.toUpperCase())
                    }
                    placeholder="Mumbai"
                    className="
                      w-full
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      pl-10
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:ring-4
                      focus:ring-orange-200
                    "
                  />

                </div>

              </div>

              {/* ================= DEPARTURE ================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-white">
                  Departure
                </label>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) =>
                      setDepartureDate(e.target.value)
                    }
                    className="
                      w-full
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      pl-10
                      text-slate-900
                      outline-none
                      focus:ring-4
                      focus:ring-orange-200
                    "
                  />

                </div>

              </div>

              {/* ================= RETURN ================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-white">
                  Return
                </label>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={returnDate}
                    min={departureDate || undefined}
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                    className="
                      w-full
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      pl-10
                      text-slate-900
                      outline-none
                      focus:ring-4
                      focus:ring-orange-200
                    "
                  />

                </div>

              </div>

              {/* ================= PASSENGERS ================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-white">
                  Passengers
                </label>

                <div className="relative">

                  <Users
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={passengers}
                    onChange={(e) =>
                      setPassengers(e.target.value)
                    }
                    className="
                      w-full
                      appearance-none
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      pl-10
                      text-slate-900
                      outline-none
                      focus:ring-4
                      focus:ring-orange-200
                    "
                  >

                    {Array.from(
                      { length: 8 },
                      (_, index) => index + 1
                    ).map((number) => (

                      <option
                        key={number}
                        value={number}
                      >
                        {number}{" "}
                        {number === 1
                          ? "Passenger"
                          : "Passengers"}
                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {/* ================= SEARCH BUTTON ================= */}

              <div className="flex items-end">

                <button
                  type="button"
                  onClick={handleSearch}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-orange-500
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-orange-600
                    hover:shadow-lg
                  "
                >

                  <Search size={20} />

                  Search

                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= DESTINATIONS ================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-center text-4xl font-bold">
          Popular Destinations
        </h2>

        <p className="mt-3 text-center text-gray-500">
          Explore our most booked destinations.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">

          {destinations.map((item) => (

            <div
              key={item.city}
              className="overflow-hidden rounded-3xl bg-white shadow-xl transition duration-300 hover:-translate-y-3"
            >

              <img
                src={item.image}
                alt={item.city}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  {item.city}
                </h3>

                <p className="mt-2 text-gray-600">
                  Flights from
                </p>

                <div className="mt-5 flex items-center justify-between">

                  <span className="text-3xl font-bold text-blue-700">
                    {item.price}
                  </span>

                  <button className="rounded-lg bg-orange-500 px-5 py-2 text-white">
                    Book
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="bg-white py-24">

        <div className="mx-auto max-w-7xl">

          <h2 className="text-center text-4xl font-bold">
            Why Choose SkyBook
          </h2>

          <div className="mt-16 grid gap-10 px-6 md:grid-cols-4">

            <Feature
              icon={<Plane size={42} />}
              title="500+ Airlines"
              text="Compare flights from airlines across the world."
            />

            <Feature
              icon={<ShieldCheck size={42} />}
              title="Secure Payments"
              text="Protected online payments with Stripe."
            />

            <Feature
              icon={<Clock3 size={42} />}
              title="24/7 Support"
              text="Customer support available anytime."
            />

            <Feature
              icon={<Globe2 size={42} />}
              title="Worldwide Flights"
              text="Travel to more than 180 countries."
            />

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="bg-slate-900 py-20 text-white">

        <div className="mx-auto grid max-w-6xl gap-10 text-center md:grid-cols-4">

          <Stat number="15M+" label="Passengers" />
          <Stat number="180+" label="Countries" />
          <Stat number="500+" label="Airlines" />
          <Stat number="98%" label="Customer Satisfaction" />

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="bg-gradient-to-r from-blue-700 to-sky-500 py-24 text-center text-white">

        <Users
          className="mx-auto mb-5"
          size={60}
        />

        <h2 className="text-5xl font-bold">
          Ready for Your Next Journey?
        </h2>

        <p className="mt-6 text-xl">
          Book your flight today and enjoy exclusive offers.
        </p>

        <Link
          href="/flights"
          className="mt-10 inline-block rounded-xl bg-orange-500 px-8 py-4 font-bold hover:bg-orange-600"
        >
          Search Flights
        </Link>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-950 py-8 text-gray-300">

        <div className="mx-auto flex max-w-7xl flex-col justify-between px-6 md:flex-row">

          <p>
            © 2026 SkyBook. All rights reserved.
          </p>

          <div className="mt-4 flex gap-6 md:mt-0">

            <Link href="/">Privacy</Link>
            <Link href="/">Terms</Link>
            <Link href="/">Support</Link>

          </div>

        </div>

      </footer>

    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl p-8 text-center shadow transition duration-300 hover:shadow-xl">

      <div className="flex justify-center text-blue-700">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-gray-500">
        {text}
      </p>

    </div>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div>

      <h3 className="text-5xl font-bold text-orange-400">
        {number}
      </h3>

      <p className="mt-3 text-lg">
        {label}
      </p>

    </div>
  );
}