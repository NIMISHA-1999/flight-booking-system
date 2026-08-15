"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Plane,
  RefreshCw,
  Menu,
  X,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  createFlight,
  deleteFlight,
  updateFlight,
  Flight,
  getAdminFlights,
} from "@/lib/admin.api";

/* =====================================================
   TYPES
===================================================== */

interface FlightForm {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  fare: string;
  totalSeats: string;
}

interface AdminUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

interface FlightsResponse {
  flights?: Flight[];
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;

  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/* =====================================================
   INITIAL FORM
===================================================== */

const initialForm: FlightForm = {
  flightNumber: "",
  airline: "",
  origin: "",
  destination: "",
  departureAt: "",
  arrivalAt: "",
  fare: "",
  totalSeats: "",
};

/* =====================================================
   DATE FORMATTER
===================================================== */

function formatDateTimeLocal(
  dateValue: string | Date
) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) =>
    String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

/* =====================================================
   DISPLAY DATE
===================================================== */

function formatDisplayDate(
  dateValue: string | Date
) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =====================================================
   DISPLAY TIME
===================================================== */

function formatDisplayTime(
  dateValue: string | Date
) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =====================================================
   PAGE
===================================================== */

export default function AdminFlightsPage() {
  const router = useRouter();

  /* =====================================================
     FLIGHTS
  ===================================================== */

  const [flights, setFlights] =
    useState<Flight[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =====================================================
     SEARCH
  ===================================================== */

  const [search, setSearch] =
    useState("");

  /* =====================================================
     PAGINATION
  ===================================================== */

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [totalFlights, setTotalFlights] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  /* =====================================================
     ERRORS
  ===================================================== */

  const [error, setError] =
    useState("");

  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* =====================================================
     ADD MODAL
  ===================================================== */

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [form, setForm] =
    useState<FlightForm>(initialForm);

  const [creating, setCreating] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  /* =====================================================
     EDIT MODAL
  ===================================================== */

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [flightToEdit, setFlightToEdit] =
    useState<Flight | null>(null);

  const [editForm, setEditForm] =
    useState<FlightForm>(initialForm);

  const [editing, setEditing] =
    useState(false);

  const [editFormError, setEditFormError] =
    useState("");

  /* =====================================================
     DELETE MODAL
  ===================================================== */

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [flightToDelete, setFlightToDelete] =
    useState<Flight | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  /* =====================================================
     SUCCESS
  ===================================================== */

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =====================================================
     AUTH
  ===================================================== */

  const clearAuthAndRedirect = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.replace("/admin/login");
  };

  /* =====================================================
     LOAD FLIGHTS
  ===================================================== */

  const loadFlights = async (
    requestedPage = 1,
    requestedLimit = limit
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        (await getAdminFlights({
          search: search.trim(),
          page: requestedPage,
          limit: requestedLimit,
        })) as FlightsResponse;

      console.log(
        "ADMIN FLIGHTS RESPONSE:",
        response
      );

      const flightsData =
        Array.isArray(response.flights)
          ? response.flights
          : [];

      const pagination =
        response.pagination;

      const total = Number(
        pagination?.total ??
          response.total ??
          0
      );

      const backendPage = Number(
        pagination?.page ??
          response.page ??
          requestedPage
      );

      const backendLimit = Number(
        pagination?.limit ??
          response.limit ??
          requestedLimit
      );

      const calculatedTotalPages =
        total > 0
          ? Math.ceil(
              total / backendLimit
            )
          : 1;

      const backendTotalPages =
        Number(
          pagination?.totalPages ??
            response.totalPages ??
            calculatedTotalPages
        );

      const safeTotalPages =
        Number.isFinite(
          backendTotalPages
        ) &&
        backendTotalPages > 0
          ? backendTotalPages
          : calculatedTotalPages;

      const safePage = Math.min(
        Math.max(1, backendPage),
        Math.max(1, safeTotalPages)
      );

      setFlights(flightsData);
      setTotalFlights(total);
      setTotalPages(
        Math.max(1, safeTotalPages)
      );
      setPage(safePage);
    } catch (err: any) {
      console.error(
        "ADMIN FLIGHTS ERROR:",
        err
      );

      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        clearAuthAndRedirect();
        return;
      }

      setFlights([]);
      setTotalFlights(0);
      setTotalPages(1);

      setError(
        err?.response?.data?.message ||
          "Unable to load flights."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadFlights(1, limit);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = () => {
    setPage(1);

    loadFlights(
      1,
      Number(limit)
    );
  };

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const handlePageChange = (
    newPage: number
  ) => {
    const safePage = Math.max(
      1,
      Math.min(
        newPage,
        totalPages
      )
    );

    setPage(safePage);

    loadFlights(
      safePage,
      Number(limit)
    );
  };

  /* =====================================================
     LIMIT CHANGE
  ===================================================== */

  const handleLimitChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit =
      Number(event.target.value);

    setLimit(newLimit);
    setPage(1);

    loadFlights(
      1,
      newLimit
    );
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    clearAuthAndRedirect();
  };

  /* =====================================================
     OPEN ADD
  ===================================================== */

  const openAddModal = () => {
    setForm(initialForm);
    setFormError("");
    setShowAddModal(true);
  };

  /* =====================================================
     CLOSE ADD
  ===================================================== */

  const closeAddModal = () => {
    if (creating) return;

    setShowAddModal(false);
    setForm(initialForm);
    setFormError("");
  };

  /* =====================================================
     UPDATE ADD FORM
  ===================================================== */

  const updateForm =
    (field: keyof FlightForm) =>
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setForm((current) => ({
        ...current,
        [field]:
          event.target.value,
      }));

      setFormError("");
    };

  /* =====================================================
     CREATE
  ===================================================== */

  const handleCreateFlight = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");
    setCreating(true);

    try {
      if (
        !form.flightNumber.trim() ||
        !form.airline.trim() ||
        !form.origin.trim() ||
        !form.destination.trim() ||
        !form.departureAt ||
        !form.arrivalAt ||
        !form.fare ||
        !form.totalSeats
      ) {
        setFormError(
          "Please fill in all required fields."
        );
        return;
      }

      const departureDate =
        new Date(
          form.departureAt
        );

      const arrivalDate =
        new Date(
          form.arrivalAt
        );

      if (
        Number.isNaN(
          departureDate.getTime()
        ) ||
        Number.isNaN(
          arrivalDate.getTime()
        )
      ) {
        setFormError(
          "Please enter valid departure and arrival dates."
        );
        return;
      }

      if (
        arrivalDate <=
        departureDate
      ) {
        setFormError(
          "Arrival time must be after departure time."
        );
        return;
      }

      const fare =
        Number(form.fare);

      const totalSeats =
        Number(form.totalSeats);

      if (
        !Number.isFinite(fare) ||
        fare < 0
      ) {
        setFormError(
          "Please enter a valid fare."
        );
        return;
      }

      if (
        !Number.isInteger(
          totalSeats
        ) ||
        totalSeats < 1
      ) {
        setFormError(
          "Total seats must be at least 1."
        );
        return;
      }

      await createFlight({
        flightNumber:
          form.flightNumber.trim(),

        airline:
          form.airline.trim(),

        origin:
          form.origin.trim(),

        destination:
          form.destination.trim(),

        departureAt:
          departureDate.toISOString(),

        arrivalAt:
          arrivalDate.toISOString(),

        fare,

        totalSeats,

        availableSeats:
          totalSeats,
      });

      setShowAddModal(false);
      setForm(initialForm);

      setSuccessMessage(
        "Flight created successfully."
      );

      await loadFlights(
        1,
        Number(limit)
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error(
        "CREATE FLIGHT ERROR:",
        err
      );

      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        clearAuthAndRedirect();
        return;
      }

      setFormError(
        err?.response?.data?.message ||
          "Unable to create flight."
      );
    } finally {
      setCreating(false);
    }
  };

  /* =====================================================
     OPEN EDIT
  ===================================================== */

  const openEditModal = (
    flight: Flight
  ) => {
    setFlightToEdit(flight);

    setEditForm({
      flightNumber:
        flight.flightNumber || "",

      airline:
        flight.airline || "",

      origin:
        flight.origin || "",

      destination:
        flight.destination || "",

      departureAt:
        flight.departureAt
          ? formatDateTimeLocal(
              flight.departureAt
            )
          : "",

      arrivalAt:
        flight.arrivalAt
          ? formatDateTimeLocal(
              flight.arrivalAt
            )
          : "",

      fare:
        flight.fare !== undefined &&
        flight.fare !== null
          ? String(flight.fare)
          : "",

      totalSeats:
        flight.totalSeats !== undefined &&
        flight.totalSeats !== null
          ? String(
              flight.totalSeats
            )
          : "",
    });

    setEditFormError("");
    setShowEditModal(true);
  };

  /* =====================================================
     CLOSE EDIT
  ===================================================== */

  const closeEditModal = () => {
    if (editing) return;

    setShowEditModal(false);
    setFlightToEdit(null);
    setEditForm(initialForm);
    setEditFormError("");
  };

  /* =====================================================
     UPDATE EDIT FORM
  ===================================================== */

  const updateEditForm =
    (field: keyof FlightForm) =>
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setEditForm((current) => ({
        ...current,
        [field]:
          event.target.value,
      }));

      setEditFormError("");
    };

  /* =====================================================
     UPDATE FLIGHT
  ===================================================== */

  const handleUpdateFlight = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !flightToEdit ||
      editing
    ) {
      return;
    }

    setEditFormError("");
    setEditing(true);

    try {
      if (
        !editForm.flightNumber.trim() ||
        !editForm.airline.trim() ||
        !editForm.origin.trim() ||
        !editForm.destination.trim() ||
        !editForm.departureAt ||
        !editForm.arrivalAt ||
        !editForm.fare ||
        !editForm.totalSeats
      ) {
        setEditFormError(
          "Please fill in all required fields."
        );
        return;
      }

      const departureDate =
        new Date(
          editForm.departureAt
        );

      const arrivalDate =
        new Date(
          editForm.arrivalAt
        );

      if (
        Number.isNaN(
          departureDate.getTime()
        ) ||
        Number.isNaN(
          arrivalDate.getTime()
        )
      ) {
        setEditFormError(
          "Please enter valid departure and arrival dates."
        );
        return;
      }

      if (
        arrivalDate <=
        departureDate
      ) {
        setEditFormError(
          "Arrival time must be after departure time."
        );
        return;
      }

      const fare =
        Number(editForm.fare);

      const totalSeats =
        Number(editForm.totalSeats);

      if (
        !Number.isFinite(fare) ||
        fare < 0
      ) {
        setEditFormError(
          "Please enter a valid fare."
        );
        return;
      }

      if (
        !Number.isInteger(
          totalSeats
        ) ||
        totalSeats < 1
      ) {
        setEditFormError(
          "Total seats must be at least 1."
        );
        return;
      }

      const currentTotal =
        Number(
          flightToEdit.totalSeats
        );

      const currentAvailable =
        Number(
          flightToEdit.availableSeats
        );

      const bookedSeats =
        Math.max(
          0,
          currentTotal -
            currentAvailable
        );

      if (
        totalSeats <
        bookedSeats
      ) {
        setEditFormError(
          `Total seats cannot be less than ${bookedSeats}, because ${bookedSeats} seat(s) are already booked.`
        );
        return;
      }

      const newAvailableSeats =
        totalSeats -
        bookedSeats;

      await updateFlight(
        flightToEdit.id,
        {
          flightNumber:
            editForm.flightNumber.trim(),

          airline:
            editForm.airline.trim(),

          origin:
            editForm.origin.trim(),

          destination:
            editForm.destination.trim(),

          departureAt:
            departureDate.toISOString(),

          arrivalAt:
            arrivalDate.toISOString(),

          fare,

          totalSeats,

          availableSeats:
            newAvailableSeats,
        }
      );

      setShowEditModal(false);
      setFlightToEdit(null);
      setEditForm(initialForm);

      setSuccessMessage(
        "Flight updated successfully."
      );

      await loadFlights(
        page,
        Number(limit)
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error(
        "UPDATE FLIGHT ERROR:",
        err
      );

      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        clearAuthAndRedirect();
        return;
      }

      setEditFormError(
        err?.response?.data?.message ||
          "Unable to update flight."
      );
    } finally {
      setEditing(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const openDeleteModal = (
    flight: Flight
  ) => {
    if (deleting) return;

    setFlightToDelete(flight);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setFlightToDelete(null);
  };

  const handleConfirmDelete =
    async () => {
      if (
        !flightToDelete ||
        deleting
      ) {
        return;
      }

      try {
        setDeleting(true);
        setError("");

        await deleteFlight(
          flightToDelete.id
        );

        setShowDeleteModal(false);
        setFlightToDelete(null);

        const targetPage =
          flights.length === 1 &&
          page > 1
            ? page - 1
            : page;

        await loadFlights(
          targetPage,
          Number(limit)
        );

        setSuccessMessage(
          "Flight deleted successfully."
        );

        window.setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err: any) {
        console.error(
          "DELETE FLIGHT ERROR:",
          err
        );

        if (
          err?.response?.status ===
            401 ||
          err?.response?.status === 403
        ) {
          clearAuthAndRedirect();
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Unable to delete flight."
        );
      } finally {
        setDeleting(false);
      }
    };

  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const getPageNumbers = () => {
    const pages: number[] = [];

    const maxVisiblePages = 5;

    let start = Math.max(
      1,
      page -
        Math.floor(
          maxVisiblePages / 2
        )
    );

    const end = Math.min(
      totalPages,
      start +
        maxVisiblePages -
        1
    );

    if (
      end - start + 1 <
      maxVisiblePages
    ) {
      start = Math.max(
        1,
        end -
          maxVisiblePages +
          1
      );
    }

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  const startItem =
    totalFlights === 0
      ? 0
      : (page - 1) *
          limit +
        1;

  const endItem = Math.min(
    page * limit,
    totalFlights
  );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}

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

      {/* MAIN */}

      <div className="lg:ml-64">

        {/* HEADER */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="flex-1">

              <div className="hidden lg:block">

                <p className="text-sm font-medium text-slate-500">
                  Administration
                </p>

                <p className="text-xs text-slate-400">
                  Manage your SkyBook platform
                </p>

              </div>

            </div>

            <AdminUserHeader
              onLogout={
                handleLogout
              }
            />

          </div>

        </header>

        {/* CONTENT */}

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* SUCCESS */}

          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">

              <CheckCircle2
                size={20}
                className="text-green-600"
              />

              <p className="text-sm font-medium text-green-700">
                {successMessage}
              </p>

            </div>
          )}

          {/* TITLE */}

          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Plane size={22} />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Flights
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage flight fares and seat inventory.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={
                openAddModal
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
            >
              <Plus size={18} />
              Add Flight
            </button>

          </div>

          {/* SEARCH */}

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    handleSearch();
                  }
                }}
                placeholder="Search flight, airline or route..."
  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-black placeholder:text-slate-400 caret-black outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            <button
              type="button"
              onClick={
                handleSearch
              }
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
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
                ? "Searching..."
                : "Search"}

            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">

              <div className="flex items-center gap-3">

                <AlertCircle
                  size={19}
                  className="text-red-600"
                />

                <p className="text-sm text-red-700">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  loadFlights(
                    page,
                    limit
                  )
                }
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1150px] table-fixed">

                {/* =================================================
                    CONTROLLED COLUMN WIDTHS

                    This prevents Inventory and Actions from
                    becoming too far apart.
                ================================================= */}

                <colgroup>
                  <col className="w-[17%]" />
                  <col className="w-[18%]" />
                  <col className="w-[16%]" />
                  <col className="w-[16%]" />
                  <col className="w-[12%]" />
                  <col className="w-[13%]" />
                  <col className="w-[8%]" />
                </colgroup>

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Flight
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Route
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Departure
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Arrival
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Fare
                    </th>

                    {/* INVENTORY */}

                    <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Inventory
                    </th>

                    {/* ACTIONS */}

                    <th className="px-2 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >

                        <RefreshCw
                          size={25}
                          className="mx-auto animate-spin text-sky-500"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                          Loading flights...
                        </p>

                      </td>

                    </tr>

                  ) : flights.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Plane size={25} />
                          </div>

                          <h3 className="mt-4 font-semibold text-slate-800">
                            No flights found
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or add a new flight.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    flights.map(
                      (flight) => {

                        const availablePercentage =
                          flight.totalSeats >
                          0
                            ? Math.min(
                                100,
                                Math.max(
                                  0,
                                  (Number(
                                    flight.availableSeats
                                  ) /
                                    Number(
                                      flight.totalSeats
                                    )) *
                                    100
                                )
                              )
                            : 0;

                        return (
                          <tr
                            key={
                              flight.id
                            }
                            className="transition hover:bg-slate-50"
                          >

                            {/* FLIGHT */}

                            <td className="px-4 py-4">

                              <p className="font-bold text-slate-900">
                                {
                                  flight.flightNumber
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  flight.airline
                                }
                              </p>

                            </td>

                            {/* ROUTE */}

                            <td className="px-4 py-4">

                              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                                <span>
                                  {
                                    flight.origin
                                  }
                                </span>

                                <span className="text-slate-400">
                                  →
                                </span>

                                <span>
                                  {
                                    flight.destination
                                  }
                                </span>

                              </div>

                            </td>

                            {/* DEPARTURE */}

                            <td className="px-4 py-4">

                              <p className="text-sm font-semibold text-slate-700">
                                {formatDisplayDate(
                                  flight.departureAt
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {formatDisplayTime(
                                  flight.departureAt
                                )}
                              </p>

                            </td>

                            {/* ARRIVAL */}

                            <td className="px-4 py-4">

                              <p className="text-sm font-semibold text-slate-700">
                                {flight.arrivalAt
                                  ? formatDisplayDate(
                                      flight.arrivalAt
                                    )
                                  : "-"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {flight.arrivalAt
                                  ? formatDisplayTime(
                                      flight.arrivalAt
                                    )
                                  : "-"}
                              </p>

                            </td>

                            {/* FARE */}

                            <td className="px-4 py-4">

                              <span className="font-bold text-slate-900">
                                $
                                {Number(
                                  flight.fare
                                ).toFixed(2)}
                              </span>

                            </td>

                            {/* =================================================
                                INVENTORY
                            ================================================= */}

                            <td className="px-3 py-4">

                              <div className="w-[115px]">

                                <div className="mb-1 flex items-center justify-between text-xs">

                                  <span className="font-semibold text-slate-700">
                                    {
                                      flight.availableSeats
                                    }
                                  </span>

                                  <span className="text-slate-400">
                                    /
                                    {
                                      flight.totalSeats
                                    }
                                  </span>

                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">

                                  <div
                                    className="h-full rounded-full bg-sky-500 transition-all"
                                    style={{
                                      width: `${availablePercentage}%`,
                                    }}
                                  />

                                </div>

                              </div>

                            </td>

                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <td className="px-2 py-4">

                              <div className="flex items-center justify-center gap-1">

                                <button
                                  type="button"
                                  title="Edit flight"
                                  onClick={() =>
                                    openEditModal(
                                      flight
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-600"
                                >
                                  <Pencil
                                    size={17}
                                  />
                                </button>

                                <button
                                  type="button"
                                  title="Delete flight"
                                  onClick={() =>
                                    openDeleteModal(
                                      flight
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2
                                    size={17}
                                  />
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}

            {!loading &&
              totalFlights > 0 && (
                <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <p className="text-sm text-slate-500">

                      Showing{" "}
                      <span className="font-semibold text-slate-700">
                        {startItem}
                      </span>

                      {" "}to{" "}

                      <span className="font-semibold text-slate-700">
                        {endItem}
                      </span>

                      {" "}of{" "}

                      <span className="font-semibold text-slate-700">
                        {totalFlights}
                      </span>

                      {" "}flights

                    </p>

                    <select
                      value={limit}
                      onChange={
                        handleLimitChange
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-600 outline-none focus:border-sky-400"
                    >

                      <option value={10}>
                        10
                      </option>

                      <option value={20}>
                        20
                      </option>

                      <option value={50}>
                        50
                      </option>

                      <option value={100}>
                        100
                      </option>

                    </select>

                  </div>

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      disabled={
                        page <= 1
                      }
                      onClick={() =>
                        handlePageChange(
                          page - 1
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={17}
                      />
                    </button>

                    {getPageNumbers().map(
                      (pageNumber) => (
                        <button
                          key={
                            pageNumber
                          }
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              pageNumber
                            )
                          }
                          className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold ${
                            pageNumber ===
                            page
                              ? "border-sky-500 bg-sky-500 text-white"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {
                            pageNumber
                          }
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      disabled={
                        page >=
                        totalPages
                      }
                      onClick={() =>
                        handlePageChange(
                          page + 1
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight
                        size={17}
                      />
                    </button>

                  </div>

                </div>
              )}

          </div>

        </main>

      </div>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDeleteModal &&
        flightToDelete && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeDeleteModal();
              }
            }}
          >

            <div
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >

              <div className="flex justify-center pt-7">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle
                    size={28}
                    className="text-red-600"
                  />
                </div>

              </div>

              <div className="px-6 pb-6 pt-5 text-center">

                <h2 className="text-xl font-bold text-slate-900">
                  Delete Flight?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete
                  this flight? This action cannot
                  be undone.
                </p>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-bold text-slate-900">
                        {
                          flightToDelete.flightNumber
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          flightToDelete.airline
                        }
                      </p>

                    </div>

                    <Plane
                      size={22}
                      className="text-sky-500"
                    />

                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">

                    <span>
                      {
                        flightToDelete.origin
                      }
                    </span>

                    <span className="text-slate-400">
                      →
                    </span>

                    <span>
                      {
                        flightToDelete.destination
                      }
                    </span>

                  </div>

                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      closeDeleteModal
                    }
                    disabled={
                      deleting
                    }
                    className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleConfirmDelete
                    }
                    disabled={
                      deleting
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 sm:flex-none"
                  >

                    {deleting ? (
                      <>
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2
                          size={17}
                        />
                        Delete Flight
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showEditModal &&
        flightToEdit && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeEditModal();
              }
            }}
          >

            <div
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Pencil size={21} />
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Edit Flight
                    </h2>

                    <p className="text-sm text-slate-500">
                      Update flight details and inventory.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  disabled={
                    editing
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>

              </div>

              <form
                onSubmit={
                  handleUpdateFlight
                }
                className="p-6"
              >

                {editFormError && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                    <AlertCircle
                      size={19}
                      className="mt-0.5 text-red-600"
                    />

                    <p className="text-sm text-red-700">
                      {
                        editFormError
                      }
                    </p>

                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">

                  <FlightInput
                    label="Flight Number"
                    value={
                      editForm.flightNumber
                    }
                    onChange={
                      updateEditForm(
                        "flightNumber"
                      )
                    }
                    placeholder="AI101"
                    required
                  />

                  <FlightInput
                    label="Airline"
                    value={
                      editForm.airline
                    }
                    onChange={
                      updateEditForm(
                        "airline"
                      )
                    }
                    placeholder="Air India"
                    required
                  />

                  <FlightInput
                    label="Origin"
                    value={
                      editForm.origin
                    }
                    onChange={
                      updateEditForm(
                        "origin"
                      )
                    }
                    placeholder="Chennai"
                    required
                  />

                  <FlightInput
                    label="Destination"
                    value={
                      editForm.destination
                    }
                    onChange={
                      updateEditForm(
                        "destination"
                      )
                    }
                    placeholder="Mumbai"
                    required
                  />

                  <FlightInput
                    label="Departure"
                    type="datetime-local"
                    value={
                      editForm.departureAt
                    }
                    onChange={
                      updateEditForm(
                        "departureAt"
                      )
                    }
                    required
                  />

                  <FlightInput
                    label="Arrival"
                    type="datetime-local"
                    value={
                      editForm.arrivalAt
                    }
                    onChange={
                      updateEditForm(
                        "arrivalAt"
                      )
                    }
                    required
                  />

                  <FlightInput
                    label="Fare"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      editForm.fare
                    }
                    onChange={
                      updateEditForm(
                        "fare"
                      )
                    }
                    placeholder="6500"
                    required
                  />

                  <FlightInput
                    label="Total Seats"
                    type="number"
                    min="1"
                    step="1"
                    value={
                      editForm.totalSeats
                    }
                    onChange={
                      updateEditForm(
                        "totalSeats"
                      )
                    }
                    placeholder="180"
                    required
                  />

                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-semibold text-slate-700">
                        Current Inventory
                      </p>

                      <p className="mt-1 text-xs text-slate-500">

                        Available seats:{" "}

                        <span className="font-semibold text-slate-700">
                          {
                            flightToEdit.availableSeats
                          }
                        </span>

                        {" / "}

                        {
                          flightToEdit.totalSeats
                        }

                      </p>

                    </div>

                    <Plane
                      size={20}
                      className="text-sky-500"
                    />

                  </div>

                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      closeEditModal
                    }
                    disabled={
                      editing
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      editing
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                  >

                    {editing ? (
                      <>
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Update Flight
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      {/* =====================================================
          ADD MODAL
      ===================================================== */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddModal();
            }
          }}
        >

          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Plane size={21} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Add Flight
                  </h2>

                  <p className="text-sm text-slate-500">
                    Create a new flight and inventory.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  closeAddModal
                }
                disabled={
                  creating
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                handleCreateFlight
              }
              className="p-6"
            >

              {formError && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                  <AlertCircle
                    size={19}
                    className="mt-0.5 text-red-600"
                  />

                  <p className="text-sm text-red-700">
                    {formError}
                  </p>

                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">

                <FlightInput
                  label="Flight Number"
                  value={
                    form.flightNumber
                  }
                  onChange={
                    updateForm(
                      "flightNumber"
                    )
                  }
                  placeholder="AI101"
                  required
                />

                <FlightInput
                  label="Airline"
                  value={
                    form.airline
                  }
                  onChange={
                    updateForm(
                      "airline"
                    )
                  }
                  placeholder="Air India"
                  required
                />

                <FlightInput
                  label="Origin"
                  value={
                    form.origin
                  }
                  onChange={
                    updateForm(
                      "origin"
                    )
                  }
                  placeholder="Chennai"
                  required
                />

                <FlightInput
                  label="Destination"
                  value={
                    form.destination
                  }
                  onChange={
                    updateForm(
                      "destination"
                    )
                  }
                  placeholder="Mumbai"
                  required
                />

                <FlightInput
                  label="Departure"
                  type="datetime-local"
                  value={
                    form.departureAt
                  }
                  onChange={
                    updateForm(
                      "departureAt"
                    )
                  }
                  required
                />

                <FlightInput
                  label="Arrival"
                  type="datetime-local"
                  value={
                    form.arrivalAt
                  }
                  onChange={
                    updateForm(
                      "arrivalAt"
                    )
                  }
                  required
                />

                <FlightInput
                  label="Fare"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.fare
                  }
                  onChange={
                    updateForm(
                      "fare"
                    )
                  }
                  placeholder="6500"
                  required
                />

                <FlightInput
                  label="Total Seats"
                  type="number"
                  min="1"
                  step="1"
                  value={
                    form.totalSeats
                  }
                  onChange={
                    updateForm(
                      "totalSeats"
                    )
                  }
                  placeholder="180"
                  required
                />

              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeAddModal
                  }
                  disabled={
                    creating
                  }
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    creating
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                >

                  {creating ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Create Flight
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

/* =====================================================
   FLIGHT INPUT
===================================================== */

function FlightInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
  step,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />

    </div>
  );
}

/* =====================================================
   ADMIN USER HEADER
===================================================== */

function AdminUserHeader({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [user, setUser] =
    useState<AdminUser | null>(
      null
    );

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) return;

    try {
      setUser(
        JSON.parse(
          storedUser
        ) as AdminUser
      );
    } catch {
      setUser(null);
    }
  }, []);

  const fullName = user
    ? `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim()
    : "Administrator";

  return (
    <div className="flex items-center gap-3 sm:gap-4">

      <div className="hidden text-right sm:block">

        <p className="text-sm font-semibold text-slate-800">
          {fullName ||
            "Administrator"}
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
        className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 sm:flex"
      >
        <LogOut size={19} />
      </button>

    </div>
  );
}