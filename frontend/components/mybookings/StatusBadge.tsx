import {
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export type BookingStatus =
  | "CONFIRMED"
  | "PENDING"
  | "CANCELLED";

interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  if (status === "CONFIRMED") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600">
        <CheckCircle2 size={14} />
        Confirmed
      </div>
    );
  }

  if (status === "CANCELLED") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600">
        <XCircle size={14} />
        Cancelled
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600">
      <Clock size={14} />
      Pending
    </div>
  );
}