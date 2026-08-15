import Link from "next/link";
import { Plane } from "lucide-react";

export default function NoFlights() {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow">

      <Plane
        size={50}
        className="mx-auto text-slate-300"
      />

      <h2 className="mt-5 text-2xl font-bold text-slate-800">
        No flights found
      </h2>

      <p className="mt-2 text-slate-500">
        Try different search criteria.
      </p>

      {/* <Link
        href="/flights"
        className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        View All Flights
      </Link> */}

    </div>
  );
}