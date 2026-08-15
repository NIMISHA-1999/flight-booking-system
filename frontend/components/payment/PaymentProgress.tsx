import {
  CheckCircle2,
} from "lucide-react";

export default function PaymentProgress() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center">

        {/* Flight */}
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white">
            <CheckCircle2 size={18} />
          </div>

          <span className="ml-2 hidden text-sm font-bold text-slate-700 sm:block">
            Flight
          </span>
        </div>

        <div className="mx-3 h-px w-12 bg-blue-600 sm:w-24" />

        {/* Passengers */}
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white">
            <CheckCircle2 size={18} />
          </div>

          <span className="ml-2 hidden text-sm font-bold text-slate-700 sm:block">
            Passengers
          </span>
        </div>

        <div className="mx-3 h-px w-12 bg-blue-600 sm:w-24" />

        {/* Payment */}
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-500/20">
            3
          </div>

          <span className="ml-2 hidden text-sm font-bold text-orange-600 sm:block">
            Payment
          </span>
        </div>

      </div>
    </div>
  );
}