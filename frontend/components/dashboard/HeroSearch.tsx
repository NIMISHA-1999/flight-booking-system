"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  const handleSearch = () => {
    if (!from || !to || !departureDate) {
      alert(
        "Please select origin, destination and departure date."
      );
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

  return (
    <section
      className="relative min-h-[760px] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800')",
      }}
    >

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative mx-auto flex min-h-[760px] max-w-7xl flex-col justify-center px-6 pt-20">

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
            Discover amazing destinations and book your next
            journey with SkyBook.
          </p>
        </div>

        {/* SEARCH BOX */}

        <div className="mt-12 rounded-3xl border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl md:p-8">

          <div className="mb-6 flex items-center gap-2 text-white">
            <Search size={22} />

            <h2 className="text-xl font-semibold">
              Search Flights
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-6">

            {/* FROM */}

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
                  value={from}
                  onChange={(e) =>
                    setFrom(e.target.value.toUpperCase())
                  }
                  placeholder="Chennai"
                  className="w-full rounded-xl bg-white px-4 py-3 pl-10 text-slate-900 outline-none focus:ring-4 focus:ring-orange-200"
                />
              </div>
            </div>

            {/* TO */}

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
                  value={to}
                  onChange={(e) =>
                    setTo(e.target.value.toUpperCase())
                  }
                  placeholder="Mumbai"
                  className="w-full rounded-xl bg-white px-4 py-3 pl-10 text-slate-900 outline-none focus:ring-4 focus:ring-orange-200"
                />
              </div>
            </div>

            {/* DEPARTURE */}

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

            {/* RETURN */}

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

            {/* PASSENGERS */}

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

            {/* SEARCH */}

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
  );
}