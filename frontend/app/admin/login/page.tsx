"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password,
        },
      );

      console.log(
        "SKYBOOK ADMIN LOGIN RESPONSE:",
        response.data,
      );

      const data = response.data?.data;

      if (!data) {
        throw new Error(
          "Invalid login response.",
        );
      }

      /*
       * Only ADMIN users can access
       * the SkyBook admin panel.
       */

      if (data.user?.role !== "ADMIN") {
        setError(
          "Access denied. This account does not have administrator privileges.",
        );

        return;
      }

      if (!data.accessToken) {
        throw new Error(
          "Access token was not returned.",
        );
      }

      /*
       * Save authentication
       */

      localStorage.setItem(
        "accessToken",
        data.accessToken,
      );

      if (data.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          data.refreshToken,
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user),
      );

      console.log(
        "SKYBOOK ADMIN AUTHENTICATED",
      );

      /*
       * Redirect to admin dashboard
       */

      router.replace("/admin/dashboard");
    } catch (error: any) {
      console.error(
        "SKYBOOK ADMIN LOGIN ERROR:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">

        {/* =====================================================
            LEFT PANEL
        ===================================================== */}

        <div className="hidden w-1/2 bg-[#07111f] lg:flex">
          <div className="flex w-full flex-col justify-between p-12 text-white">

            <div>

              {/* Logo */}

              <div className="mb-12 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-lg font-extrabold shadow-lg shadow-sky-500/20">
                  S
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    SkyBook
                  </h1>

                  <p className="text-sm text-slate-400">
                    Administration Portal
                  </p>
                </div>

              </div>

              {/* Heading */}

              <h2 className="max-w-xl text-5xl font-bold leading-tight">
                Manage your
                <span className="text-sky-400">
                  {" "}flight bookings.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Manage flights, fares, inventory,
                bookings, passengers, payments
                and cancellations from your
                SkyBook administration dashboard.
              </p>

              {/* Features */}

              <div className="mt-10 space-y-4">

                <Feature
                  title="Flight Management"
                  description="Manage routes, fares and seat inventory."
                />

                <Feature
                  title="Booking Management"
                  description="View and manage all customer bookings."
                />

                <Feature
                  title="Payments & Refunds"
                  description="Track payments and process refunds."
                />

              </div>

            </div>

            {/* Footer */}

            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} SkyBook.
              All rights reserved.
            </div>

          </div>
        </div>

        {/* =====================================================
            RIGHT PANEL
        ===================================================== */}

        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 text-center lg:hidden">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500 text-xl font-extrabold text-white shadow-lg">
                S
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                SkyBook
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Administration Portal
              </p>

            </div>

            {/* Login Card */}

            <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">

              {/* Header */}

              <div className="mb-8">

                <div className="mb-3 inline-flex rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-600">
                  Admin Portal
                </div>

                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in to manage your
                  SkyBook platform.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

                  <div className="flex items-start gap-3">

                    <span className="mt-0.5 text-red-500">
                      ⚠
                    </span>

                    <p className="text-sm font-medium leading-5 text-red-700">
                      {error}
                    </p>

                  </div>

                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="admin@skybook.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>

                  </div>

                  <div className="relative">

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value,
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous,
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>

                {/* Login Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-sky-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <span className="flex items-center justify-center gap-2">

                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Signing in...

                    </span>
                  ) : (
                    "Sign In to SkyBook"
                  )}

                </button>

              </form>

              {/* Security */}

              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                    🔒
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-gray-700">
                      Secure administrator access
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      This portal is restricted
                      to accounts with the{" "}
                      <strong>ADMIN</strong>{" "}
                      role.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Bottom text */}

            <p className="mt-6 text-center text-xs text-gray-400">
              SkyBook Administration Portal
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

/*
 * =====================================================
 * FEATURE COMPONENT
 * =====================================================
 */

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
        ✓
      </div>

      <div>

        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}