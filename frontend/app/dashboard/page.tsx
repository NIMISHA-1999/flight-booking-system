"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Search,
  Ticket,
   Users,
  LogOut,
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { logout } from "@/services/auth.service";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const destinations = [
  {
    city: "Dubai",
    code: "DXB",
    price: "$199",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900",
  },
  {
    city: "London",
    code: "LHR",
    price: "$349",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900",
  },
  {
    city: "Paris",
    code: "CDG",
    price: "$289",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  const handleSearch = () => {
    if (!from || !to || !departureDate) {
      alert("Please select origin, destination and departure date.");
      return;
    }

    const params = new URLSearchParams({
      origin: from,
      destination: to,
      date: departureDate,
      passengers,
    });

    if (returnDate) {
      params.append("returnDate", returnDate);
    }

    router.push(`/flights?${params.toString()}`);
  };

  const handleDestinationSearch = (destination: string) => {
    setTo(destination);

    router.push(
      `/flights?destination=${encodeURIComponent(destination)}`
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  };

  return (
    <main className="bg-slate-50">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          {/* Logo */}

          <Link
            href="/dashboard"
            className="text-3xl font-bold text-white"
          >
            SkyBook
          </Link>

          {/* Navigation */}

          <div className="hidden items-center gap-8 text-white md:flex">

            <Link
              href="/dashboard"
              className="font-medium hover:text-orange-400"
            >
              Home
            </Link>

            <Link
              href="/flights"
              className="font-medium hover:text-orange-400"
            >
              Flights
            </Link>

            <Link
              href="/bookings"
              className="font-medium hover:text-orange-400"
            >
              My Bookings
            </Link>

            <Link
              href="/profile"
              className="font-medium hover:text-orange-400"
            >
              Profile
            </Link>

          </div>

          {/* User */}

          <div className="flex items-center gap-3">

            <div className="hidden text-right text-white sm:block">
              <p className="text-xs text-blue-100">
                Welcome
              </p>

              <p className="font-semibold">
                {user?.firstName || "Traveler"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-white transition hover:bg-white hover:text-slate-900"
            >
              <LogOut size={17} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>

        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="relative min-h-[760px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800')",
        }}
      >

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl flex-col justify-center px-6 pt-20">

          {/* Welcome */}

          <div className="max-w-3xl">

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              Welcome back to SkyBook
            </p>

            <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
              Where would you like
              <br />
              to fly?
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200 md:text-xl">
              {user
                ? `Hello ${user.firstName}, discover amazing destinations and book your next journey with SkyBook.`
                : "Discover amazing destinations and book your next journey with SkyBook."}
            </p>

          </div>

          {/* =================================================
              SEARCH BOX
          ================================================= */}

          <div className="mt-12 rounded-3xl border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl md:p-8">

            <div className="mb-6 flex items-center gap-2 text-white">
              <Search size={22} />

              <h2 className="text-xl font-semibold">
                Search Flights
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-6">

              {/* From */}

              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-white">
                  From
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={from}
                    onChange={(e) =>
                      setFrom(e.target.value.toUpperCase())
                    }
                    placeholder="DXB"
                    className="w-full rounded-xl bg-white px-4 py-3 pl-10 text-slate-900 outline-none focus:ring-4 focus:ring-orange-200"
                  />

                </div>
              </div>

              {/* To */}

              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-white">
                  To
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={to}
                    onChange={(e) =>
                      setTo(e.target.value.toUpperCase())
                    }
                    placeholder="LHR"
                    className="w-full rounded-xl bg-white px-4 py-3 pl-10 text-slate-900 outline-none focus:ring-4 focus:ring-orange-200"
                  />

                </div>
              </div>

              {/* Departure */}

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
                    className="w-full rounded-xl bg-white px-4 py-3 pl-10 text-slate-900 outline-none focus:ring-4 focus:ring-orange-200"
                  />

                </div>
              </div>

              {/* Return */}

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
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                    className="w-full rounded-xl bg-white px-4 py-3 pl-10 text-slate-900 outline-none focus:ring-4 focus:ring-orange-200"
                  />

                </div>
              </div>

              {/* Passengers */}

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
                    className="w-full appearance-none rounded-xl bg-white px-4 py-3 pl-10 text-slate-900 outline-none focus:ring-4 focus:ring-orange-200"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4 Passengers</option>
                    <option value="5">5 Passengers</option>
                    <option value="6">6 Passengers</option>
                    <option value="7">7 Passengers</option>
                    <option value="8">8 Passengers</option>
                  </select>

                </div>
              </div>

              {/* Search */}

              <div className="flex items-end">

                <button
                  onClick={handleSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 hover:shadow-lg"
                >
                  <Search size={20} />

                  Search
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-6 md:grid-cols-3">

          <Link
            href="/flights"
            className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Plane size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Search Flights
            </h3>

            <p className="mt-2 text-slate-500">
              Find available flights and choose the best fare.
            </p>

            <div className="mt-5 flex items-center gap-2 font-semibold text-blue-600">
              Search now
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </div>

          </Link>

          <Link
            href="/bookings"
            className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Ticket size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              My Bookings
            </h3>

            <p className="mt-2 text-slate-500">
              View, manage and cancel your existing bookings.
            </p>

            <div className="mt-5 flex items-center gap-2 font-semibold text-blue-600">
              View bookings
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </div>

          </Link>

          <Link
            href="/profile"
            className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Users size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              My Profile
            </h3>

            <p className="mt-2 text-slate-500">
              Manage your account information.
            </p>

            <div className="mt-5 flex items-center gap-2 font-semibold text-blue-600">
              View profile
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </div>

          </Link>

        </div>

      </section>

      {/* =====================================================
          POPULAR DESTINATIONS
      ===================================================== */}

      <section className="bg-white py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-widest text-orange-500">
              Explore
            </p>

            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              Popular Destinations
            </h2>

            <p className="mt-3 text-slate-500">
              Explore our most popular destinations.
            </p>

          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            {destinations.map((item) => (
              <div
                key={item.city}
                className="overflow-hidden rounded-3xl bg-white shadow-xl transition duration-300 hover:-translate-y-3"
              >

                <div className="relative">

                  <img
                    src={item.image}
                    alt={item.city}
                    className="h-64 w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-5 left-5 text-white">

                    <h3 className="text-3xl font-bold">
                      {item.city}
                    </h3>

                    <p className="mt-1 text-sm">
                      {item.code}
                    </p>

                  </div>

                </div>

                <div className="p-6">

                  <p className="text-sm text-slate-500">
                    Flights from
                  </p>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-3xl font-bold text-blue-700">
                      {item.price}
                    </span>

                    <button
                      onClick={() =>
                        handleDestinationSearch(item.code)
                      }
                      className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                    >
                      Explore
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-24 text-center text-white">

        <Plane
          size={60}
          className="mx-auto mb-6"
        />

        <h2 className="text-4xl font-bold md:text-5xl">
          Ready for Your Next Journey?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
          Search thousands of flights and find the perfect journey
          for your next adventure.
        </p>

        <Link
          href="/flights"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"
        >
          Search Flights
          <ArrowRight size={20} />
        </Link>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-slate-950 py-10 text-gray-300">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 md:flex-row">

          <div>
            <h3 className="text-2xl font-bold text-white">
              SkyBook
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Your journey starts here.
            </p>
          </div>

          <div className="flex gap-6 text-sm">

            <Link
              href="/"
              className="hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/"
              className="hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="hover:text-white"
            >
              Support
            </Link>

          </div>

        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-800 px-6 pt-6 text-sm text-gray-500">
          © 2026 SkyBook. All rights reserved.
        </div>

      </footer>

    </main>
  );
}