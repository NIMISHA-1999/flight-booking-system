import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
} from "lucide-react";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "PAYMENT_FAILED"
  | "REFUNDED";

interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  switch (status) {
    case "CONFIRMED":
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600">
          <CheckCircle2 size={14} />
          Confirmed
        </div>
      );

    case "CANCELLED":
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600">
          <XCircle size={14} />
          Cancelled
        </div>
      );

    case "PAYMENT_FAILED":
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600">
          <CreditCard size={14} />
          Payment Failed
        </div>
      );

    case "REFUNDED":
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">
          <CreditCard size={14} />
          Refunded
        </div>
      );

    default:
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600">
          <Clock size={14} />
          Pending
        </div>
      );
  }
}