import api from "@/lib/axios";

/*
 * =====================================================
 * DASHBOARD
 * =====================================================
 */

export interface DashboardStats {
  bookingsToday: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  revenue: number;
  cancellationRate: number;
}

export const getDashboardStats =
  async (): Promise<DashboardStats> => {
    const response = await api.get("/admin/dashboard");

    return response.data.stats;
  };

/*
 * =====================================================
 * FLIGHTS
 * =====================================================
 */

export interface Flight {
  id: string;

  flightNumber: string;
  airline: string;

  origin: string;
  destination: string;

  departureAt: string;
  arrivalAt: string;

  fare: number;

  totalSeats: number;
  availableSeats: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface FlightListResponse {
  success?: boolean;

  flights: Flight[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FlightPayload {
  flightNumber: string;
  airline: string;

  origin: string;
  destination: string;

  departureAt: string;
  arrivalAt: string;

  fare: number;

  totalSeats: number;

  availableSeats?: number;
}

/*
 * =====================================================
 * GET ALL FLIGHTS
 * =====================================================
 */

export const getAdminFlights = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  },
): Promise<FlightListResponse> => {
  const response = await api.get(
    "/admin/flights",
    {
      params,
    },
  );

  return response.data;
};

/*
 * =====================================================
 * GET SINGLE FLIGHT
 * =====================================================
 */

export const getAdminFlight = async (
  id: string,
): Promise<Flight> => {
  const response = await api.get(
    `/admin/flights/${id}`,
  );

  return response.data.flight;
};

/*
 * =====================================================
 * CREATE FLIGHT
 * =====================================================
 */

export const createFlight = async (
  data: FlightPayload,
) => {
  const response = await api.post(
    "/admin/flights",
    data,
  );

  return response.data;
};

/*
 * =====================================================
 * UPDATE FLIGHT
 *
 * IMPORTANT:
 * Backend uses PATCH, not PUT.
 * =====================================================
 */

export const updateFlight = async (
  id: string,
  data: Partial<FlightPayload>,
) => {
  const response = await api.patch(
    `/admin/flights/${id}`,
    data,
  );

  return response.data;
};

/*
 * =====================================================
 * DELETE FLIGHT
 * =====================================================
 */

export const deleteFlight = async (
  id: string,
) => {
  const response = await api.delete(
    `/admin/flights/${id}`,
  );

  return response.data;
};

/*
 * =====================================================
 * UPDATE INVENTORY
 * =====================================================
 */

export const updateFlightInventory = async (
  id: string,
  data: {
    totalSeats: number;
    availableSeats: number;
  },
) => {
  const response = await api.patch(
    `/admin/flights/${id}/inventory`,
    data,
  );

  return response.data;
};

/*
 * =====================================================
 * BOOKINGS
 * =====================================================
 */

export interface AdminBooking {
  id: string;

  bookingReference: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "FAILED";

  totalAmount: number;

  createdAt: string;

  user?: {
    id: string;

    /*
     * Backend currently returns `name`,
     * not firstName / lastName.
     */
    name: string;

    email: string;
  };

  flight: {
    id: string;

    flightNumber: string;
    airline: string;

    origin: string;
    destination: string;

    departureAt: string;
    arrivalAt: string;

    fare?: number;

    totalSeats?: number;
    availableSeats?: number;
  };

  passengers?: Array<{
    id: string;

    fullName: string;

    dateOfBirth: string;

    nationality: string;

    passportNumber: string;

    email: string;

    contactNumber: string;
  }>;

  payments?: Array<{
    id: string;

    amount: number;

    status: string;

    stripePaymentIntentId?: string | null;

    stripeRefundId?: string | null;

    refundedAt?: string | null;
  }>;
}

export interface AdminBookingsResponse {
  success?: boolean;

  count?: number;

  bookings: AdminBooking[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/*
 * =====================================================
 * GET BOOKINGS
 * =====================================================
 */

export const getAdminBookings =
  async (
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      date?: string;
      origin?: string;
      destination?: string;
    },
  ): Promise<AdminBookingsResponse> => {
    const response = await api.get(
      "/admin/bookings",
      {
        params,
      },
    );

    return response.data;
  };

/*
 * =====================================================
 * GET SINGLE BOOKING
 * =====================================================
 */

export const getAdminBooking = async (
  id: string,
): Promise<AdminBooking> => {
  const response = await api.get(
    `/admin/bookings/${id}`,
  );

  return response.data.booking;
};

/*
 * =====================================================
 * ADMIN CANCEL BOOKING
 *
 * IMPORTANT:
 * Backend uses PATCH.
 * =====================================================
 */

export const cancelAdminBooking = async (
  id: string,
) => {
  const response = await api.patch(
    `/admin/bookings/${id}/cancel`,
  );

  return response.data;
};