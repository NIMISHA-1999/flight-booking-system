"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth.service";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface NavbarProps {
  user: UserData | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  };

  return (
    <nav className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

        <Link
          href="/dashboard"
          className="text-3xl font-bold text-white"
        >
          SkyBook
        </Link>

        <div className="hidden items-center gap-8 text-white md:flex">
          <Link
            href="/dashboard"
            className="font-medium hover:text-orange-400"
          >
            Home
          </Link>

          <Link
            href="/flights"
            className="font-medium hover:text-orange-400"
          >
            Flights
          </Link>

          <Link
            href="/mybookings"
            className="font-medium hover:text-orange-400"
          >
            My Bookings
          </Link>

          <Link
            href="/profile"
            className="font-medium hover:text-orange-400"
          >
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right text-white sm:block">
            <p className="text-xs text-blue-100">
              Welcome
            </p>

            <p className="font-semibold">
              {user?.firstName || "Traveler"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-white transition hover:bg-white hover:text-slate-900"
          >
            <LogOut size={17} />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>

      </div>
    </nav>
  );
}