"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  ShieldCheck,
  Clock3,
  Globe2,
  Search,
  CalendarDays,
  MapPin,
  Users,
  UserPlus,
  LogIn,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HeroSearch from "@/components/dashboard/HeroSearch";
import QuickActions from "@/components/dashboard/QuickActions";
import PopularDestinations from "@/components/dashboard/PopularDestinations";
import DashboardCTA from "@/components/dashboard/DashboardCTA";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: UserData =
        JSON.parse(storedUser);

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="bg-slate-50">

      <Navbar user={user} />

      <HeroSearch />

      <QuickActions />

      <PopularDestinations />

        {/* ================= FEATURES ================= */}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-4xl font-bold text-slate-900">
            Why Choose SkyBook
          </h2>
          <div className="mt-16 grid gap-10 px-6 md:grid-cols-4">
            <Feature
              icon={<Plane size={42} />}
              title="500+ Airlines"
              text="Compare flights from airlines across the world."
            />

            <Feature
              icon={<ShieldCheck size={42} />}
              title="Secure Payments"
              text="Protected online payments with Stripe."
            />

            <Feature
              icon={<Clock3 size={42} />}
              title="24/7 Support"
              text="Customer support available anytime."
            />

            <Feature
              icon={<Globe2 size={42} />}
              title="Worldwide Flights"
              text="Travel to more than 180 countries."
            />
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 text-center md:grid-cols-4">
          <Stat number="15M+" label="Passengers" />
          <Stat number="180+" label="Countries" />
          <Stat number="500+" label="Airlines" />
          <Stat number="98%" label="Customer Satisfaction" />
        </div>
      </section>

      <DashboardCTA />

      <Footer />

    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl p-8 text-center shadow transition duration-300 hover:shadow-xl">
      <div className="flex justify-center text-blue-700">{icon}</div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-3 text-gray-500">{text}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <h3 className="text-5xl font-bold text-orange-400">{number}</h3>

      <p className="mt-3 text-lg">{label}</p>
    </div>
  );
}
