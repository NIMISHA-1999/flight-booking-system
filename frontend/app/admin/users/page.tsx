"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Search,
  Users,
  RefreshCw,
  X,
  Menu,
  Eye,
  ShieldCheck,
  UserRound,
  Mail,
  CalendarDays,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

type UserRole = "USER" | "ADMIN" | string;

interface AdminUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role?: UserRole | null;
  createdAt?: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/*
 * =====================================================
 * API
 * =====================================================
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default function AdminUsersPage() {
  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  // What user is currently typing
  const [search, setSearch] =
    useState<string>("");

  // What search is actually applied to API
  const [appliedSearch, setAppliedSearch] =
    useState<string>("");

  // Selected role in dropdown
  const [role, setRole] =
    useState<string>("");

  const [page, setPage] =
    useState<number>(1);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [error, setError] =
    useState<string>("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState<boolean>(false);

  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  /*
   * =====================================================
   * GET TOKEN
   * =====================================================
   */

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("accessToken");
  };

  /*
   * =====================================================
   * LOAD USERS
   * =====================================================
   */

  const loadUsers = useCallback(
    async (
      requestedPage: number,
      requestedSearch: string,
      requestedRole: string,
    ) => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        const params = new URLSearchParams();

        params.set(
          "page",
          String(requestedPage),
        );

        params.set(
          "limit",
          "10",
        );

        if (requestedSearch.trim()) {
          params.set(
            "search",
            requestedSearch.trim(),
          );
        }

        if (requestedRole.trim()) {
          params.set(
            "role",
            requestedRole.trim().toUpperCase(),
          );
        }

        const url =
          `${API_URL}/admin/users?${params.toString()}`;

        console.log(
          "GET ADMIN USERS:",
          url,
        );

        const response = await fetch(
          url,
          {
            method: "GET",

            headers: {
              Accept:
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },

            cache: "no-store",
          },
        );

        const data =
          await response.json();

        console.log(
          "ADMIN USERS RESPONSE:",
          data,
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load users.",
          );
        }

        setUsers(
          Array.isArray(data?.users)
            ? data.users
            : [],
        );

        setPagination(
          data?.pagination || null,
        );
      } catch (error) {
        console.error(
          "GET ADMIN USERS ERROR:",
          error,
        );

        setUsers([]);
        setPagination(null);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load users.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /*
   * =====================================================
   * INITIAL LOAD
   * =====================================================
   */

  useEffect(() => {
    void loadUsers(
      1,
      "",
      "",
    );
  }, [loadUsers]);

  /*
   * =====================================================
   * SEARCH
   * =====================================================
   */

  const handleSearch = () => {
    const newSearch =
      search.trim();

    // Apply the typed search
    setAppliedSearch(
      newSearch,
    );

    // Always start from page 1
    setPage(1);

    // Immediately load with the NEW search value.
    // Do not wait for React state update.
    void loadUsers(
      1,
      newSearch,
      role,
    );
  };

  /*
   * =====================================================
   * ROLE CHANGE
   * =====================================================
   */

  const handleRoleChange = (
    value: string,
  ) => {
    setRole(value);

    // Role filtering should immediately work.
    setPage(1);

    void loadUsers(
      1,
      appliedSearch,
      value,
    );
  };

  /*
   * =====================================================
   * CLEAR FILTERS
   * =====================================================
   */

  const handleClearFilters = () => {
    setSearch("");
    setAppliedSearch("");
    setRole("");
    setPage(1);

    void loadUsers(
      1,
      "",
      "",
    );
  };

  /*
   * =====================================================
   * REFRESH
   * =====================================================
   */

  const handleRefresh = () => {
    void loadUsers(
      page,
      appliedSearch,
      role,
    );
  };

  /*
   * =====================================================
   * PAGINATION
   * =====================================================
   */

  const handlePrevious = () => {
    if (
      !pagination ||
      pagination.page <= 1 ||
      loading
    ) {
      return;
    }

    const nextPage =
      pagination.page - 1;

    setPage(nextPage);

    void loadUsers(
      nextPage,
      appliedSearch,
      role,
    );
  };

  const handleNext = () => {
    if (
      !pagination ||
      pagination.page >=
        pagination.totalPages ||
      loading
    ) {
      return;
    }

    const nextPage =
      pagination.page + 1;

    setPage(nextPage);

    void loadUsers(
      nextPage,
      appliedSearch,
      role,
    );
  };

  /*
   * =====================================================
   * ENTER KEY
   * =====================================================
   */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */

  const handleLogout = () => {
    localStorage.removeItem(
      "accessToken",
    );

    localStorage.removeItem(
      "refreshToken",
    );

    localStorage.removeItem(
      "user",
    );

    window.location.href =
      "/admin/login";
  };

  /*
   * =====================================================
   * USER NAME
   * =====================================================
   */

  const getUserName = (
    user: AdminUser,
  ) => {
    const firstName =
      user.firstName || "";

    const lastName =
      user.lastName || "";

    return (
      `${firstName} ${lastName}`.trim() ||
      "Unknown User"
    );
  };

  /*
   * =====================================================
   * ROLE CLASS
   * =====================================================
   */

  const getRoleClass = (
    userRole?: string | null,
  ) => {
    switch (
      userRole?.toUpperCase()
    ) {
      case "ADMIN":
        return "bg-purple-50 text-purple-700";

      case "USER":
        return "bg-sky-50 text-sky-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar
        mobileOpen={
          mobileMenuOpen
        }
        onClose={() =>
          setMobileMenuOpen(false)
        }
        onLogout={
          handleLogout
        }
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="lg:ml-64">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              title="Open menu"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden lg:block">

              <p className="text-sm font-medium text-slate-500">
                Administration
              </p>

              <p className="text-xs text-slate-400">
                Manage your SkyBook platform
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-slate-800">
                  Administrator
                </p>

                <p className="text-xs text-slate-500">
                  Manage Users
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">
                A
              </div>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                title="Logout"
                aria-label="Logout"
                className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:flex"
              >
                <span className="text-sm">
                  ↪
                </span>
              </button>

            </div>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Users size={22} />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Users
                </h1>

                <p className="text-sm text-slate-500">
                  View and manage registered SkyBook users.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={
                handleRefresh
              }
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadUsers(
                    page,
                    appliedSearch,
                    role,
                  )
                }
                className="text-sm font-semibold text-red-700 underline"
              >
                Retry
              </button>

            </div>
          )}

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">

              {/* SEARCH */}

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Search by name or email"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-black placeholder:text-slate-400 caret-black outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

              </div>

              {/* ROLE */}

              <select
                value={role}
                onChange={(event) =>
                  handleRoleChange(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >

                <option value="">
                  All Roles
                </option>

                <option value="USER">
                  User
                </option>

                <option value="ADMIN">
                  Admin
                </option>

              </select>

              {/* BUTTONS */}

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={
                    handleSearch
                  }
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <Search size={17} />

                  Search

                </button>

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  title="Clear filters"
                  aria-label="Clear filters"
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-red-500"
                >
                  <X size={18} />
                </button>

              </div>

            </div>

          </div>

          {/* =================================================
              RESULTS COUNT
          ================================================= */}

          <div className="mb-3">

            <p className="text-sm text-slate-500">

              {pagination
                ? `Showing ${users.length} of ${pagination.total} users`
                : `${users.length} users`}

              {appliedSearch && (
                <span className="ml-2 text-sky-600">
                  for "{appliedSearch}"
                </span>
              )}

            </p>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Registered
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-5 py-16 text-center"
                      >

                        <RefreshCw
                          size={24}
                          className="mx-auto animate-spin text-sky-500"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                          Loading users...
                        </p>

                      </td>

                    </tr>

                  ) : users.length === 0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-5 py-16 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                            <Users size={24} />

                          </div>

                          <p className="mt-4 font-semibold text-slate-700">
                            No users found
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Try changing your search or filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    users.map(
                      (user) => (

                        <tr
                          key={user.id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* USER */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 font-bold text-sky-600">

                                {getUserName(
                                  user,
                                )
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {getUserName(
                                    user,
                                  )}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  ID: {user.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* EMAIL */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <Mail
                                size={16}
                                className="text-slate-400"
                              />

                              <span className="text-sm text-slate-700">
                                {user.email}
                              </span>

                            </div>

                          </td>

                          {/* ROLE */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                                user.role,
                              )}`}
                            >
                              {formatRole(
                                user.role,
                              )}
                            </span>

                          </td>

                          {/* CREATED */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-600">

                              <CalendarDays
                                size={16}
                                className="text-slate-400"
                              />

                              {formatDate(
                                user.createdAt,
                              )}

                            </div>

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedUser(
                                    user,
                                  )
                                }
                                title="View user"
                                aria-label="View user"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-600"
                              >
                                <Eye size={18} />
                              </button>

                            </div>

                          </td>

                        </tr>

                      ),
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {pagination &&
              pagination.totalPages > 1 && (

                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-slate-500">

                    Page{" "}

                    <span className="font-semibold text-slate-700">
                      {pagination.page}
                    </span>

                    {" "}of{" "}

                    <span className="font-semibold text-slate-700">
                      {pagination.totalPages}
                    </span>

                    <span className="ml-2 text-slate-400">
                      ({pagination.total} total)
                    </span>

                  </p>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      disabled={
                        pagination.page <= 1 ||
                        loading
                      }
                      onClick={
                        handlePrevious
                      }
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={
                        pagination.page >=
                          pagination.totalPages ||
                        loading
                      }
                      onClick={
                        handleNext
                      }
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>

                  </div>

                </div>

              )}

          </div>

        </main>

      </div>

      {/* =====================================================
          USER DETAILS MODAL
      ===================================================== */}

      {selectedUser && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedUser(null);
            }
          }}
        >

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                  <UserRound size={21} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    User Details
                  </h2>

                  <p className="text-sm text-slate-500">
                    Account information
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                title="Close"
                aria-label="Close"
              >
                <X size={19} />
              </button>

            </div>

            <div className="space-y-5 px-6 py-6">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {getUserName(
                    selectedUser,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </p>

                <div className="mt-2">

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                      selectedUser.role,
                    )}`}
                  >

                    {selectedUser.role?.toUpperCase() ===
                    "ADMIN" ? (
                      <ShieldCheck size={14} />
                    ) : (
                      <UserRound size={14} />
                    )}

                    {formatRole(
                      selectedUser.role,
                    )}

                  </span>

                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  User ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                  {selectedUser.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Registered
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDateTime(
                    selectedUser.createdAt,
                  )}
                </p>
              </div>

            </div>

            <div className="border-t border-slate-100 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="w-full rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/*
 * =====================================================
 * FORMAT ROLE
 * =====================================================
 */

function formatRole(
  role?: string | null,
): string {
  if (!role) {
    return "Unknown";
  }

  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}

/*
 * =====================================================
 * FORMAT DATE
 * =====================================================
 */

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

/*
 * =====================================================
 * FORMAT DATE + TIME
 * =====================================================
 */

function formatDateTime(
  value?: string | null,
): string {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}