"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Search,
  Ticket,
  Eye,
  RefreshCw,
  X,
  Menu,
  CircleX,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  RotateCcw,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  AdminBooking,
  cancelAdminBooking,
  getAdminBookings,
} from "@/lib/admin.api";

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default function AdminBookingsPage() {
  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  const [bookings, setBookings] = useState<
    AdminBooking[]
  >([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [status, setStatus] =
    useState<string>("");

  const [date, setDate] =
    useState<string>("");

  const [origin, setOrigin] =
    useState<string>("");

  const [destination, setDestination] =
    useState<string>("");

  const [page, setPage] =
    useState<number>(1);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [error, setError] =
    useState<string>("");

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState<boolean>(false);

  /*
   * =====================================================
   * VIEW STATE
   * =====================================================
   */

  const [
    viewModalBooking,
    setViewModalBooking,
  ] = useState<AdminBooking | null>(null);

  /*
   * =====================================================
   * CANCEL STATE
   * =====================================================
   */

  const [
    cancellingBookingId,
    setCancellingBookingId,
  ] = useState<string | null>(null);

  const [
    cancelModalBooking,
    setCancelModalBooking,
  ] = useState<AdminBooking | null>(null);

  /*
   * =====================================================
   * LOAD BOOKINGS
   * =====================================================
   */

  const loadBookings = useCallback(
    async (requestedPage: number = page) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminBookings({
            page: requestedPage,
            limit: 10,

            status:
              status || undefined,

            date:
              date || undefined,

            origin:
              origin.trim() || undefined,

            destination:
              destination.trim() ||
              undefined,
          });

        setBookings(
          response?.bookings || [],
        );

        setPagination(
          response?.pagination || null,
        );
      } catch (error: any) {
        console.error(
          "GET ADMIN BOOKINGS ERROR:",
          error,
        );

        setError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to load bookings.",
        );

        setBookings([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      status,
      date,
      origin,
      destination,
    ],
  );

  /*
   * =====================================================
   * INITIAL LOAD / PAGE CHANGE
   * =====================================================
   */

  useEffect(() => {
    void loadBookings(page);
  }, [page, loadBookings]);

  /*
   * =====================================================
   * SEARCH
   * =====================================================
   */

  const handleSearch = async () => {
    setSuccessMessage("");
    setError("");

    if (page === 1) {
      await loadBookings(1);
    } else {
      setPage(1);
    }
  };

  /*
   * =====================================================
   * CLEAR FILTERS
   * =====================================================
   */

  const handleClearFilters =
    async () => {
      setStatus("");
      setDate("");
      setOrigin("");
      setDestination("");

      setSuccessMessage("");
      setError("");

      if (page !== 1) {
        setPage(1);
        return;
      }

      try {
        setLoading(true);

        const response =
          await getAdminBookings({
            page: 1,
            limit: 10,
          });

        setBookings(
          response?.bookings || [],
        );

        setPagination(
          response?.pagination ||
            null,
        );
      } catch (error: any) {
        console.error(
          "CLEAR FILTER ERROR:",
          error,
        );

        setError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to load bookings.",
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * =====================================================
   * REFRESH
   * =====================================================
   */

  const handleRefresh = async () => {
    setSuccessMessage("");
    setError("");

    await loadBookings(page);
  };

  /*
   * =====================================================
   * ENTER KEY
   * =====================================================
   */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      void handleSearch();
    }
  };

  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */

  const handleLogout = () => {
    localStorage.removeItem(
      "accessToken",
    );

    localStorage.removeItem(
      "refreshToken",
    );

    localStorage.removeItem(
      "user",
    );

    window.location.href =
      "/admin/login";
  };

  /*
   * =====================================================
   * OPEN VIEW MODAL
   * =====================================================
   */

  const handleOpenViewModal = (
    booking: AdminBooking,
  ) => {
    setError("");
    setSuccessMessage("");
    setViewModalBooking(booking);
  };

  /*
   * =====================================================
   * CLOSE VIEW MODAL
   * =====================================================
   */

  const handleCloseViewModal = () => {
    setViewModalBooking(null);
  };

  /*
   * =====================================================
   * OPEN CANCEL MODAL
   * =====================================================
   */

  const handleOpenCancelModal = (
    booking: AdminBooking,
  ) => {
    if (
      booking.status ===
      "CANCELLED"
    ) {
      return;
    }

    setError("");
    setSuccessMessage("");

    setCancelModalBooking(
      booking,
    );
  };

  /*
   * =====================================================
   * CLOSE CANCEL MODAL
   * =====================================================
   */

  const handleCloseCancelModal =
    () => {
      if (
        cancellingBookingId !==
        null
      ) {
        return;
      }

      setCancelModalBooking(
        null,
      );
    };

  /*
   * =====================================================
   * CONFIRM CANCEL BOOKING
   * =====================================================
   */

  const handleCancelBooking =
    async () => {
      if (
        !cancelModalBooking
      ) {
        return;
      }

      const booking =
        cancelModalBooking;

      try {
        setCancellingBookingId(
          booking.id,
        );

        setError("");
        setSuccessMessage("");

        const response =
          await cancelAdminBooking(
            booking.id,
          );

        setCancelModalBooking(
          null,
        );

        setSuccessMessage(
          response?.message ||
            "Booking cancelled successfully.",
        );

        await loadBookings(
          page,
        );
      } catch (error: any) {
        console.error(
          "CANCEL ADMIN BOOKING ERROR:",
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to cancel booking.";

        setError(message);
      } finally {
        setCancellingBookingId(
          null,
        );
      }
    };

  /*
   * =====================================================
   * CUSTOMER NAME
   * =====================================================
   */

  const getCustomerName = (
    booking: AdminBooking,
  ): string => {
    const firstName =
      booking.user?.firstName ||
      "";

    const lastName =
      booking.user?.lastName ||
      "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return fullName || "Unknown";
  };

  /*
   * =====================================================
   * PAYMENT HELPERS
   * =====================================================
   */

  const getPaymentStatus =
    (
      booking: AdminBooking,
    ): string => {
      return (
        booking.payment
          ?.status || "NO PAYMENT"
      );
    };

  const hasSuccessfulPayment =
    (
      booking: AdminBooking,
    ): boolean => {
      return (
        booking.payment
          ?.status === "SUCCEEDED"
      );
    };

  const hasRefundedPayment =
    (
      booking: AdminBooking,
    ): boolean => {
      return (
        booking.payment
          ?.status ===
          "REFUNDED" ||
        booking.payment
          ?.refundedAt != null
      );
    };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar
        mobileOpen={
          mobileMenuOpen
        }
        onClose={() =>
          setMobileMenuOpen(
            false,
          )
        }
        onLogout={
          handleLogout
        }
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="lg:ml-64">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  true,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              title="Open menu"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* HEADER LEFT */}

            <div className="hidden lg:block">

              <p className="text-sm font-medium text-slate-500">
                Administration
              </p>

              <p className="text-xs text-slate-400">
                Manage your SkyBook platform
              </p>

            </div>

            {/* HEADER RIGHT */}

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-slate-800">
                  Administrator
                </p>

                <p className="text-xs text-slate-500">
                  Manage Bookings
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">
                A
              </div>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                title="Logout"
                aria-label="Logout"
                className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:flex"
              >
                <span className="text-sm">
                  ↪
                </span>
              </button>

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Ticket size={22} />
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

            {/* REFRESH */}

            <button
              type="button"
              onClick={
                handleRefresh
              }
              disabled={loading}
              title="Refresh bookings"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

          {/* SUCCESS */}

          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

              <CheckCircle2
                size={20}
                className="shrink-0 text-emerald-600"
              />

              <p className="text-sm font-medium text-emerald-700">
                {successMessage}
              </p>

            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

              <div className="flex items-center gap-3">

                <AlertTriangle
                  size={20}
                  className="shrink-0 text-red-600"
                />

                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  void loadBookings(
                    page,
                  )
                }
                className="text-sm font-semibold text-red-700 underline"
              >
                Retry
              </button>

            </div>
          )}

          {/* FILTERS */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

              <select
                value={status}
                onChange={(
                  event,
                ) => {
                  setStatus(
                    event.target
                      .value,
                  );
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
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

                <option value="PAYMENT_FAILED">
                  Payment Failed
                </option>

                <option value="REFUNDED">
                  Refunded
                </option>

                <option value="FAILED">
                  Failed
                </option>

              </select>

              <input
                type="date"
                value={date}
                onChange={(
                  event,
                ) =>
                  setDate(
                    event.target
                      .value,
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              <input
                type="text"
                value={origin}
                onChange={(
                  event,
                ) =>
                  setOrigin(
                    event.target
                      .value,
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Origin"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black placeholder:text-slate-400 caret-black outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              <input
                type="text"
                value={destination}
                onChange={(
                  event,
                ) =>
                  setDestination(
                    event.target
                      .value,
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Destination"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black placeholder:text-slate-400 caret-black outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={
                    handleSearch
                  }
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={17} />
                  Filter
                </button>

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  title="Clear filters"
                  aria-label="Clear filters"
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-red-500"
                >
                  <X size={18} />
                </button>

              </div>

            </div>

          </div>

          {/* RESULTS COUNT */}

          <div className="mb-3">

            <p className="text-sm text-slate-500">

              {pagination
                ? `Showing ${bookings.length} of ${pagination.total} bookings`
                : `${bookings.length} bookings`}

            </p>

          </div>

          {/* BOOKINGS TABLE */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1400px]">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Booking
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Flight
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >

                        <RefreshCw
                          size={24}
                          className="mx-auto animate-spin text-sky-500"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                          Loading bookings...
                        </p>

                      </td>

                    </tr>

                  ) : bookings.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Ticket size={24} />
                          </div>

                          <p className="mt-4 font-semibold text-slate-700">
                            No bookings found
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Try changing your filters.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    bookings.map(
                      (booking) => (

                        <tr
                          key={
                            booking.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          {/* BOOKING */}

                          <td className="px-5 py-4">

                            <p className="font-bold text-slate-900">
                              {
                                booking.bookingReference
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(
                                booking.createdAt,
                              )}
                            </p>

                          </td>

                          {/* CUSTOMER */}

                          <td className="px-5 py-4">

                            <p className="font-medium text-slate-800">
                              {getCustomerName(
                                booking,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                booking.user
                                  ?.email ||
                                "-"
                              }
                            </p>

                          </td>

                          {/* FLIGHT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <span className="font-semibold text-slate-800">
                                {
                                  booking
                                    .flight
                                    .flightNumber
                                }
                              </span>

                              <span className="text-xs text-slate-400">
                                {
                                  booking
                                    .flight
                                    .airline
                                }
                              </span>

                            </div>

                            <p className="mt-1 text-xs text-slate-500">

                              {
                                booking
                                  .flight
                                  .origin
                              }

                              {" → "}

                              {
                                booking
                                  .flight
                                  .destination
                              }

                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDateTime(
                                booking
                                  .flight
                                  .departureAt,
                              )}
                            </p>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-5 py-4">

                            <p className="font-bold text-slate-900">
                              {formatCurrency(
                                booking.totalAmount,
                                booking.payment
                                  ?.currency,
                              )}
                            </p>

                          </td>

                          {/* PAYMENT */}

                          <td className="px-5 py-4">

                            <PaymentBadge
                              status={getPaymentStatus(
                                booking,
                              )}
                            />

                            {booking
                              .payment
                              ?.paidAt && (

                              <p className="mt-1 text-xs text-slate-400">

                                Paid{" "}

                                {formatDate(
                                  booking
                                    .payment
                                    .paidAt,
                                )}

                              </p>

                            )}

                            {booking
                              .payment
                              ?.refundedAt && (

                              <p className="mt-1 text-xs text-purple-500">

                                Refunded{" "}

                                {formatDate(
                                  booking
                                    .payment
                                    .refundedAt,
                                )}

                              </p>

                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <StatusBadge
                              status={
                                booking.status
                              }
                            />

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              {/* VIEW */}

                              <button
                                type="button"
                                title="View booking details"
                                aria-label="View booking details"
                                onClick={() =>
                                  handleOpenViewModal(
                                    booking,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-600"
                              >
                                <Eye
                                  size={18}
                                />
                              </button>

                              {/* CANCEL */}

                              {booking.status !==
                                "CANCELLED" &&
                                !hasRefundedPayment(
                                  booking,
                                ) && (

                                  <button
                                    type="button"
                                    title="Cancel booking"
                                    aria-label="Cancel booking"
                                    disabled={
                                      cancellingBookingId ===
                                      booking.id
                                    }
                                    onClick={() =>
                                      handleOpenCancelModal(
                                        booking,
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                  >

                                    {cancellingBookingId ===
                                    booking.id ? (
                                      <RefreshCw
                                        size={18}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <CircleX
                                        size={18}
                                      />
                                    )}

                                  </button>

                                )}

                            </div>

                          </td>

                        </tr>

                      ),
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}

            {pagination &&
              pagination.totalPages >
                1 && (

                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-slate-500">

                    Page{" "}

                    <span className="font-semibold text-slate-700">
                      {
                        pagination.page
                      }
                    </span>

                    {" "}of{" "}

                    <span className="font-semibold text-slate-700">
                      {
                        pagination.totalPages
                      }
                    </span>

                    <span className="ml-2 text-slate-400">
                      (
                      {
                        pagination.total
                      }{" "}
                      total)
                    </span>

                  </p>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      disabled={
                        pagination.page <=
                          1 ||
                        loading
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.max(
                              1,
                              current - 1,
                            ),
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={
                        pagination.page >=
                          pagination.totalPages ||
                        loading
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.min(
                              pagination.totalPages,
                              current + 1,
                            ),
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>

                  </div>

                </div>

              )}

          </div>

        </main>

      </div>

      {/* =====================================================
          VIEW BOOKING MODAL
      ===================================================== */}

      {viewModalBooking && (

        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseViewModal();
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                  <Eye size={22} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Booking Details
                  </h2>

                  <p className="text-sm text-slate-500">
                    {
                      viewModalBooking.bookingReference
                    }
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  handleCloseViewModal
                }
                title="Close"
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* CONTENT */}

            <div className="space-y-5 px-6 py-6">

              {/* BOOKING */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="mb-4 flex items-center justify-between">

                  <h3 className="text-sm font-bold text-slate-800">
                    Booking Information
                  </h3>

                  <StatusBadge
                    status={
                      viewModalBooking.status
                    }
                  />

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <div>
                    <p className="text-xs text-slate-400">
                      Booking Reference
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {
                        viewModalBooking.bookingReference
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateTime(
                        viewModalBooking.createdAt,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatCurrency(
                        viewModalBooking.totalAmount,
                        viewModalBooking.payment
                          ?.currency,
                      )}
                    </p>
                  </div>

                </div>

              </div>

              {/* CUSTOMER */}

              <div className="rounded-xl border border-slate-200 bg-white p-5">

                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  Customer Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-400">
                      Customer Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {getCustomerName(
                        viewModalBooking,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                      {
                        viewModalBooking.user
                          ?.email || "-"
                      }
                    </p>
                  </div>

                </div>

              </div>

              {/* FLIGHT */}

              <div className="rounded-xl border border-slate-200 bg-white p-5">

                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  Flight Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <div>
                    <p className="text-xs text-slate-400">
                      Flight Number
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {
                        viewModalBooking
                          .flight
                          .flightNumber
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Airline
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {
                        viewModalBooking
                          .flight
                          .airline
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Route
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {
                        viewModalBooking
                          .flight
                          .origin
                      }
                      {" → "}
                      {
                        viewModalBooking
                          .flight
                          .destination
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Departure
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateTime(
                        viewModalBooking
                          .flight
                          .departureAt,
                      )}
                    </p>
                  </div>

                  {"arrivalAt" in
                    viewModalBooking.flight &&
                    viewModalBooking
                      .flight
                      .arrivalAt && (

                      <div>
                        <p className="text-xs text-slate-400">
                          Arrival
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatDateTime(
                            (
                              viewModalBooking
                                .flight as typeof viewModalBooking.flight & {
                                arrivalAt?: string;
                              }
                            ).arrivalAt,
                          )}
                        </p>
                      </div>

                    )}

                </div>

              </div>

              {/* PAYMENT */}

              <div className="rounded-xl border border-slate-200 bg-white p-5">

                <div className="mb-4 flex items-center gap-2">

                  <CreditCard
                    size={18}
                    className="text-sky-500"
                  />

                  <h3 className="text-sm font-bold text-slate-800">
                    Payment Information
                  </h3>

                </div>

                {viewModalBooking.payment ? (

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <p className="text-xs text-slate-400">
                        Payment Status
                      </p>

                      <div className="mt-1">
                        <PaymentBadge
                          status={
                            viewModalBooking
                              .payment
                              .status
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Payment Amount
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {formatCurrency(
                          viewModalBooking
                            .payment
                            .amount,
                          viewModalBooking
                            .payment
                            .currency,
                        )}
                      </p>
                    </div>

                    {viewModalBooking
                      .payment
                      .paidAt && (

                      <div>
                        <p className="text-xs text-slate-400">
                          Paid At
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatDateTime(
                            viewModalBooking
                              .payment
                              .paidAt,
                          )}
                        </p>
                      </div>

                    )}

                    {viewModalBooking
                      .payment
                      .refundedAt && (

                      <div>
                        <p className="text-xs text-slate-400">
                          Refunded At
                        </p>

                        <p className="mt-1 text-sm font-semibold text-purple-600">
                          {formatDateTime(
                            viewModalBooking
                              .payment
                              .refundedAt,
                          )}
                        </p>
                      </div>

                    )}

                    {viewModalBooking
                      .payment
                      .stripePaymentIntentId && (

                      <div className="sm:col-span-2">

                        <p className="text-xs text-slate-400">
                          Stripe Payment Intent
                        </p>

                        <p className="mt-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">
                          {
                            viewModalBooking
                              .payment
                              .stripePaymentIntentId
                          }
                        </p>

                      </div>

                    )}

                  </div>

                ) : (

                  <p className="text-sm text-slate-500">
                    No payment record was
                    found for this booking.
                  </p>

                )}

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={
                  handleCloseViewModal
                }
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          CANCEL CONFIRMATION MODAL
      ===================================================== */}

      {cancelModalBooking && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseCancelModal();
            }
          }}
        >

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">

                <CircleX size={22} />

              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Cancel Booking
                </h2>

                <p className="text-sm text-slate-500">
                  Please confirm this action.
                </p>

              </div>

            </div>

            {/* CONTENT */}

            <div className="px-6 py-5">

              <p className="text-sm leading-6 text-slate-600">

                Are you sure you want to cancel booking{" "}

                <span className="font-bold text-slate-900">
                  {
                    cancelModalBooking.bookingReference
                  }
                </span>
                ?

              </p>

              {/* SUMMARY */}

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="grid grid-cols-2 gap-4 text-sm">

                  <div>
                    <p className="text-xs text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {getCustomerName(
                        cancelModalBooking,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Flight
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        cancelModalBooking
                          .flight
                          .flightNumber
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Route
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        cancelModalBooking
                          .flight
                          .origin
                      }
                      {" → "}
                      {
                        cancelModalBooking
                          .flight
                          .destination
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Amount
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatCurrency(
                        cancelModalBooking.totalAmount,
                        cancelModalBooking
                          .payment
                          ?.currency,
                      )}
                    </p>
                  </div>

                </div>

              </div>

              {/* PAYMENT INFORMATION */}

              {cancelModalBooking.payment ? (

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

                  <div className="mb-3 flex items-center gap-2">

                    <CreditCard
                      size={18}
                      className="text-sky-500"
                    />

                    <p className="text-sm font-semibold text-slate-800">
                      Payment Information
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-slate-400">
                        Payment Status
                      </p>

                      <div className="mt-1">

                        <PaymentBadge
                          status={
                            cancelModalBooking
                              .payment
                              .status
                          }
                        />

                      </div>

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Payment Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatCurrency(
                          cancelModalBooking
                            .payment
                            .amount,
                          cancelModalBooking
                            .payment
                            .currency,
                        )}
                      </p>

                    </div>

                    {cancelModalBooking
                      .payment
                      .stripePaymentIntentId && (

                      <div className="col-span-2">

                        <p className="text-xs text-slate-400">
                          Stripe Payment Intent
                        </p>

                        <p className="mt-1 break-all font-mono text-xs text-slate-600">
                          {
                            cancelModalBooking
                              .payment
                              .stripePaymentIntentId
                          }
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              ) : (

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs leading-5 text-slate-600">
                    No payment record was found
                    for this booking.
                  </p>

                </div>

              )}

              {/* REFUND WARNING */}

              {hasSuccessfulPayment(
                cancelModalBooking,
              ) && (

                <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>

                    <p className="text-sm font-semibold text-amber-800">
                      Stripe refund required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      This booking has a successful
                      Stripe payment. Cancelling the
                      booking will attempt to refund the
                      successful payment and release the
                      reserved flight seats.
                    </p>

                  </div>

                </div>

              )}

              {/* NON-SUCCESSFUL PAYMENT */}

              {cancelModalBooking.payment &&
                !hasSuccessfulPayment(
                  cancelModalBooking,
                ) &&
                !hasRefundedPayment(
                  cancelModalBooking,
                ) && (

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-xs leading-5 text-slate-600">
                      The payment is not marked as
                      successful. The booking will be
                      cancelled and the reserved flight
                      seats will be released.
                    </p>

                  </div>

                )}

            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={
                  cancellingBookingId !==
                  null
                }
                onClick={
                  handleCloseCancelModal
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={
                  cancellingBookingId !==
                  null
                }
                onClick={
                  handleCancelBooking
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {cancellingBookingId ? (

                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />

                    Cancelling...
                  </>

                ) : (

                  <>
                    {hasSuccessfulPayment(
                      cancelModalBooking,
                    ) ? (
                      <RotateCcw
                        size={17}
                      />
                    ) : (
                      <CircleX
                        size={17}
                      />
                    )}

                    {hasSuccessfulPayment(
                      cancelModalBooking,
                    )
                      ? "Cancel & Refund"
                      : "Cancel Booking"}

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/*
 * =====================================================
 * STATUS BADGE
 * =====================================================
 */

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

    PAYMENT_FAILED:
      "bg-slate-100 text-slate-600",

    REFUNDED:
      "bg-purple-50 text-purple-700",

    FAILED:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

/*
 * =====================================================
 * PAYMENT BADGE
 * =====================================================
 */

function PaymentBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    SUCCEEDED:
      "bg-emerald-50 text-emerald-700",

    PENDING:
      "bg-amber-50 text-amber-700",

    FAILED:
      "bg-red-50 text-red-700",

    REFUNDED:
      "bg-purple-50 text-purple-700",

    PARTIALLY_REFUNDED:
      "bg-purple-50 text-purple-700",

    "NO PAYMENT":
      "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

/*
 * =====================================================
 * FORMAT STATUS
 * =====================================================
 */

function formatStatus(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

/*
 * =====================================================
 * FORMAT DATE
 * =====================================================
 */

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

/*
 * =====================================================
 * FORMAT DATE + TIME
 * =====================================================
 */

function formatDateTime(
  value?: string | null,
): string {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

/*
 * =====================================================
 * FORMAT CURRENCY
 * =====================================================
 */

function formatCurrency(
  amount?: number | string | null,
  currency?: string | null,
): string {
  const numericAmount =
    Number(amount || 0);

  const normalizedCurrency =
    (
      currency || "USD"
    ).toUpperCase();

  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency:
          normalizedCurrency,
      },
    ).format(
      numericAmount,
    );
  } catch {
    return `${normalizedCurrency} ${numericAmount.toFixed(
      2,
    )}`;
  }
}
