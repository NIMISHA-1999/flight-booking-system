// "use client";

// import Link from "next/link";
// import { useParams, useSearchParams } from "next/navigation";

// import {
//   ArrowLeft,
//   ArrowRight,
//   CalendarDays,
//   CheckCircle2,
//   CreditCard,
//   Lock,
//   Plane,
//   ShieldCheck,
//   WalletCards,
// } from "lucide-react";

// export default function PaymentPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();

//   const flightId = params.flightId as string;
//   const bookingId = searchParams.get("bookingId");

//   console.log("FLIGHT ID:", flightId);
//   console.log("BOOKING ID:", bookingId);

//   return (
//     <main className="min-h-screen bg-slate-50">
//       {/* ================================================= */}
//       {/* HEADER */}
//       {/* ================================================= */}

//       <header className="border-b border-slate-200 bg-white">
//         <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
//           {/* BACK */}
//           <Link
//             href={`/booking/${flightId}/passengers`}
//             className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
//           >
//             <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition group-hover:border-blue-200 group-hover:bg-blue-50">
//               <ArrowLeft size={18} />
//             </span>

//             <span className="hidden sm:block">
//               Back to Passengers
//             </span>
//           </Link>

//           {/* LOGO */}
//           <Link href="/" className="flex items-center gap-2">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
//               <Plane size={20} />
//             </div>

//             <span className="text-2xl font-bold text-slate-900">
//               SkyBook
//             </span>
//           </Link>

//           {/* SECURE */}
//           <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
//             <ShieldCheck
//               size={18}
//               className="text-blue-600"
//             />

//             <span className="hidden sm:block">
//               Secure Payment
//             </span>
//           </div>
//         </div>
//       </header>

//       {/* ================================================= */}
//       {/* CONTENT */}
//       {/* ================================================= */}

//       <section className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
//         {/* ================================================= */}
//         {/* PROGRESS */}
//         {/* ================================================= */}

//         <div className="mb-12">
//           <div className="flex items-center justify-center">
//             {/* STEP 1 */}
//             <div className="flex items-center">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white">
//                 <CheckCircle2 size={18} />
//               </div>

//               <span className="ml-2 hidden text-sm font-bold text-slate-700 sm:block">
//                 Flight
//               </span>
//             </div>

//             <div className="mx-3 h-px w-12 bg-blue-600 sm:w-24" />

//             {/* STEP 2 */}
//             <div className="flex items-center">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white">
//                 <CheckCircle2 size={18} />
//               </div>

//               <span className="ml-2 hidden text-sm font-bold text-slate-700 sm:block">
//                 Passengers
//               </span>
//             </div>

//             <div className="mx-3 h-px w-12 bg-blue-600 sm:w-24" />

//             {/* STEP 3 */}
//             <div className="flex items-center">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-500/20">
//                 3
//               </div>

//               <span className="ml-2 hidden text-sm font-bold text-orange-600 sm:block">
//                 Payment
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ================================================= */}
//         {/* HEADING */}
//         {/* ================================================= */}

//         <div className="mb-10 text-center">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600">
//             <CreditCard size={14} />

//             Secure Checkout
//           </div>

//           <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
//             Complete your payment
//           </h1>

//           <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-500">
//             Your booking is reserved. Complete the payment securely
//             to confirm your flight.
//           </p>
//         </div>

//         {/* ================================================= */}
//         {/* MAIN GRID */}
//         {/* ================================================= */}

//         <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
//           {/* ================================================= */}
//           {/* PAYMENT CARD */}
//           {/* ================================================= */}

//           <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
//             {/* CARD HEADER */}

//             <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-7 py-7 text-white">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
//                   <WalletCards size={24} />
//                 </div>

//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
//                     Payment
//                   </p>

//                   <h2 className="mt-1 text-2xl font-bold">
//                     Choose your payment method
//                   </h2>
//                 </div>
//               </div>
//             </div>

//             <div className="p-7">
//               {/* STRIPE */}

//               <div className="rounded-2xl border-2 border-blue-600 bg-blue-50/50 p-5">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
//                     <CreditCard size={22} />
//                   </div>

//                   <div className="flex-1">
//                     <div className="flex items-center justify-between gap-3">
//                       <div>
//                         <h3 className="font-bold text-slate-900">
//                           Card Payment
//                         </h3>

//                         <p className="mt-1 text-sm text-slate-500">
//                           Credit or debit card
//                         </p>
//                       </div>

//                       <CheckCircle2
//                         size={22}
//                         className="text-blue-700"
//                       />
//                     </div>

//                     <div className="mt-4 flex flex-wrap gap-2">
//                       <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
//                         VISA
//                       </span>

//                       <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
//                         Mastercard
//                       </span>

//                       <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
//                         AMEX
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* SECURITY */}

//               <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
//                 <div className="flex gap-3">
//                   <Lock
//                     size={20}
//                     className="mt-0.5 shrink-0 text-blue-700"
//                   />

//                   <div>
//                     <p className="text-sm font-bold text-blue-800">
//                       Secure payment
//                     </p>

//                     <p className="mt-1 text-xs leading-5 text-blue-600">
//                       Your payment information is encrypted and
//                       securely processed by Stripe. SkyBook never
//                       stores your card details.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* BOOKING ID */}

//               <div className="mt-6 rounded-2xl bg-slate-50 p-5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-slate-500">
//                     Booking ID
//                   </span>

//                   <span className="max-w-[220px] truncate text-sm font-bold text-slate-800">
//                     {bookingId || "Not available"}
//                   </span>
//                 </div>
//               </div>

//               {/* PAYMENT BUTTON */}

//               <button
//                 type="button"
//                 className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98]"
//               >
//                 Proceed to Secure Payment
//                 <ArrowRight size={18} />
//               </button>

//               {/* FOOTER SECURITY */}

//               <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
//                 <ShieldCheck size={14} />

//                 <span>
//                   Protected by Stripe secure payment
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ================================================= */}
//           {/* BOOKING SUMMARY */}
//           {/* ================================================= */}

//           <aside className="lg:sticky lg:top-8 lg:h-fit">
//             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
//               {/* HEADER */}

//               <div className="bg-slate-900 px-6 py-6 text-white">
//                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
//                   Order Summary
//                 </p>

//                 <h2 className="mt-2 text-2xl font-bold">
//                   Your booking
//                 </h2>
//               </div>

//               <div className="p-6">
//                 {/* FLIGHT */}

//                 <div className="rounded-2xl bg-slate-50 p-5">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
//                       <Plane size={19} />
//                     </div>

//                     <div>
//                       <p className="text-sm font-bold text-slate-900">
//                         SkyBook Flight
//                       </p>

//                       <p className="text-xs text-slate-400">
//                         Flight booking
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mt-5 border-t border-slate-200 pt-5">
//                     <div className="flex items-center gap-2 text-sm text-slate-500">
//                       <CalendarDays size={15} />

//                       <span>
//                         Booking ID
//                       </span>
//                     </div>

//                     <p className="mt-2 break-all text-sm font-bold text-slate-900">
//                       {bookingId || "Not available"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* STATUS */}

//                 <div className="mt-5 flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
//                   <span className="text-sm font-medium text-orange-700">
//                     Booking Status
//                   </span>

//                   <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-700">
//                     Pending Payment
//                   </span>
//                 </div>

//                 {/* TOTAL */}

//                 <div className="my-6 border-t border-dashed border-slate-200" />

//                 <div className="flex items-end justify-between">
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
//                       Amount Due
//                     </p>

//                     <p className="mt-1 text-3xl font-bold text-blue-700">
//                       ₹ —
//                     </p>
//                   </div>

//                   <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
//                     INR
//                   </span>
//                 </div>

//                 <p className="mt-4 text-xs leading-5 text-slate-400">
//                   The final amount will be displayed before you
//                   complete payment.
//                 </p>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </section>
//     </main>
//   );
// }

"use client";

import Link from "next/link";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowLeft,
  CreditCard,
  Plane,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getBookingById,
  type Booking,
} from "@/services/booking.service";

import PaymentProgress from "@/components/payment/PaymentProgress";

import PaymentMethodCard from "@/components/payment/PaymentMethodCard";

import BookingSummary from "@/components/payment/BookingSummary";

export default function PaymentPage() {
  const params = useParams();

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const flightId =
    params.flightId as string;

  const bookingId =
    searchParams.get("bookingId");

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * ==========================================
   * LOAD BOOKING
   * ==========================================
   */

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) {
        setError(
          "Booking ID is missing.",
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        const result =
          await getBookingById(
            bookingId,
          );

        setBooking(result);
      } catch (error) {
        console.error(
          "BOOKING LOAD ERROR:",
          error,
        );

        setError(
          "Unable to load booking details.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  /*
   * ==========================================
   * PAYMENT
   * ==========================================
   */

  const handlePayment = async () => {
    if (!booking) {
      return;
    }

    try {
      setPaymentLoading(true);

      /*
       * Later:
       *
       * const response =
       *   await createCheckoutSession(
       *     booking.id
       *   );
       *
       * window.location.href =
       *   response.url;
       */

      console.log(
        "START PAYMENT:",
        booking.id,
      );

    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error,
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />

          <p className="mt-4 text-sm text-slate-500">
            Loading payment details...
          </p>

        </div>

      </main>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <CreditCard size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Payment unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "Unable to find this booking."}
          </p>

          <Link
            href="/flights"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
          >
            Back to Flights
          </Link>

        </div>

      </main>
    );
  }

  /*
   * ==========================================
   * PAGE
   * ==========================================
   */

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href={`/booking/${flightId}/passengers`}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
          >

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50">

              <ArrowLeft size={18} />

            </span>

            <span className="hidden sm:block">
              Back to Passengers
            </span>

          </Link>

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-2"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md">
              <Plane size={20} />
            </div>

            <span className="text-2xl font-bold text-slate-900">
              SkyBook
            </span>

          </Link>

          {/* SECURITY */}

          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">

            <ShieldCheck
              size={18}
              className="text-blue-600"
            />

            <span className="hidden sm:block">
              Secure Payment
            </span>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">

        <PaymentProgress />

        {/* Heading */}

        <div className="mb-10 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600">

            <CreditCard size={14} />

            Secure Checkout

          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Complete your payment
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-500">
            Your booking has been created.
            Complete the payment securely
            to confirm your flight.
          </p>

        </div>

        {/* GRID */}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* PAYMENT */}

          <PaymentMethodCard
            loading={paymentLoading}
            onPay={handlePayment}
          />

          {/* SUMMARY */}

          <BookingSummary
            booking={booking}
          />

        </div>

      </section>

    </main>
  );
}