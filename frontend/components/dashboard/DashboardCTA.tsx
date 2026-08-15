import Link from "next/link";
import { Plane, ArrowRight } from "lucide-react";

export default function DashboardCTA() {
  return (
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
  );
}