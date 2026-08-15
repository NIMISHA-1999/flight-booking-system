"use client";

import { LogOut, Menu } from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AdminHeaderProps {
  user: UserData | null;
  onMenuClick: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  user,
  onMenuClick,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Mobile Menu */}

        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Left */}

        <div className="hidden flex-1 lg:block">

          <p className="text-sm font-medium text-slate-500">
            Administration
          </p>

          <p className="text-xs text-slate-400">
            Manage your SkyBook platform
          </p>

        </div>

        {/* User */}

        <div className="flex items-center gap-3 sm:gap-4">

          <div className="hidden text-right sm:block">

            <p className="text-sm font-semibold text-slate-800">
              {user
                ? `${user.firstName || ""} ${
                    user.lastName || ""
                  }`.trim()
                : "Administrator"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.email ||
                "Administrator"}
            </p>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">
            {user?.firstName
              ?.charAt(0)
              ?.toUpperCase() ||
              "A"}
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:flex"
          >
            <LogOut size={19} />
          </button>

        </div>

      </div>

    </header>
  );
}