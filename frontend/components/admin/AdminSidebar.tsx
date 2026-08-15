"use client";

import {
  LayoutDashboard,
  Plane,
  Ticket,
  Users,
  LogOut,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Flights",
    icon: Plane,
    path: "/admin/flights",
  },
  {
    label: "Bookings",
    icon: Ticket,
    path: "/admin/bookings",
  },
  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
];

export default function AdminSidebar({
  mobileOpen,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-slate-200
          bg-white
          shadow-xl
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-lg font-extrabold text-white shadow-lg shadow-sky-500/20">
              S
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                SkyBook
              </h1>

              <p className="text-xs text-slate-500">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Mobile close */}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            MENU
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Management
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.path ||
                pathname.startsWith(`${item.path}/`);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`
                    group flex w-full items-center gap-3
                    rounded-xl px-3 py-3
                    text-left text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-sky-50 text-sky-600 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <Icon
                    size={19}
                    className={`
                      transition-colors
                      ${
                        isActive
                          ? "text-sky-500"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    `}
                  />

                  <span>{item.label}</span>

                  {/* Active indicator */}

                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-sky-500" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            USER / LOGOUT
        ================================================= */}

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

