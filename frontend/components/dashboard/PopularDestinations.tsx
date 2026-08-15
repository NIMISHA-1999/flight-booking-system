"use client";

import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";

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

export default function PopularDestinations() {
  const router = useRouter();

  const handleDestinationSearch = (
    destination: string
  ) => {
    router.push(
      `/flights?destination=${encodeURIComponent(destination)}`
    );
  };

  return (
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
                      handleDestinationSearch(
                        item.code
                      )
                    }
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                  >
                    Explore
                    <ArrowRight size={16} />
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}