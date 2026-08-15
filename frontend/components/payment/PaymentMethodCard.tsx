"use client";

import {
  CheckCircle2,
  CreditCard,
  Lock,
} from "lucide-react";

interface Props {
  loading?: boolean;
  onPay: () => void;
}

export default function PaymentMethodCard({
  loading = false,
  onPay,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-7 py-7 text-white">
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <CreditCard size={24} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
              Payment
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Choose your payment method
            </h2>
          </div>

        </div>
      </div>

      <div className="p-7">

        {/* Card payment */}

        <div className="rounded-2xl border-2 border-blue-600 bg-blue-50/50 p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
              <CreditCard size={22} />
            </div>

            <div className="flex-1">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-bold text-slate-900">
                    Card Payment
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Credit or debit card
                  </p>
                </div>

                <CheckCircle2
                  size={22}
                  className="text-blue-700"
                />

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {[
                  "VISA",
                  "Mastercard",
                  "AMEX",
                ].map((card) => (
                  <span
                    key={card}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
                  >
                    {card}
                  </span>
                ))}

              </div>

            </div>

          </div>
        </div>

        {/* Security */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex gap-3">

            <Lock
              size={20}
              className="mt-0.5 shrink-0 text-blue-700"
            />

            <div>

              <p className="text-sm font-bold text-blue-800">
                Secure payment
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-600">
                Your payment information is encrypted
                and securely processed by Stripe.
              </p>

            </div>

          </div>

        </div>

        {/* Button */}

        <button
          type="button"
          disabled={loading}
          onClick={onPay}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Redirecting..."
            : "Proceed to Secure Payment"}

          {!loading && (
            <span>→</span>
          )}
        </button>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock size={14} />
          Protected by Stripe secure payment
        </div>

      </div>
    </div>
  );
}