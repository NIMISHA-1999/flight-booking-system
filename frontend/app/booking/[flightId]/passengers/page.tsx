"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";

import { getFlightById, type Flight } from "@/services/flight.service";

import { createBooking, type PassengerData } from "@/services/booking.service";

import PassengerForm, {
  type PassengerFormData,
} from "@/components/booking/PassengerForm";

const createEmptyPassenger = (): PassengerFormData => ({
  fullName: "",
  dateOfBirth: "",
  nationality: "",
  passportNumber: "",
  email: "",
  contactNumber: "",
});

export default function PassengerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const flightId = params.flightId as string;

  /*
   * Number of passengers
   */
  const passengerCount = Math.max(
    1,
    Number(searchParams.get("passengers")) || 1,
  );

  /*
   * Flight
   */
  const [flight, setFlight] = useState<Flight | null>(null);

  const [loading, setLoading] = useState(true);

  /*
   * Passenger data
   */
  const [passengers, setPassengers] = useState<PassengerFormData[]>([]);

  /*
   * Validation errors
   */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /*
   * Submit state
   */
  const [submitting, setSubmitting] = useState(false);

  /*
   * =====================================================
   * LOAD FLIGHT
   * =====================================================
   */

  useEffect(() => {
    async function loadFlight() {
      try {
        setLoading(true);

        const result = await getFlightById(flightId);

        setFlight(result);
      } catch (error) {
        console.error("FLIGHT ERROR:", error);
        setFlight(null);
      } finally {
        setLoading(false);
      }
    }

    if (flightId) {
      loadFlight();
    }
  }, [flightId]);

  /*
   * =====================================================
   * CREATE PASSENGER FORMS
   * =====================================================
   */

  useEffect(() => {
    setPassengers(
      Array.from({ length: passengerCount }, () => createEmptyPassenger()),
    );
  }, [passengerCount]);

  /*
   * =====================================================
   * UPDATE PASSENGER
   * =====================================================
   */

  const updatePassenger = (
    index: number,
    field: keyof PassengerFormData,
    value: string,
  ) => {
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index
          ? {
              ...passenger,
              [field]: field === "passportNumber" ? value.toUpperCase() : value,
            }
          : passenger,
      ),
    );

    /*
     * Remove error when user starts correcting field
     */
    const errorKey = `${index}.${field}`;

    setErrors((current) => {
      const updated = { ...current };

      delete updated[errorKey];

      return updated;
    });
  };

  /*
   * =====================================================
   * VALIDATE PASSENGERS
   * =====================================================
   */

  const validatePassengers = () => {
    const newErrors: Record<string, string> = {};

    passengers.forEach((passenger, index) => {
      /*
       * Full name
       */
      if (!passenger.fullName.trim()) {
        newErrors[`${index}.fullName`] = "Full name is required.";
      }

      /*
       * Date of birth
       */
      if (!passenger.dateOfBirth) {
        newErrors[`${index}.dateOfBirth`] = "Date of birth is required.";
      }

      /*
       * Nationality
       */
      if (!passenger.nationality.trim()) {
        newErrors[`${index}.nationality`] = "Nationality is required.";
      }

      /*
       * Passport
       */
      if (!passenger.passportNumber.trim()) {
        newErrors[`${index}.passportNumber`] = "Passport number is required.";
      }

      /*
       * Email
       */
      if (!passenger.email.trim()) {
        newErrors[`${index}.email`] = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        newErrors[`${index}.email`] = "Enter a valid email address.";
      }

      /*
       * Contact number
       */
      if (!passenger.contactNumber.trim()) {
        newErrors[`${index}.contactNumber`] = "Contact number is required.";
      } else if (!/^[+]?[0-9\s-]{7,15}$/.test(passenger.contactNumber)) {
        newErrors[`${index}.contactNumber`] = "Enter a valid contact number.";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * =====================================================
   * CONTINUE TO PAYMENT
   * =====================================================
   */

  const handleContinue = async () => {
    // Check login first
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      const currentUrl = window.location.pathname + window.location.search;

      localStorage.setItem("redirectAfterLogin", currentUrl);

      setShowLoginModal(true);
      return;
    }

    // Validate passenger details
    if (!validatePassengers()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setSubmitting(true);

      const response = await createBooking({
        flightId,
        passengers,
      });

      console.log("BOOKING CREATED:", response);

      router.push(
        `/booking/${flightId}/payment?bookingId=${response.booking.id}`,
      );
    } catch (error) {
      console.error("BOOKING CREATION ERROR:", error);

      setErrors({
        booking:
          error instanceof Error
            ? error.message
            : "Unable to create booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />

            <p className="mt-4 text-sm text-slate-500">
              Loading booking details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * FLIGHT NOT FOUND
   * =====================================================
   */

  if (!flight) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <Plane size={50} className="mx-auto text-slate-300" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Flight not found
          </h1>

          <p className="mt-2 text-slate-500">
            This flight is no longer available.
          </p>

          <Link
            href="/flights"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
          >
            Back to Flights
          </Link>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * FLIGHT DETAILS
   * =====================================================
   */

  const departure = new Date(flight.departureAt);

  const arrival = new Date(flight.arrivalAt);

  const total = flight.fare * passengerCount;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  /*
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* BACK */}
          <Link
            href={`/booking/${flight.id}`}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition group-hover:border-blue-200 group-hover:bg-blue-50">
              <ArrowLeft size={18} />
            </span>

            <span className="hidden sm:block">Back to Flight</span>
          </Link>

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
              <Plane size={20} />
            </div>

            <span className="text-2xl font-bold text-slate-900">SkyBook</span>
          </Link>

          {/* SECURE */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <ShieldCheck size={18} className="text-blue-600" />

            <span className="hidden sm:block">Secure Booking</span>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        {/* ================================================= */}
        {/* PROGRESS */}
        {/* ================================================= */}

        <div className="mb-10">
          <div className="flex items-center justify-center">
            {/* STEP 1 */}
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white">
                <CheckCircle2 size={18} />
              </div>

              <span className="ml-2 hidden text-sm font-bold text-slate-700 sm:block">
                Flight
              </span>
            </div>

            <div className="mx-3 h-px w-12 bg-blue-600 sm:w-24" />

            {/* STEP 2 */}
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                2
              </div>

              <span className="ml-2 hidden text-sm font-bold text-orange-600 sm:block">
                Passengers
              </span>
            </div>

            <div className="mx-3 h-px w-12 bg-slate-200 sm:w-24" />

            {/* STEP 3 */}
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-400">
                3
              </div>

              <span className="ml-2 hidden text-sm font-semibold text-slate-400 sm:block">
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* HEADING */}
        {/* ================================================= */}

        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600">
            <Users size={14} />
            Passenger Information
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Who is travelling?
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            Enter the details for each passenger exactly as they appear on their
            travel documents.
          </p>
        </div>

        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ================================================= */}
          {/* PASSENGER FORMS */}
          {/* ================================================= */}

          {/* PASSENGER FORMS */}

          <div className="space-y-6">
            {/* BOOKING ERROR */}
            {errors.booking && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-600">
                  {errors.booking}
                </p>
              </div>
            )}

            {/* PASSENGER FORMS */}
            {passengers.map((passenger, index) => (
              <PassengerForm
                key={index}
                index={index}
                value={passenger}
                errors={errors}
                onChange={(field, value) =>
                  updatePassenger(index, field, value)
                }
              />
            ))}

            {/* SECURITY INFO */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck size={20} className="shrink-0 text-blue-700" />

                <div>
                  <p className="text-sm font-bold text-blue-800">
                    Your information is secure
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-600">
                    Passenger information is securely transmitted and used only
                    for your booking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* BOOKING SUMMARY */}
          {/* ================================================= */}

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
              {/* SUMMARY HEADER */}

              <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
                  Booking Summary
                </p>

                <h2 className="mt-2 text-2xl font-bold">Your trip</h2>
              </div>

              <div className="p-6">
                {/* ROUTE */}

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        {flight.origin}
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {formatTime(departure)}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <Plane size={16} className="rotate-90" />
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400">
                        {flight.destination}
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {formatTime(arrival)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <CalendarDays size={14} />

                    {formatDate(departure)}
                  </div>
                </div>

                {/* AIRLINE */}

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Plane size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {flight.airline}
                    </p>

                    <p className="text-xs text-slate-400">
                      Flight {flight.flightNumber}
                    </p>
                  </div>
                </div>

                {/* FARE DETAILS */}

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Fare per passenger</span>

                    <span className="font-bold text-slate-800">
                      ₹{flight.fare.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Passengers</span>

                    <span className="font-bold text-slate-800">
                      × {passengerCount}
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-dashed border-slate-200" />

                {/* TOTAL */}

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Total Fare
                    </p>

                    <p className="mt-1 text-3xl font-bold text-blue-700">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                    INR
                  </span>
                </div>

                {/* CONTINUE */}

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleContinue}
                  className="mt-7 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Processing..." : "Continue to Payment"}

                  {!submitting && <ArrowRight size={18} />}
                </button>

                {/* PAYMENT SECURITY */}

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <CreditCard size={14} />
                  Secure payment with Stripe
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
      {/* ================================================= */}
      {/* LOGIN REQUIRED MODAL */}
      {/* ================================================= */}

      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* TOP */}
            <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-7 text-center text-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur">
                <ShieldCheck size={30} />
              </div>

              <h2 className="mt-4 text-2xl font-bold">Login Required</h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Please sign in to your SkyBook account before continuing to
                payment.
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Your booking is almost ready
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Login is required to securely create your booking and
                      proceed with payment.
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  Login to Continue
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="w-full rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Maybe Later
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  onClick={() => setShowLoginModal(false)}
                  className="font-semibold text-blue-600 hover:text-orange-500"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
