import Link from "next/link";
import {
  Plane,
  Ticket,
  Users,
  ArrowRight,
} from "lucide-react";

export default function QuickActions() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      <div className="grid gap-6 md:grid-cols-3">

        <ActionCard
          href="/flights"
          icon={<Plane size={28} />}
          title="Search Flights"
          description="Find available flights and choose the best fare."
          label="Search now"
          iconClass="bg-blue-100 text-blue-700"
        />

        <ActionCard
          href="/booking"
          icon={<Ticket size={28} />}
          title="My Bookings"
          description="View, manage and cancel your existing bookings."
          label="View bookings"
          iconClass="bg-orange-100 text-orange-600"
        />

        <ActionCard
          href="/profile"
          icon={<Users size={28} />}
          title="My Profile"
          description="Manage your account information."
          label="View profile"
          iconClass="bg-sky-100 text-sky-600"
        />

      </div>

    </section>
  );
}

interface ActionCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  label: string;
  iconClass: string;
}

function ActionCard({
  href,
  icon,
  title,
  description,
  label,
  iconClass,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 font-semibold text-blue-600">
        {label}

        <ArrowRight
          size={18}
          className="transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}