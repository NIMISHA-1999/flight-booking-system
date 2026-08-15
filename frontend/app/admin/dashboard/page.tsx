
"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  DollarSign,
  TrendingDown,
  Plane,
  RefreshCw,
  LogOut,
  LayoutDashboard,
  Ticket,
  Users,
  Menu,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  getDashboardStats,
  DashboardStats,
} from "@/lib/admin.api";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /*
   * =====================================================
   * LOAD DASHBOARD
   * =====================================================
   */

  const loadDashboard = async (
    showRefresh = false,
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getDashboardStats();

      setStats(data);
    } catch (error: any) {
      console.error(
        "DASHBOARD ERROR:",
        error,
      );

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        localStorage.removeItem(
          "accessToken",
        );

        localStorage.removeItem(
          "refreshToken",
        );

        localStorage.removeItem("user");

        router.replace(
          "/admin/login",
        );

        return;
      }

      setError(
        error?.response?.data?.message ||
          "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
   * =====================================================
   * INITIAL LOAD
   * =====================================================
   */

  useEffect(() => {
    loadDashboard();
  }, []);

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

    localStorage.removeItem("user");

    router.replace(
      "/admin/login",
    );
  };

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onClose={() =>
            setMobileMenuOpen(false)
          }
          onLogout={handleLogout}
        />

        <div className="lg:ml-64">

          <AdminHeader
            onLogout={handleLogout}
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="px-4 py-6 sm:px-6 lg:px-8">

            <div className="animate-pulse">

              <div className="mb-8">
                <div className="h-8 w-56 rounded-lg bg-slate-200" />
                <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 rounded-2xl bg-white shadow-sm"
                  />
                ))}

              </div>

            </div>

          </main>

        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * ERROR
   * =====================================================
   */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">

        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onClose={() =>
            setMobileMenuOpen(false)
          }
          onLogout={handleLogout}
        />

        <div className="lg:ml-64">

          <AdminHeader
            onLogout={handleLogout}
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="px-4 py-6 sm:px-6 lg:px-8">

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <XCircle size={22} />
                </div>

                <div className="flex-1">

                  <h2 className="font-semibold text-red-800">
                    Unable to load dashboard
                  </h2>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>

                  <button
                    onClick={() =>
                      loadDashboard()
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <RefreshCw size={16} />
                    Try Again
                  </button>

                </div>

              </div>

            </div>

          </main>

        </div>

      </div>
    );
  }

  if (!stats) {
    return null;
  }

  /*
   * =====================================================
   * DASHBOARD
   * =====================================================
   */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() =>
          setMobileMenuOpen(false)
        }
        onLogout={handleLogout}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="lg:ml-64">

        {/* HEADER */}

        <AdminHeader
          onLogout={handleLogout}
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        {/* MAIN */}

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                  <Plane size={22} />
                </div>

                <div>

                  <h1 className="text-2xl font-bold text-slate-900">
                    Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Overview of your SkyBook
                    flight booking platform.
                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={() =>
                loadDashboard(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Bookings Today"
              value={stats.bookingsToday}
              icon={
                <CalendarDays size={22} />
              }
              description="Bookings made today"
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={
                <Plane size={22} />
              }
              description="All bookings"
              iconClass="bg-sky-50 text-sky-600"
            />

            <StatCard
              title="Pending Bookings"
              value={stats.pendingBookings}
              icon={
                <Clock3 size={22} />
              }
              description="Awaiting confirmation"
              iconClass="bg-amber-50 text-amber-600"
            />

            <StatCard
              title="Confirmed Bookings"
              value={stats.confirmedBookings}
              icon={
                <CheckCircle2 size={22} />
              }
              description="Successfully confirmed"
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Cancelled Bookings"
              value={stats.cancelledBookings}
              icon={
                <XCircle size={22} />
              }
              description="Cancelled bookings"
              iconClass="bg-red-50 text-red-600"
            />

            <StatCard
              title="Revenue"
              value={`$${Number(
                stats.revenue || 0,
              ).toFixed(2)}`}
              icon={
                <DollarSign size={22} />
              }
              description="Total booking revenue"
              iconClass="bg-green-50 text-green-600"
            />

            <StatCard
              title="Cancellation Rate"
              value={`${Number(
                stats.cancellationRate || 0,
              ).toFixed(1)}%`}
              icon={
                <TrendingDown size={22} />
              }
              description="Booking cancellation rate"
              iconClass="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Active Bookings"
              value={
                stats.totalBookings -
                stats.cancelledBookings
              }
              icon={
                <CheckCircle2 size={22} />
              }
              description="Non-cancelled bookings"
              iconClass="bg-violet-50 text-violet-600"
            />

          </div>

          {/* =================================================
              BOOKING OVERVIEW
          ================================================= */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Booking Status */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="text-lg font-bold text-slate-900">
                  Booking Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current booking status distribution.
                </p>

              </div>

              <BookingProgress
                label="Confirmed"
                value={
                  stats.confirmedBookings
                }
                total={
                  stats.totalBookings
                }
                percentage={getPercentage(
                  stats.confirmedBookings,
                  stats.totalBookings,
                )}
                className="bg-emerald-500"
              />

              <BookingProgress
                label="Pending"
                value={
                  stats.pendingBookings
                }
                total={
                  stats.totalBookings
                }
                percentage={getPercentage(
                  stats.pendingBookings,
                  stats.totalBookings,
                )}
                className="bg-amber-500"
              />

              <BookingProgress
                label="Cancelled"
                value={
                  stats.cancelledBookings
                }
                total={
                  stats.totalBookings
                }
                percentage={getPercentage(
                  stats.cancelledBookings,
                  stats.totalBookings,
                )}
                className="bg-red-500"
              />

            </div>

            {/* Revenue */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="text-lg font-bold text-slate-900">
                  Revenue Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current platform revenue overview.
                </p>

              </div>

              <div className="rounded-2xl bg-slate-900 p-6 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-400">
                      Total Revenue
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      $
                      {Number(
                        stats.revenue || 0,
                      ).toFixed(2)}
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500">
                    <DollarSign size={24} />
                  </div>

                </div>

                <div className="mt-6 border-t border-slate-700 pt-5">

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-400">
                      Total bookings
                    </span>

                    <span className="font-semibold">
                      {stats.totalBookings}
                    </span>

                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">

                    <span className="text-slate-400">
                      Cancellation rate
                    </span>

                    <span className="font-semibold">
                      {Number(
                        stats.cancellationRate || 0,
                      ).toFixed(1)}
                      %
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

/*
 * =====================================================
 * ADMIN SIDEBAR
 * =====================================================
 */


/*
 * =====================================================
 * ADMIN HEADER
 * =====================================================
 */

function AdminHeader({
  onLogout,
  onMenuClick,
}: {
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      try {

        setUser(
          JSON.parse(storedUser),
        );

      } catch {

        setUser(null);

      }

    }

  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Mobile menu */}

        <button
          onClick={onMenuClick}
          className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Left side */}

        <div className="flex flex-1 items-center">

          <div className="hidden lg:block">

            <p className="text-sm font-medium text-slate-500">
              Administration
            </p>

            <p className="text-xs text-slate-400">
              Manage your SkyBook platform
            </p>

          </div>

        </div>

        {/* User */}

        <div className="flex items-center gap-3 sm:gap-4">

          <div className="hidden text-right sm:block">

            <p className="text-sm font-semibold text-slate-800">
              {user
                ? `${user.firstName || ""} ${
                    user.lastName || ""
                  }`.trim()
                : "Administrator"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.email ||
                "Administrator"}
            </p>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">
            {user?.firstName
              ?.charAt(0)
              ?.toUpperCase() || "A"}
          </div>

          <button
            onClick={onLogout}
            title="Logout"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:flex"
          >
            <LogOut size={19} />
          </button>

        </div>

      </div>

    </header>
  );
}

/*
 * =====================================================
 * STAT CARD
 * =====================================================
 */

function StatCard({
  title,
  value,
  icon,
  description,
  iconClass,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-4 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

/*
 * =====================================================
 * BOOKING PROGRESS
 * =====================================================
 */

function BookingProgress({
  label,
  value,
  total,
  percentage,
  className,
}: {
  label: string;
  value: number;
  total: number;
  percentage: number;
  className: string;
}) {
  return (
    <div className="mb-5 last:mb-0">

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>

        <div className="text-sm">

          <span className="font-semibold text-slate-900">
            {value}
          </span>

          <span className="ml-1 text-slate-400">
            ({percentage}%)
          </span>

        </div>

      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

        <div
          className={`h-full rounded-full transition-all duration-500 ${className}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-1 text-xs text-slate-400">
        {value} of {total} bookings
      </p>

    </div>
  );
}

/*
 * =====================================================
 * PERCENTAGE
 * =====================================================
 */

function getPercentage(
  value: number,
  total: number,
) {
  if (!total || total <= 0) {
    return 0;
  }

  return Math.round(
    (value / total) * 100,
  );
}
