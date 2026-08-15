"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Search,
  Ticket,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  AdminBooking,
  getAdminBookings,
} from "@/lib/admin.api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] =
    useState<AdminBooking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState("");

  const [date, setDate] =
    useState("");

  const [origin, setOrigin] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState<any>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response =
        await getAdminBookings({
          page,
          limit: 10,
          status: status || undefined,
          date: date || undefined,
          origin:
            origin || undefined,
          destination:
            destination || undefined,
        });

      setBookings(
        response.bookings || [],
      );

      setPagination(
        response.pagination,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [page]);

  const search = () => {
    setPage(1);
    loadBookings();
  };

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Ticket />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Bookings
            </h1>

            <p className="text-sm text-slate-500">
              View and manage all customer bookings.
            </p>

          </div>

        </div>

        <button
          onClick={loadBookings}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Filters */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
          >
            <option value="">
              All Statuses
            </option>
            <option value="PENDING">
              Pending
            </option>
            <option value="CONFIRMED">
              Confirmed
            </option>
            <option value="CANCELLED">
              Cancelled
            </option>
            <option value="FAILED">
              Failed
            </option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />

          <input
            value={origin}
            onChange={(e) =>
              setOrigin(e.target.value)
            }
            placeholder="Origin"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />

          <input
            value={destination}
            onChange={(e) =>
              setDestination(e.target.value)
            }
            placeholder="Destination"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />

          <button
            onClick={search}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >
            <Search size={17} />
            Filter
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Booking
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Flight
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Action
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
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map(
                  (booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <p className="font-bold text-slate-900">
                          {
                            booking.bookingReference
                          }
                        </p>

                        <p className="text-xs text-slate-500">
                          {new Date(
                            booking.createdAt,
                          ).toLocaleDateString()}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <p className="font-medium text-slate-800">
                          {booking.user
                            ? `${booking.user.firstName} ${booking.user.lastName}`
                            : "Unknown"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {
                            booking.user
                              ?.email
                          }
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <p className="font-semibold text-slate-800">
                          {
                            booking.flight
                              .flightNumber
                          }
                        </p>

                        <p className="text-xs text-slate-500">
                          {
                            booking.flight
                              .origin
                          }{" "}
                          →{" "}
                          {
                            booking.flight
                              .destination
                          }
                        </p>

                      </td>

                      <td className="px-5 py-4 font-bold text-slate-900">
                        $
                        {Number(
                          booking.totalAmount,
                        ).toFixed(2)}
                      </td>

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={
                            booking.status
                          }
                        />

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end">

                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-600"
                          >
                            <Eye
                              size={18}
                            />
                          </Link>

                        </div>

                      </td>

                    </tr>
                  ),
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        {pagination &&
          pagination.totalPages >
            1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

              <p className="text-sm text-slate-500">
                Page {pagination.page}{" "}
                of{" "}
                {
                  pagination.totalPages
                }
              </p>

              <div className="flex gap-2">

                <button
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(
                      (current) =>
                        current - 1,
                    )
                  }
                  className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  disabled={
                    page >=
                    pagination.totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1,
                    )
                  }
                  className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            </div>
          )}

      </div>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    CONFIRMED:
      "bg-emerald-50 text-emerald-700",
    PENDING:
      "bg-amber-50 text-amber-700",
    CANCELLED:
      "bg-red-50 text-red-700",
    FAILED:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}