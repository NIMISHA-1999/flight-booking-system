"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Plane,
  RefreshCw,
} from "lucide-react";

import {
  deleteFlight,
  Flight,
  getAdminFlights,
} from "@/lib/admin.api";

export default function AdminFlightsPage() {
  const [flights, setFlights] =
    useState<Flight[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const loadFlights = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminFlights({
          search,
          page: 1,
          limit: 20,
        });

      setFlights(
        response.flights || [],
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to load flights.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleDelete = async (
    id: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this flight?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFlight(id);

      setFlights((current) =>
        current.filter(
          (flight) =>
            flight.id !== id,
        ),
      );
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Unable to delete flight.",
      );
    }
  };

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Plane />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Flights
              </h1>

              <p className="text-sm text-slate-500">
                Manage flight fares and seat inventory.
              </p>

            </div>

          </div>

        </div>

        <Link
          href="/admin/flights/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          <Plus size={18} />
          Add Flight
        </Link>

      </div>

      {/* Search */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                loadFlights();
              }
            }}
            placeholder="Search flight, airline or route..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />

        </div>

        <button
          onClick={loadFlights}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Search
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Flight
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Route
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Departure
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Fare
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Inventory
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading flights...
                  </td>
                </tr>
              ) : flights.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No flights found.
                  </td>
                </tr>
              ) : (
                flights.map(
                  (flight) => (
                    <tr
                      key={flight.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <p className="font-bold text-slate-900">
                          {
                            flight.flightNumber
                          }
                        </p>

                        <p className="text-xs text-slate-500">
                          {
                            flight.airline
                          }
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <span>
                            {flight.origin}
                          </span>

                          <span className="text-slate-400">
                            →
                          </span>

                          <span>
                            {
                              flight.destination
                            }
                          </span>
                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {new Date(
                            flight.departureAt,
                          ).toLocaleDateString()}
                        </p>

                        <p className="text-xs text-slate-500">
                          {new Date(
                            flight.departureAt,
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <span className="font-bold text-slate-900">
                          $
                          {Number(
                            flight.fare,
                          ).toFixed(2)}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="w-32">

                          <div className="mb-1 flex justify-between text-xs">

                            <span className="font-semibold text-slate-700">
                              {
                                flight.availableSeats
                              }
                            </span>

                            <span className="text-slate-400">
                              /
                              {
                                flight.totalSeats
                              }
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-sky-500"
                              style={{
                                width: `${
                                  flight.totalSeats
                                    ? (flight.availableSeats /
                                        flight.totalSeats) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <Link
                            href={`/admin/flights/${flight.id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-600"
                          >
                            <Pencil
                              size={17}
                            />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(
                                flight.id,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ),
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}