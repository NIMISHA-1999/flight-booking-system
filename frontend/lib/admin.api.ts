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
    const response = await api.get(
      "/admin/dashboard",
    );

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

export const getAdminFlight = async (
  id: string,
): Promise<Flight> => {
  const response = await api.get(
    `/admin/flights/${id}`,
  );

  return response.data.flight;
};

export const createFlight = async (
  data: FlightPayload,
) => {
  const response = await api.post(
    "/admin/flights",
    data,
  );

  return response.data;
};

export const updateFlight = async (
  id: string,
  data: Partial<FlightPayload>,
) => {
  const response = await api.put(
    `/admin/flights/${id}`,
    data,
  );

  return response.data;
};

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
 * INVENTORY
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
    firstName: string;
    lastName: string;
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
}

export interface AdminBookingsResponse {
  bookings: AdminBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAdminBookings =
  async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
    origin?: string;
    destination?: string;
  }): Promise<AdminBookingsResponse> => {
    const response = await api.get(
      "/admin/bookings",
      {
        params,
      },
    );

    return response.data;
  };

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
 * ADMIN CANCEL / REFUND
 * =====================================================
 */

export const cancelAdminBooking = async (
  id: string,
) => {
  const response = await api.post(
    `/admin/bookings/${id}/cancel`,
  );

  return response.data;
};