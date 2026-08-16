"use client";

import Link from "next/link";
import {
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
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

export default function Navbar({
  user,
}: NavbarProps) {
  const router = useRouter();

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );
    } finally {
      localStorage.removeItem(
        "accessToken",
      );

      localStorage.removeItem(
        "refreshToken",
      );

      localStorage.removeItem("user");

      router.replace("/");
    }
  };

  return (
    <nav className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

        {/* =================================================
            LOGO
        ================================================== */}

        <Link
          href="/dashboard"
          className="text-3xl font-bold text-white"
        >
          SkyBook
        </Link>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="hidden items-center gap-8 text-white md:flex">

          {/* HOME - ALWAYS VISIBLE */}

          <Link
            href="/dashboard"
            className="
              font-medium
              transition
              hover:text-orange-400
            "
          >
            Home
          </Link>

          {/* FLIGHTS - ALWAYS VISIBLE */}

          <Link
            href="/flights"
            className="
              font-medium
              transition
              hover:text-orange-400
            "
          >
            Flights
          </Link>

          {user ? (
            <>
              {/* =================================================
                  LOGGED IN
                  ================================================= */}

              {/* MY BOOKINGS */}

              <Link
                href="/booking"
                className="
                  font-medium
                  transition
                  hover:text-orange-400
                "
              >
                My Bookings
              </Link>

              {/* PROFILE */}

              <Link
                href="/profile"
                className="
                  font-medium
                  transition
                  hover:text-orange-400
                "
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              {/* =================================================
                  LOGGED OUT
                  ================================================= */}

              {/* OFFERS */}

              <Link
                href="/offers"
                className="
                  font-medium
                  transition
                  hover:text-orange-400
                "
              >
                Offers
              </Link>

              {/* CONTACT */}

              <Link
                href="/contact"
                className="
                  font-medium
                  transition
                  hover:text-orange-400
                "
              >
                Contact
              </Link>
            </>
          )}
        </div>

        {/* =================================================
            RIGHT SIDE AUTH SECTION
        ================================================== */}

        <div className="flex items-center gap-3">

          {user ? (
            <>
              {/* =================================================
                  LOGGED IN
              ================================================== */}

              {/* WELCOME USER */}

              <div className="hidden text-right text-white sm:block">
                <p className="text-xs text-blue-100">
                  Welcome
                </p>

                <p className="font-semibold">
                  {user.firstName ||
                    "Traveler"}
                </p>
              </div>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/40
                  px-4
                  py-2
                  text-white
                  transition
                  hover:bg-white
                  hover:text-slate-900
                "
              >
                <LogOut size={17} />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              {/* =================================================
                  LOGGED OUT
              ================================================== */}

              {/* LOGIN */}

              <Link
                href="/login"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/40
                  px-4
                  py-2
                  text-white
                  transition
                  hover:bg-white
                  hover:text-slate-900
                "
              >
                <LogIn size={17} />

                <span>
                  Login
                </span>
              </Link>

              {/* REGISTER */}

              <Link
                href="/register"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-orange-500
                  px-4
                  py-2
                  font-medium
                  text-white
                  transition
                  hover:bg-orange-600
                "
              >
                <UserPlus size={17} />

                <span>
                  Register
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}