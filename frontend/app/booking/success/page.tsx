"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Home,
  Plane,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
              <Plane size={20} />
            </div>

            <span className="text-2xl font-bold text-slate-900">
              SkyBook
            </span>
          </Link>

          {/* SECURE */}

          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <ShieldCheck
              size={18}
              className="text-blue-600"
            />

            <span className="hidden sm:block">
              Secure Booking
            </span>
          </div>

        </div>
      </header>

      {/* CONTENT */}

      <section className="px-6 py-12 lg:py-20">

        <div className="mx-auto max-w-3xl">

          {/* SUCCESS CARD */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

            {/* TOP */}

            <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-10 text-center text-white sm:px-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur">

                <CheckCircle2
                  size={46}
                  strokeWidth={2.5}
                />

              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                Payment Complete
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Your payment was successful
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Thank you for booking with SkyBook.
                Your payment has been received successfully.
              </p>

            </div>

            {/* BODY */}

            <div className="p-6 sm:p-10">

              {/* BOOKING CONFIRMATION */}

              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <TicketCheck size={22} />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-green-800">
                      Payment received
                    </p>

                    <p className="mt-1 text-sm leading-6 text-green-700">
                      Your booking is being confirmed.
                      You can use your booking reference
                      to view your reservation.
                    </p>

                  </div>

                </div>

              </div>

              {/* BOOKING ID */}

              {bookingId && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <TicketCheck size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Booking Reference
                      </p>

                      <p className="mt-1 break-all text-lg font-black tracking-wide text-slate-900">
                        {bookingId}
                      </p>
                    </div>

                  </div>

                </div>
              )}

              {/* NEXT STEPS */}

              <div className="mt-6">

                <h2 className="text-lg font-bold text-slate-900">
                  What happens next?
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">

                  {/* STEP 1 */}

                  <div className="rounded-2xl border border-slate-200 p-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <CheckCircle2 size={19} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-900">
                      Payment received
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your Stripe payment has been successfully processed.
                    </p>

                  </div>

                  {/* STEP 2 */}

                  <div className="rounded-2xl border border-slate-200 p-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <CalendarDays size={19} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-900">
                      Booking confirmation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your booking will be confirmed after payment verification.
                    </p>

                  </div>

                  {/* STEP 3 */}

                  <div className="rounded-2xl border border-slate-200 p-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      <Plane size={19} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-900">
                      Ready to fly
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Keep your booking reference for your trip.
                    </p>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/dashboard"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Home size={17} />
                  Back to Home
                </Link>

                <Link
                  href="/flights"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  View More Flights
                  <ArrowRight size={17} />
                </Link>

              </div>

              {/* FOOTER */}

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">

                <ShieldCheck size={14} />

                <span>
                  Your payment was securely processed by Stripe
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}