import React from "react";

interface BookingInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

export default function BookingInfo({
  icon,
  label,
  value,
  highlight = false,
}: BookingInfoProps) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 text-sm font-bold ${
            highlight
              ? "text-orange-500"
              : "text-slate-800"
          }`}
        >
          {value}
        </p>
      </div>

    </div>
  );
}