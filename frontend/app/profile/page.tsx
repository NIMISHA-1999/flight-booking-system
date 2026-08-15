"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  ShieldCheck,
  Plane,
  ArrowRight,
  Pencil,
  CalendarDays,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Traveler";

  const initial =
    user?.firstName?.charAt(0).toUpperCase() || "T";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <Navbar user={user} />

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        className="relative overflow-hidden bg-cover bg-center px-6 pb-24 pt-32 text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600')",
        }}
      >
        {/* Dark overlay */}

        <div className="absolute inset-0 bg-black/60" />

        {/* Orange glow */}

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        {/* Decorative plane */}

        <Plane
          size={300}
          strokeWidth={1}
          className="absolute right-8 top-16 hidden rotate-[-15deg] text-white/10 lg:block"
        />

        {/* Content */}

        <div className="relative mx-auto max-w-7xl">
          {/* Label */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
            <User
              size={16}
              className="text-orange-400"
            />

            <span>Account</span>
          </div>

          {/* Heading */}

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            My{" "}
            <span className="text-orange-400">
              Profile
            </span>
          </h1>

          {/* Description */}

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            Manage your personal information and keep your
            SkyBook account details up to date.
          </p>

          {/* Profile status */}

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              {initial}
            </div>

            <span>
              Welcome back,{" "}
              <span className="font-bold">
                {user?.firstName || "Traveler"}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* PROFILE CONTENT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* ================================================= */}
          {/* PROFILE CARD */}
          {/* ================================================= */}

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            {/* Avatar */}

            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-orange-500 text-4xl font-black text-white shadow-xl shadow-orange-500/20">
                {initial}
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user?.email || "No email available"}
              </p>

              {/* Role */}

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-orange-600">
                <ShieldCheck size={14} />
                {user?.role || "Traveler"}
              </div>
            </div>

            {/* Divider */}

            <div className="my-7 border-t border-slate-100" />

            {/* Quick links */}

            <div className="space-y-3">
              <Link
                href="/bookings"
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
              >
                <span className="flex items-center gap-3">
                  <Plane size={17} />
                  My Bookings
                </span>

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/flights"
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
              >
                <span className="flex items-center gap-3">
                  <CalendarDays size={17} />
                  Book a Flight
                </span>

                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* ================================================= */}
          {/* DETAILS */}
          {/* ================================================= */}

          <div className="space-y-6">
            {/* Personal Information */}

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] md:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                    Account Information
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    Personal Information
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Your basic account information.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-500"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              </div>

              {/* Fields */}

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <ProfileField
                  icon={<User size={18} />}
                  label="First Name"
                  value={user?.firstName || "Not available"}
                />

                <ProfileField
                  icon={<User size={18} />}
                  label="Last Name"
                  value={user?.lastName || "Not available"}
                />

                <ProfileField
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={user?.email || "Not available"}
                />

                <ProfileField
                  icon={<ShieldCheck size={18} />}
                  label="Account Role"
                  value={user?.role || "Traveler"}
                />
              </div>
            </div>

            {/* Account Security */}

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Account Security
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Keep your account secure by using a strong
                    password and protecting your login details.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Password
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Your password is securely protected.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-500"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Booking CTA */}

            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-7 text-white shadow-[0_15px_50px_rgba(15,23,42,0.12)] md:p-8">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2 text-orange-400">
                    <Plane size={18} />

                    <span className="text-xs font-bold uppercase tracking-widest">
                      Ready to travel?
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-black">
                    Plan your next journey
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                    Search available flights and find the best
                    option for your next adventure.
                  </p>
                </div>

                <Link
                  href="/flights"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Search Flights
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <Footer />
    </main>
  );
}

/* ================================================= */
/* PROFILE FIELD */
/* ================================================= */

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}