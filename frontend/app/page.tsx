import Link from "next/link";
import {
  Plane,
  ShieldCheck,
  Clock3,
  Globe2,
  Search,
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
  return (
    <main className="bg-slate-50">

      {/* ================= NAVBAR ================= */}

      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6">

          <h1 className="text-3xl font-bold text-white">
            SkyBook
          </h1>

          <div className="hidden md:flex gap-8 text-white font-medium">
            <Link href="/">Home</Link>
            <Link href="/flights">Flights</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="border border-white px-5 py-2 rounded-lg text-white hover:bg-white hover:text-slate-900 transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-orange-500 px-5 py-2 rounded-lg text-white hover:bg-orange-600"
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
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center px-6">

          <h1 className="text-white text-6xl md:text-7xl font-bold max-w-3xl">
            Discover the World with SkyBook
          </h1>

          <p className="text-white text-xl mt-6 max-w-xl">
            Book domestic and international flights at unbeatable prices.
          </p>

          {/* Search */}

          <div className="mt-12 bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

            <div className="grid md:grid-cols-6 gap-4">

              <input
                placeholder="From"
                className="bg-white rounded-xl p-4"
              />

              <input
                placeholder="To"
                className="bg-white rounded-xl p-4"
              />

              <input
                type="date"
                className="bg-white rounded-xl p-4"
              />

              <input
                type="date"
                className="bg-white rounded-xl p-4"
              />

              <input
                placeholder="Passengers"
                className="bg-white rounded-xl p-4"
              />

              <button className="bg-orange-500 hover:bg-orange-600 rounded-xl text-white flex items-center justify-center gap-2">
                <Search size={20} />
                Search
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* ================= DESTINATIONS ================= */}

      <section className="py-24 max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Popular Destinations
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Explore our most booked destinations.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-14">

          {destinations.map((item) => (

            <div
              key={item.city}
              className="rounded-3xl overflow-hidden shadow-xl bg-white hover:-translate-y-3 duration-300"
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

                <div className="flex justify-between items-center mt-5">

                  <span className="text-3xl font-bold text-blue-700">
                    {item.price}
                  </span>

                  <button className="bg-orange-500 text-white px-5 py-2 rounded-lg">
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

        <div className="max-w-7xl mx-auto">

          <h2 className="text-center text-4xl font-bold">
            Why Choose SkyBook
          </h2>

          <div className="grid md:grid-cols-4 gap-10 mt-16 px-6">

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

      <section className="bg-slate-900 text-white py-20">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 text-center gap-10">

          <Stat number="15M+" label="Passengers" />

          <Stat number="180+" label="Countries" />

          <Stat number="500+" label="Airlines" />

          <Stat number="98%" label="Customer Satisfaction" />

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="py-24 bg-gradient-to-r from-blue-700 to-sky-500 text-white text-center">

        <Users className="mx-auto mb-5" size={60} />

        <h2 className="text-5xl font-bold">
          Ready for Your Next Journey?
        </h2>

        <p className="mt-6 text-xl">
          Book your flight today and enjoy exclusive offers.
        </p>

        <Link
          href="/flights"
          className="inline-block mt-10 bg-orange-500 px-8 py-4 rounded-xl font-bold hover:bg-orange-600"
        >
          Search Flights
        </Link>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-950 text-gray-300 py-8">

        <div className="max-w-7xl mx-auto flex justify-between flex-col md:flex-row px-6">

          <p>© 2026 SkyBook. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">

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
    <div className="text-center p-8 rounded-2xl shadow hover:shadow-xl duration-300">
      <div className="text-blue-700 flex justify-center">{icon}</div>

      <h3 className="text-xl font-bold mt-5">{title}</h3>

      <p className="text-gray-500 mt-3">{text}</p>
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
      <h3 className="text-5xl font-bold text-orange-400">{number}</h3>

      <p className="mt-3 text-lg">{label}</p>
    </div>
  );
}